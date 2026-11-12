"""Voix off française : synthèse neuronale locale (Chatterbox Multilingual).

Étape 1, prises brutes (plusieurs par réplique) :
  python scripts/audio/generate_voice.py takes --out /chemin/prises
Étape 2, choix de la meilleure prise, découpe et finition :
  python scripts/audio/generate_voice.py select --takes /chemin/prises

Moteur : Chatterbox Multilingual (Resemble AI, licence MIT). Le timbre est
donné par scripts/audio/reference-timbre.wav, un extrait de la voix libre
« jessica » (Piper, corpus UPMC, CC BY-SA 4.0).
L'étape 2 vérifie chaque prise par transcription automatique
(faster-whisper) et garde celle qui restitue le texte le plus fidèlement.

Les fichiers produits (public/audio/vo-*.wav) peuvent être remplacés par un
enregistrement en studio portant les mêmes noms.
"""
import argparse, difflib, json, os, re, unicodedata
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "public", "audio")
CFG = json.load(open(os.path.join(HERE, "voiceover.json"), encoding="utf-8"))
SR = 48000


def takes(out, only=None):
    import torch, torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    os.makedirs(out, exist_ok=True)
    model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    ref = os.path.join(HERE, CFG["reference"])
    for line in CFG["lines"]:
        if only and line["id"] != only:
            continue
        for seed in line.get("seeds", CFG["seeds"]):
            torch.manual_seed(seed)
            wav = model.generate(
                line.get("say", line["text"]),
                language_id=CFG["language"],
                audio_prompt_path=ref,
                exaggeration=CFG["exaggeration"],
                cfg_weight=CFG["cfg_weight"],
            )
            ta.save(os.path.join(out, f"{line['id']}-{seed}.wav"), wav, model.sr)
            print(line["id"], seed, round(wav.shape[-1] / model.sr, 2), "s", flush=True)


def plain(text):
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]+", " ", text.replace("-", " ")).split()


def polish(x, sr):
    """Nettoyage léger : coupe-bas, présence, compression douce, normalisation."""
    from scipy import signal

    x = signal.resample_poly(x, SR, sr).astype(np.float64)
    x = signal.sosfilt(signal.butter(2, 85, "hp", fs=SR, output="sos"), x)
    warm = signal.sosfilt(signal.butter(1, [150, 320], "bp", fs=SR, output="sos"), x)
    air = signal.sosfilt(signal.butter(1, 6000, "hp", fs=SR, output="sos"), x)
    x = x + 0.15 * warm + 0.12 * air
    env = np.sqrt(signal.sosfilt(signal.butter(1, 12, "lp", fs=SR, output="sos"), x * x).clip(1e-9))
    thr = 0.09
    x = x * np.where(env > thr, (thr + (env - thr) / 2.5) / env, 1.0)
    return x / np.abs(x).max() * 0.89


def trim(x, pad_in=0.02, pad_out=0.12):
    idx = np.where(np.abs(x) > 0.006)[0]
    x = x[max(0, idx[0] - int(pad_in * SR)): idx[-1] + int(pad_out * SR)].copy()
    fade = int(0.012 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    return x


def select(takes_dir):
    import soundfile as sf
    from scipy import signal
    from faster_whisper import WhisperModel

    asr = WhisperModel("small", device="cpu", compute_type="int8")
    os.makedirs(OUT, exist_ok=True)
    report = {}
    for line in CFG["lines"]:
        want = plain(line.get("say", line["text"]))
        cands = []
        for seed in line.get("seeds", CFG["seeds"]):
            x, sr = sf.read(os.path.join(takes_dir, f"{line['id']}-{seed}.wav"))
            y = signal.resample_poly(x, 16000, sr).astype(np.float32)
            segs, _ = asr.transcribe(y, language="fr", word_timestamps=True)
            words = [w for s in segs for w in s.words]
            got = plain(" ".join(w.word for w in words))
            score = round(difflib.SequenceMatcher(None, want, got).ratio(), 2)
            # Durée utile : du premier au dernier mot reconnu.
            spoken = words[-1].end - words[0].start
            print(line["id"], seed, "fidélité", score, round(spoken, 2), "s |", " ".join(got))
            cands.append((score, spoken, seed, x, sr, words))
        # Prises les plus fidèles, puis celle au débit médian (ni pressée ni traînante).
        top = max(c[0] for c in cands)
        keep = sorted((c for c in cands if c[0] == top), key=lambda c: c[1])
        _, _, seed, x, sr, words = keep[len(keep) // 2]
        # On coupe tout ce qui suit le dernier mot (souffles, bruits de fin).
        x = x[max(0, int((words[0].start - 0.2) * sr)): int((words[-1].end + 0.4) * sr)]
        words = None if "split" not in line else words
        y = polish(x, sr)
        parts = [y]
        if "split" in line:
            shift = max(0, words[0].start - 0.2)
            # Découpe aux virgules : au creux d'énergie entre deux mots.
            cuts = []
            for mark in line["split"]:
                i = next(k for k, w in enumerate(words) if plain(w.word) and plain(w.word)[-1] == plain(mark)[0])
                a = int((words[i].end - shift - 0.04) * SR)
                b = int((words[i + 1].start - shift + 0.06) * SR)
                win = int(0.03 * SR)
                energy = np.convolve(y[a:b] ** 2, np.ones(win) / win, mode="same")
                cuts.append(a + int(np.argmin(energy)))
            edges = [0] + cuts + [len(y)]
            parts = [y[edges[k]: edges[k + 1]] for k in range(len(edges) - 1)]
        for k, part in enumerate(parts):
            name = line["id"] + ("abcdefgh"[k] if len(parts) > 1 else "")
            part = trim(part)
            sf.write(os.path.join(OUT, name + ".wav"), part, SR, subtype="PCM_16")
            report[name] = {"seconds": round(len(part) / SR, 3), "seed": seed}
            print("  →", name, report[name])
    json.dump(report, open(os.path.join(HERE, "voiceover-durations.json"), "w"), indent=2)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("takes"); a.add_argument("--out", required=True); a.add_argument("--only")
    b = sub.add_parser("select"); b.add_argument("--takes", required=True)
    args = ap.parse_args()
    takes(args.out, args.only) if args.cmd == "takes" else select(args.takes)

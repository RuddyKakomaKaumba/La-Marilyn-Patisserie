"""Voix off française (synthèse neuronale locale, Kokoro-82M, voix ff_siwis).

  python scripts/audio/generate_voice.py --model-dir /chemin/vers/kokoro

Modèle : Kokoro-82M (Apache 2.0), voix française entraînée sur le corpus
SIWIS (CC BY 4.0). Les fichiers produits (public/audio/vo-*.wav) peuvent
être remplacés par un enregistrement en studio portant les mêmes noms.
"""
import argparse, json, os
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "public", "audio")
SR = 48000


def polish(x, sr):
    """Nettoyage léger : coupe-bas, présence, compression douce, normalisation."""
    x = signal.resample_poly(x, SR, sr).astype(np.float64)
    x = signal.sosfilt(signal.butter(2, 85, "hp", fs=SR, output="sos"), x)
    # Un peu de chaleur (220 Hz) et d'air (au-dessus de 6 kHz)
    warm = signal.sosfilt(signal.butter(1, [150, 320], "bp", fs=SR, output="sos"), x)
    air = signal.sosfilt(signal.butter(1, 6000, "hp", fs=SR, output="sos"), x)
    x = x + 0.18 * warm + 0.12 * air
    # Compression douce (enveloppe RMS, ratio ~2,5:1)
    env = np.sqrt(signal.sosfilt(signal.butter(1, 12, "lp", fs=SR, output="sos"), x * x).clip(1e-9))
    thr = 0.09
    gain = np.where(env > thr, (thr + (env - thr) / 2.5) / env, 1.0)
    x = x * gain
    # Silences de tête et de queue
    idx = np.where(np.abs(x) > 0.004)[0]
    x = x[max(0, idx[0] - int(0.02 * SR)): idx[-1] + int(0.12 * SR)]
    fade = int(0.01 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    return x / np.abs(x).max() * 0.89


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model-dir", required=True)
    a = ap.parse_args()
    from kokoro_onnx import Kokoro

    cfg = json.load(open(os.path.join(HERE, "voiceover.json"), encoding="utf-8"))
    k = Kokoro(os.path.join(a.model_dir, "model.onnx"), os.path.join(a.model_dir, "voices.bin"))
    os.makedirs(OUT, exist_ok=True)
    durations = {}
    for line in cfg["lines"]:
        s, sr = k.create(line["text"], voice=cfg["voice"], speed=line.get("speed", cfg["speed"]), lang=cfg["lang"])
        y = polish(s, sr)
        sf.write(os.path.join(OUT, line["id"] + ".wav"), y, SR, subtype="PCM_16")
        durations[line["id"]] = round(len(y) / SR, 3)
        print(line["id"], durations[line["id"]], "s")
    json.dump(durations, open(os.path.join(HERE, "voiceover-durations.json"), "w"), indent=2)


if __name__ == "__main__":
    main()

"""Tutoriel : musique originale et effets sonores, entièrement synthétisés.

  python scripts/tutoriel/build_music.py

Aucun échantillon tiers : tout est calculé ici (numpy / scipy), avec les
instruments de scripts/audio/build_audio.py. Musique et effets appartiennent
au projet : exploitation commerciale libre.

Tempo 90 BPM : 20 images par temps et 80 par mesure à 30 i/s. Le découpage
en mesures suit src/tutoriel/timeline.ts (SECTIONS ci-dessous).
"""
import os, sys
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "audio"))
import build_audio as A  # noqa: E402  (instruments partagés)

SR = A.SR
BEAT = 60 / 90
BAR = 4 * BEAT
OUT = os.path.join(HERE, "..", "..", "public", "tutoriel", "audio")
rng = np.random.default_rng(11)

# Mesures (numérotées à partir de 1) : doit correspondre à src/tutoriel/timeline.ts
SECTIONS = {
    "accroche": (1, 2),
    "decouvrir": (3, 6),
    "panier": (7, 11),
    "consulter": (12, 15),
    "whatsapp": (16, 19),
    "final": (20, 22),
}
BARS = SECTIONS["final"][1]
TOTAL = BARS * BAR


def at(bar, beat=0.0):
    return (bar - 1) * BAR + beat * BEAT


def buf(seconds=TOTAL + 4):
    return np.zeros((int(seconds * SR), 2))


def section(bar):
    for name, (a, b) in SECTIONS.items():
        if a <= bar <= b:
            return name
    return "final"


# ------------------------------------------------------------ instruments
def pluck(m, dur, vel=1.0, bright=0.5):
    """Corde pincée (Karplus-Strong) : timbre moderne, net et doux."""
    f = A.hz(m)
    n = int((dur + 1.2) * SR)
    period = int(SR / f)
    x = np.zeros(n)
    x[:period] = A.lp(rng.standard_normal(period), 2000 + 6000 * bright)
    decay = 0.996 - 0.004 * (1 - bright)
    # y[i] = x[i] + decay/2 · (y[i-P] + y[i-P-1]) : filtre en peigne récursif
    a = np.zeros(period + 2)
    a[0], a[period], a[period + 1] = 1.0, -decay / 2, -decay / 2
    y = signal.lfilter([1.0], a, x)
    y *= np.clip((dur + 1.2 - np.arange(n) / SR) / 0.3, 0, 1)
    return y / (np.abs(y).max() + 1e-9) * vel * 0.22


def ep(notes, dur, vel=1.0):
    """Piano électrique (synthèse FM douce), pour les accords."""
    n = int((dur + 1.5) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in notes:
        f = A.hz(m)
        index = 1.4 * np.exp(-t * 4)
        out += np.sin(2 * np.pi * f * t + index * np.sin(2 * np.pi * f * t)) * np.exp(-t * 1.1)
        out += 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
    att = int(0.004 * SR)
    out[:att] *= np.linspace(0, 1, att)
    out *= np.clip((dur + 1.5 - t) / 0.4, 0, 1)
    return out * vel * 0.05


def hat(vel=1.0, open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    y = A.hp(rng.standard_normal(n), 7000) * np.exp(-t * (14 if open_ else 70))
    return y * vel * 0.06


def subkick(vel=1.0):
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = 44 + 60 * np.exp(-t * 28)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)
    y[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return y * vel * 0.5


# ---------------------------------------------------------------- harmonie
# Fa majeur : (basse, voicing). Couleurs maj7 / add9, sans dissonance appuyée.
F = (41, [60, 64, 65, 69, 72])      # Fa maj7
Dm = (38, [60, 62, 65, 69, 72])     # Ré m7
Bb = (46, [58, 62, 65, 69, 72])     # Si♭ maj7
C = (48, [60, 62, 64, 67, 70])      # Do 9 sus
Am = (45, [60, 64, 67, 69, 72])     # La m7
Gm = (43, [58, 62, 65, 67, 70])     # Sol m7
LOOP = [F, Dm, Bb, C]
PROG = {b: LOOP[(b - 1) % 4] for b in range(1, BARS + 1)}
PROG.update({12: Am, 13: Dm, 14: Gm, 15: C, 19: C, 20: F, 21: Bb, 22: F})

# Motif de la célesta (temps, demi-tons au-dessus de la tonique du ton)
HOOK = [(0, 81), (0.75, 77), (1.5, 79), (2.5, 84), (3.0, 81)]


def build():
    dry = buf()
    wet = buf()
    for bar in range(1, BARS + 1):
        root, notes = PROG[bar]
        sec = section(bar)
        t0 = at(bar)
        last = bar == BARS
        dur = BAR * (2.4 if last else 1)
        # Nappe : toujours là, plus ouverte au fil du film
        lvl = {"accroche": 0.55, "decouvrir": 0.6, "panier": 0.65, "consulter": 0.6, "whatsapp": 0.75, "final": 0.95}[sec]
        A.add(wet, A.pad(notes[:4], dur + 0.2, lvl, attack=1.4 if bar == 1 else 0.5, release=2.6 if last else 1.0, bright=1100 + 60 * bar), t0)
        # Accords de piano électrique sur les temps 1 et 3 (syncope légère)
        if sec != "accroche":
            for beat, v in [(0, 0.9), (1.5, 0.45), (2.5, 0.6)]:
                if last and beat:
                    continue
                A.add(wet, ep(notes[1:4], BEAT * (6 if last else 1.2), v), t0 + beat * BEAT)
        # Basse
        if sec not in ("accroche",) and bar != 3:
            pattern = [(0, 1.5, 0.9), (2, 1, 0.7), (3, 0.5, 0.6), (3.5, 0.5, 0.5)] if sec in ("panier", "whatsapp", "final") else [(0, 3.5, 0.8)]
            for beat, d, v in pattern:
                m = root + (7 if beat == 3.5 else 0)
                A.add(dry, A.bass(m, BEAT * d * (3 if last else 1), v), t0 + beat * BEAT)
        # Arpège pincé en doubles croches légères
        if sec in ("decouvrir", "panier", "consulter", "whatsapp"):
            order = [0, 2, 4, 3, 1, 3, 4, 2]
            for i in range(8):
                m = notes[order[i]] + 12
                A.add(wet, pluck(m, BEAT * 0.45, 0.85 if i % 4 == 0 else 0.55, 0.45), t0 + i * BEAT / 2 + (0.01 if i % 2 else 0), 1.0, (i % 4 - 1.5) * 0.3)
        # Rythmique discrète
        if sec in ("panier", "consulter", "whatsapp") or (sec == "decouvrir" and bar >= 5):
            light = sec in ("decouvrir", "consulter")
            for beat in range(4):
                tb = t0 + beat * BEAT
                if beat in (0, 2):
                    A.add(dry, subkick(0.7 if light else 0.95), tb)
                if beat in (1, 3):
                    A.add(dry, A.snap(0.45 if light else 0.75), tb, 1.0, 0.12)
                for k in range(2):
                    A.add(dry, hat(0.8 if k else 1.0, open_=(k == 1 and beat == 3)), tb + k * BEAT / 2 + (0.014 if k else 0), 1.0, -0.3)
        # Célesta : motif d'accroche, repris aux charnières
        if bar in (1, 2, 7, 12, 16, 20, 21):
            shift = {12: -3, 16: 0, 20: 0, 21: 2}.get(bar, 0)
            for beat, m in HOOK:
                A.add(wet, A.bell(m + shift, BEAT, 0.6 if bar < 20 else 0.85), t0 + beat * BEAT, 1.0, 0.2)
        if last:
            for i, m in enumerate([root + 12] + notes + [notes[-1] + 5]):
                A.add(wet, A.piano(m, 6, 0.7), t0 + i * 0.03, 1.0, (i - 3) * 0.2)

    # Respirations et impacts aux charnières des séquences
    A.add(wet, A.shimmer(2.0, 0.5, base=84), at(1, 0.3))
    for name in ("decouvrir", "panier", "consulter", "whatsapp"):
        b = SECTIONS[name][0]
        A.add(wet, A.sweep(1.2, 300, 5000, 0.35), at(b) - 1.2)
        A.add(dry, A.impact(0.4), at(b))
    A.add(wet, A.sweep(2.4, 250, 8000, 0.55, shape=2.4), at(SECTIONS["final"][0]) - 2.4)
    A.add(dry, A.impact(0.85), at(SECTIONS["final"][0]))
    A.add(wet, A.shimmer(2.4, 0.65, base=86), at(SECTIONS["final"][0], 0.2))

    mix = A.reverb(wet, 2.6, 0.3) + A.reverb(dry, 1.0, 0.07, seed=5)
    mix = A.hp(mix, 30)
    t = np.arange(len(mix)) / SR
    mix *= np.clip(t / 0.2, 0, 1)[:, None]
    mix *= np.clip((TOTAL - t) / 1.8, 0, 1)[:, None] ** 1.3
    mix = mix[: int(TOTAL * SR)]
    mix = np.tanh(mix * 1.2) / 1.2
    return mix / np.abs(mix).max() * 0.9


# ------------------------------------------------------------------ effets
def stereo(x):
    return x if x.ndim == 2 else np.stack([x, x], axis=1)


def sfx_add():
    """Ajout au panier : deux notes rondes qui montent, sur un petit « toc »."""
    out = np.zeros((int(1.6 * SR), 2))
    n = int(0.05 * SR)
    toc = A.bp(rng.standard_normal(n), 600, 2200) * np.exp(-np.arange(n) / SR * 90) * 0.4
    A.add(out, toc, 0.0)
    A.add(out, A.bell(84, 0.12, 1.7), 0.0, 1.0, -0.15)
    A.add(out, A.bell(91, 0.3, 1.9), 0.09, 1.0, 0.15)
    return A.reverb(out, 1.1, 0.25)


def sfx_count():
    """Compteur du panier : tintement bref et aigu."""
    out = np.zeros((int(0.9 * SR), 2))
    A.add(out, A.bell(96, 0.08, 1.4), 0.0, 1.0, 0.35)
    return A.reverb(out, 0.7, 0.2)


def sfx_drawer():
    """Ouverture du panier : souffle qui monte, très court, et un frôlement."""
    n = int(0.9 * SR)
    y = A.sweep(0.32, 500, 4200, 0.9, shape=1.3, tail=0.4)
    out = np.zeros((n, 2))
    out[: min(n, len(y))] = y[:n]
    return A.reverb(out, 0.6, 0.15)


def sfx_total():
    """Apparition du total : accord cristallin arpégé."""
    out = np.zeros((int(2.2 * SR), 2))
    for i, m in enumerate([77, 81, 84, 89]):
        A.add(out, A.bell(m, 0.4, 1.2 - i * 0.12), i * 0.05, 1.0, (i - 1.5) * 0.3)
    return A.reverb(out, 1.4, 0.3)


def sfx_final():
    out = np.zeros((int(3.2 * SR), 2))
    A.add(out, A.impact(1.0), 0.0)
    A.add(out, A.shimmer(1.4, 0.9, base=86), 0.05)
    return A.reverb(out, 1.8, 0.25)


def norm(x, peak):
    return x / np.abs(x).max() * peak


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {
        "musique.wav": build(),
        "sfx-whoosh.wav": norm(A.sfx_whoosh(0.6, True), 0.7),
        "sfx-whoosh-down.wav": norm(A.sfx_whoosh(0.5, False), 0.6),
        "sfx-tap.wav": norm(A.sfx_tap(), 0.6),
        "sfx-type.wav": norm(A.sfx_type(), 0.4),
        "sfx-shimmer.wav": norm(A.reverb(A.shimmer(1.2, 1.0, base=88), 1.6, 0.3), 0.6),
        "sfx-add.wav": norm(sfx_add(), 0.7),
        "sfx-count.wav": norm(sfx_count(), 0.55),
        "sfx-drawer.wav": norm(sfx_drawer(), 0.6),
        "sfx-total.wav": norm(sfx_total(), 0.65),
        "sfx-send.wav": norm(A.sfx_pop(), 0.7),
        "sfx-final.wav": norm(sfx_final(), 0.8),
    }
    for name, data in files.items():
        sf.write(os.path.join(OUT, name), stereo(data), SR, subtype="PCM_16")
        print(name, round(len(data) / SR, 2), "s")


if __name__ == "__main__":
    main()

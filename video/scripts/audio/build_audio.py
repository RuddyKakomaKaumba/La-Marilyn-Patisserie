"""Musique originale et effets sonores du film, entièrement synthétisés.

  python scripts/audio/build_audio.py

Aucun échantillon tiers : chaque son est calculé ici (numpy / scipy). La
musique et les effets appartiennent donc au projet et sont librement
exploitables pour la promotion de La Marilyn.

Tempo : 90 BPM, soit 20 images par temps à 30 i/s et 80 images par mesure.
Le film dure exactement 15 mesures (40 s) ; chaque séquence commence sur
un premier temps (voir src/timeline.ts).
"""
import os
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
TOTAL = 40.0
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "audio")
rng = np.random.default_rng(7)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def buf(seconds=TOTAL + 3):
    return np.zeros((int(seconds * SR), 2))


def add(dst, src, t, gain=1.0, pan=0.0):
    """Ajoute un son mono ou stéréo à l'instant t (pan : -1 gauche, 1 droite)."""
    i = int(round(t * SR))
    if src.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4)
        r = np.sin((pan + 1) * np.pi / 4)
        src = np.stack([src * l, src * r], axis=1) * np.sqrt(2) * 0.707
    n = min(len(src), len(dst) - i)
    if n > 0:
        dst[i:i + n] += src[:n] * gain


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "lp", fs=SR, output="sos"), x, axis=0)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "hp", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "bp", fs=SR, output="sos"), x, axis=0)


def reverb(x, seconds=2.6, wet=0.3, bright=5200, seed=3):
    """Réverbération à convolution : bruit décroissant filtré, stéréo."""
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-t * 6.9 / seconds)[:, None]
    ir = lp(hp(ir, 220), bright)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    wetsig = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x + wet * wetsig


# --------------------------------------------------------------- instruments
def piano(m, dur, vel=1.0):
    """Piano feutré : partiels légèrement inharmoniques, attaque douce."""
    f = hz(m)
    n = int((dur + 1.6) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k, a in enumerate([1.0, 0.42, 0.2, 0.09, 0.04, 0.02], start=1):
        fk = f * k * np.sqrt(1 + 0.00035 * k * k)
        if fk > 9000:
            break
        y += a * np.sin(2 * np.pi * fk * t + rng.uniform(0, 0.4)) * np.exp(-t * (1.4 + 0.9 * k) * (f / 262) ** 0.35)
    att = int(0.006 * SR)
    y[:att] *= np.linspace(0, 1, att) ** 2
    rel = np.clip((dur + 1.6 - t) / 0.5, 0, 1)
    # Petit bruit de marteau
    ham = lp(rng.standard_normal(int(0.02 * SR)), 2500) * np.linspace(1, 0, int(0.02 * SR)) * 0.05
    y[: len(ham)] += ham
    return y * rel * vel * 0.3


def bell(m, dur, vel=1.0):
    """Célesta : sinus pur et une touche d'harmonique, longue résonance."""
    f = hz(m)
    n = int((dur + 2.0) * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 5) + 0.08 * np.sin(2 * np.pi * 4.01 * f * t) * np.exp(-t * 9)
    y *= np.exp(-t * 2.4)
    att = int(0.004 * SR)
    y[:att] *= np.linspace(0, 1, att)
    return y * vel * 0.2


def pad(notes, dur, vel=1.0, attack=0.9, release=1.4, bright=1500):
    """Nappe de cordes : dents de scie désaccordées, filtrées, en stéréo."""
    n = int((dur + release) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for m in notes:
        for det, pan in [(-0.07, -0.7), (0.0, 0.0), (0.08, 0.7)]:
            f = hz(m + det)
            ph = rng.uniform(0, 1)
            saw = 2 * ((f * t + ph) % 1) - 1
            vib = 1 + 0.004 * np.sin(2 * np.pi * 4.6 * t + ph * 6)
            saw = 2 * ((f * t * vib + ph) % 1) - 1
            l = np.cos((pan + 1) * np.pi / 4)
            r = np.sin((pan + 1) * np.pi / 4)
            out += np.stack([saw * l, saw * r], axis=1)
    out = lp(out, bright, 2)
    env = np.clip(t / attack, 0, 1) ** 1.5 * np.clip((dur + release - t) / release, 0, 1) ** 1.5
    return out * env[:, None] * vel * 0.03


def bass(m, dur, vel=1.0):
    f = hz(m)
    n = int((dur + 0.25) * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3) + 0.08 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 5)
    env = np.clip(t / 0.015, 0, 1) * np.exp(-t * 0.9) * np.clip((dur + 0.25 - t) / 0.2, 0, 1)
    return y * env * vel * 0.34


def kick(vel=1.0):
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    f = 46 + 70 * np.exp(-t * 32)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
    return y * vel * 0.55


def snap(vel=1.0):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    y = bp(rng.standard_normal(n), 1300, 4200) * np.exp(-t * 34)
    y += 0.5 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 45)
    return y * vel * 0.2


def shaker(vel=1.0):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    env = np.clip(t / 0.012, 0, 1) * np.exp(-t * 48)
    return hp(rng.standard_normal(n), 5200) * env * vel * 0.05


def sweep(dur, f0, f1, vel=1.0, shape=2.0, tail=0.25):
    """Souffle filtré qui monte (ou descend) : base des transitions."""
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal((n, 2))
    out = np.zeros((n, 2))
    step = 256
    prog = np.clip(t / dur, 0, 1)
    fc = f0 * (f1 / f0) ** prog
    zi = None
    for i in range(0, n, step):
        c = fc[i]
        sos = signal.butter(2, [c * 0.7, min(c * 1.4, SR / 2 - 500)], "bp", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2, 2))
        out[i:i + step], zi = signal.sosfilt(sos, noise[i:i + step], axis=0, zi=zi)
    env = np.where(t < dur, (t / dur) ** shape, np.exp(-(t - dur) * 5 / tail))
    return out * env[:, None] * vel * 0.3


def impact(vel=1.0):
    """Impact feutré : grave profond, souffle et scintillement."""
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    low = np.sin(2 * np.pi * np.cumsum(38 + 40 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.6)
    air = lp(rng.standard_normal((n, 2)), 1800) * np.exp(-t * 4.5)[:, None] * 0.35
    y = np.stack([low, low], axis=1) * 0.8 + air
    y[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]
    return y * vel * 0.6


def shimmer(dur=1.8, vel=1.0, base=84):
    """Poussière d'or : pluie de petites notes cristallines."""
    out = np.zeros((int((dur + 2.2) * SR), 2))
    scale = [0, 2, 4, 7, 9, 12, 14, 16, 19]
    count = int(dur * 14)
    for i in range(count):
        t0 = (i / count) ** 0.8 * dur + rng.uniform(0, 0.03)
        m = base + scale[rng.integers(0, len(scale))]
        add(out, bell(m, 0.2, 0.22 + 0.25 * rng.random()), t0, 1.0, rng.uniform(-0.9, 0.9))
    return out * vel


# ------------------------------------------------------------------- musique
# Accords (ré majeur) : basse, puis voix de l'accord.
D9 = (38, [57, 61, 64, 66, 69])      # Ré maj9
Bm9 = (35, [57, 61, 62, 66, 69])     # Si m9
G9 = (43, [57, 59, 62, 66, 69])      # Sol maj9
A6 = (45, [57, 59, 61, 64, 66])      # La 6/9
Asus = (45, [57, 62, 64, 67, 69])    # La 7sus4
Am = (45, [57, 61, 64, 67, 69])      # La 7
Em9 = (40, [55, 59, 62, 66, 67])     # Mi m9
Fsm = (42, [57, 61, 64, 66, 69])     # Fa# m7
Dadd = (38, [57, 62, 64, 66, 69])    # Ré add9

# (mesure, temps de début, durée en temps, accord)
PROG = [
    (1, 0, 4, D9), (2, 0, 4, Bm9),
    (3, 0, 4, G9), (4, 0, 4, A6), (5, 0, 2, Bm9), (5, 2, 2, Asus),
    (6, 0, 4, D9), (7, 0, 4, Bm9), (8, 0, 4, G9), (9, 0, 2, Asus), (9, 2, 2, Am),
    (10, 0, 4, Em9), (11, 0, 4, Fsm), (12, 0, 2, G9), (12, 2, 2, Asus),
    (13, 0, 4, D9), (14, 0, 2, G9), (14, 2, 2, Asus), (15, 0, 4, Dadd),
]


def at(bar, beat=0.0):
    return (bar - 1) * BAR + beat * BEAT


def build_music():
    dry = buf()      # éléments peu réverbérés (basse, rythmique)
    wet = buf()      # piano, célesta, nappes
    for bar, b0, nb, (root, notes) in PROG:
        t0 = at(bar, b0)
        dur = nb * BEAT
        last = bar == 15
        # Nappe : s'ouvre au fil du film
        level = {1: 0.55, 2: 0.6, 3: 0.75, 4: 0.8, 5: 0.85}.get(bar, 0.9 if bar < 13 else 1.15)
        bright = 900 + 110 * bar
        add(wet, pad(notes[:4], dur + (5 if last else 0.2), level, attack=1.6 if bar == 1 else 0.5, release=3.0 if last else 1.2, bright=bright), t0)
        if bar >= 13:
            add(wet, pad([n + 12 for n in notes[2:5]], dur + (5 if last else 0.2), 0.5, attack=0.6, release=3.0 if last else 1.2, bright=2600), t0)
        # Basse
        if bar >= 3:
            add(dry, bass(root, dur * 0.9 if not last else 6, 0.9), t0)
            if bar >= 6 and nb == 4 and not last:
                add(dry, bass(root, BEAT * 0.8, 0.6), t0 + 2.5 * BEAT)
                add(dry, bass(root + 7, BEAT * 0.8, 0.5), t0 + 3.5 * BEAT)
        # Piano
        if last:
            for i, m in enumerate([root + 12] + notes + [notes[-1] + 5]):
                add(wet, piano(m, 6, 0.8), t0 + i * 0.035, 1.0, (i - 3) * 0.2)
        elif bar <= 2:
            # Introduction : quelques notes suspendues
            for beat, m, v in [(0, notes[1] + 12, 0.7), (1.5, notes[3] + 12, 0.55), (2.5, notes[4] + 12, 0.6), (3.5, notes[2] + 12, 0.45)]:
                add(wet, piano(m, 2.5, v), t0 + beat * BEAT, 1.0, rng.uniform(-0.4, 0.4))
        else:
            # Arpège en croches, plus appuyé à partir de la séquence 3
            order = [0, 2, 3, 4, 3, 2, 4, 2]
            for i in range(int(nb * 2)):
                m = notes[order[i % 8]] + (12 if bar >= 6 else 0)
                acc = 1.0 if i % 4 == 0 else 0.62
                vol = (0.62 if bar < 6 else 0.78 if bar < 10 else 0.6 if bar < 13 else 0.9) * acc
                swing = 0.012 if i % 2 else 0
                add(wet, piano(m, BEAT * 0.9, vol), t0 + i * BEAT / 2 + swing, 1.0, ((i % 4) - 1.5) * 0.25)
            if bar >= 6 and b0 == 0:
                add(wet, piano(root + 24, dur, 0.5), t0, 1.0, -0.2)

    # Mélodie au célesta (séquences 2, 3 et 5)
    MELODY = [
        (3, 0, 78, 1.5), (3, 2, 76, 1), (3, 3, 74, 1),
        (4, 0, 76, 2), (4, 2.5, 73, 1.5),
        (5, 0, 74, 1.5), (5, 2, 76, 1), (5, 3, 78, 1),
        (6, 0, 81, 1.5), (6, 1.5, 78, 0.5), (6, 2, 76, 1), (6, 3, 78, 1),
        (7, 0, 74, 1.5), (7, 2, 73, 1), (7, 3, 74, 1),
        (8, 0, 78, 1.5), (8, 1.5, 76, 0.5), (8, 2, 74, 1), (8, 3, 71, 1),
        (9, 0, 76, 2), (9, 2, 73, 1), (9, 3, 76, 1),
        (10, 0, 78, 2), (10, 2.5, 74, 1.5),
        (11, 0, 76, 2), (11, 2.5, 73, 1.5),
        (12, 0, 74, 1), (12, 1, 76, 1), (12, 2, 78, 1), (12, 3, 81, 1),
        (13, 0, 86, 1.5), (13, 1.5, 85, 0.5), (13, 2, 81, 1), (13, 3, 78, 1),
        (14, 0, 83, 1.5), (14, 2, 81, 1), (14, 3, 85, 1),
        (15, 0, 86, 4),
    ]
    for bar, beat, m, d in MELODY:
        v = 0.55 if bar < 6 else 0.75 if bar < 10 else 0.5 if bar < 13 else 0.95
        add(wet, bell(m, d * BEAT, v), at(bar, beat), 1.0, 0.25)
        if bar >= 13:
            add(wet, bell(m - 12, d * BEAT, v * 0.6), at(bar, beat), 1.0, -0.25)

    # Rythmique légère : entre à la séquence 3, s'allège en 4, revient en 5
    for bar in range(6, 15):
        light = 10 <= bar <= 12
        for beat in range(4):
            t0 = at(bar, beat)
            if beat in (0, 2) and not (light and beat == 2):
                add(dry, kick(0.75 if light else 1.0), t0)
            if beat in (1, 3):
                add(dry, snap(0.6 if light else 1.0), t0, 1.0, 0.15)
            for k in range(2):
                add(dry, shaker((1.0 if k == 0 else 0.6) * (0.7 if light else 1.0)), t0 + k * BEAT / 2 + (0.012 if k else 0), 1.0, -0.35)
    # Levée de deux temps avant la séquence 3
    for k, v in enumerate([0.3, 0.45, 0.6, 0.8]):
        add(dry, snap(v * 0.7), at(5, 2 + k * 0.5), 1.0, 0.15)

    # Respirations et impacts sur les charnières du film
    add(wet, shimmer(2.2, 0.55), at(1, 0.5))
    add(wet, sweep(1.25, 300, 5000, 0.5), at(3) - 1.25)
    add(dry, impact(0.75), at(3))
    add(wet, sweep(0.9, 400, 6000, 0.45), at(6) - 0.9)
    add(dry, impact(0.55), at(6))
    add(wet, sweep(0.9, 500, 4000, 0.3), at(10) - 0.9)
    add(wet, sweep(2.6, 250, 8000, 0.75, shape=2.6), at(13) - 2.6)
    add(dry, impact(1.0), at(13))
    add(wet, shimmer(2.4, 0.7, base=86), at(13, 0.2))
    add(wet, shimmer(2.0, 0.5, base=86), at(15, 0.2))

    mix = reverb(wet, 3.0, 0.34) + reverb(dry, 1.2, 0.08, seed=5)
    mix = hp(mix, 32)
    # Courbe d'intensité générale : montée progressive jusqu'au final
    t = np.arange(len(mix)) / SR
    pts_t = [0, at(3), at(6), at(10), at(12), at(13), at(15), 40, 43]
    pts_g = [0.72, 0.82, 0.92, 0.85, 0.92, 1.0, 1.0, 1.0, 1.0]
    mix *= np.interp(t, pts_t, pts_g)[:, None]
    # Fondu d'entrée et de sortie
    mix *= np.clip(t / 0.25, 0, 1)[:, None]
    mix *= np.clip((TOTAL - t) / 1.6, 0, 1)[:, None] ** 1.3
    mix = mix[: int(TOTAL * SR)]
    mix = np.tanh(mix * 1.25) / 1.25          # saturation très douce
    return mix / np.abs(mix).max() * 0.9


# --------------------------------------------------------------------- effets
def stereo(x):
    return x if x.ndim == 2 else np.stack([x, x], axis=1)


def sfx_whoosh(dur=0.55, up=True, vel=1.0):
    a, b = (350, 5200) if up else (5200, 350)
    n = int((dur + 0.5) * SR)
    y = sweep(dur * 0.55, a, b, vel, shape=1.6, tail=dur * 0.6)
    out = np.zeros((n, 2))
    out[: min(n, len(y))] = y[:n]
    return reverb(out, 0.8, 0.2)


def sfx_tap():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 1350 * t) * np.exp(-t * 85) * 0.5 + np.sin(2 * np.pi * 640 * t) * np.exp(-t * 60) * 0.35
    y[:40] *= np.linspace(0, 1, 40)
    return reverb(stereo(np.pad(y, (0, int(0.4 * SR)))), 0.4, 0.12)


def sfx_pop():
    """Envoi du message : deux notes montantes, rondes."""
    out = np.zeros((int(1.4 * SR), 2))
    add(out, bell(81, 0.15, 1.6), 0.0)
    add(out, bell(88, 0.3, 1.8), 0.11)
    return reverb(out, 1.0, 0.25)


def sfx_type():
    """Saisie discrète dans un champ : trois frappes feutrées."""
    out = np.zeros((int(0.7 * SR), 2))
    for i, t0 in enumerate([0.0, 0.09, 0.2]):
        n = int(0.03 * SR)
        y = bp(rng.standard_normal(n), 1800, 5200) * np.exp(-np.arange(n) / SR * 160)
        add(out, y, t0, 0.5 + 0.1 * i, rng.uniform(-0.3, 0.3))
    return out


def norm(x, peak):
    return x / np.abs(x).max() * peak


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {
        "music.wav": build_music(),
        "sfx-whoosh.wav": norm(sfx_whoosh(0.6, True), 0.7),
        "sfx-whoosh-down.wav": norm(sfx_whoosh(0.5, False), 0.6),
        "sfx-tap.wav": norm(sfx_tap(), 0.6),
        "sfx-pop.wav": norm(sfx_pop(), 0.7),
        "sfx-type.wav": norm(sfx_type(), 0.4),
        "sfx-shimmer.wav": norm(reverb(shimmer(1.2, 1.0, base=88), 1.6, 0.3), 0.6),
    }
    for name, data in files.items():
        sf.write(os.path.join(OUT, name), data, SR, subtype="PCM_16")
        print(name, round(len(data) / SR, 2), "s")


if __name__ == "__main__":
    main()

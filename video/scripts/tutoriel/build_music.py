"""Tutoriel : musique originale (afro-house, 120 BPM) et effets sonores.

  python scripts/tutoriel/build_music.py

Tout est synthétisé ici (numpy / scipy) : aucun échantillon tiers, la
musique et les effets appartiennent au projet (exploitation commerciale
libre).

Tempo 120 BPM : 15 images par temps et 60 par mesure à 30 i/s. Le film dure
25 mesures (50 s). Le découpage en mesures suit src/tutoriel/timeline.ts
(SECTIONS ci-dessous) : montée sur l'accroche, drop à l'apparition du site,
roulement de caisse claire avant chaque étape.
"""
import os
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
STEP = BEAT / 4  # double croche
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "tutoriel", "audio")
rng = np.random.default_rng(23)

# Mesures (à partir de 1) : doit correspondre à src/tutoriel/timeline.ts
SECTIONS = {
    "intro": (1, 2),      # accroche : montage des créations, montée
    "drop": (3, 3),       # le site apparaît
    "etape1": (4, 7),
    "etape2": (8, 12),
    "etape3": (13, 16),
    "etape4": (17, 21),
    "final": (22, 25),
}
BARS = 25
TOTAL = BARS * BAR
LAST_HIT = (25 - 1) * BAR  # dernier accent : premier temps de la mesure 25


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def at(bar, step=0.0):
    """Instant d'une double croche (0 à 15) dans une mesure (à partir de 1)."""
    return (bar - 1) * BAR + step * STEP


def section(bar):
    for name, (a, b) in SECTIONS.items():
        if a <= bar <= b:
            return name
    return "final"


def buf(seconds=TOTAL + 3):
    return np.zeros((int(seconds * SR), 2))


def add(dst, src, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i < 0:
        src = src[-i:]
        i = 0
    if src.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        src = np.stack([src * l, src * r], axis=1) * np.sqrt(2)
    n = min(len(src), len(dst) - i)
    if n > 0:
        dst[i:i + n] += src[:n] * gain


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


def lp(x, f, order=2):
    return signal.sosfilt(sos("lp", f, order), x, axis=0)


def hp(x, f, order=2):
    return signal.sosfilt(sos("hp", f, order), x, axis=0)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(sos("bp", [lo, hi], order), x, axis=0)


def env(n, attack, decay):
    t = np.arange(n) / SR
    e = np.exp(-t / decay)
    a = int(attack * SR)
    if a > 0:
        e[:a] *= np.linspace(0, 1, a)
    return e


def reverb(x, seconds=1.4, wet=0.18, bright=6000, seed=3):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-t * 6.9 / seconds)[:, None]
    ir = lp(hp(ir, 250), bright)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    w = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x + wet * w


def stereo(x):
    return x if x.ndim == 2 else np.stack([x, x], axis=1)


# ------------------------------------------------------------- batterie
def kick(vel=1.0):
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 52 + 120 * np.exp(-t * 38)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    click = bp(rng.standard_normal(n), 1800, 6000) * np.exp(-t * 300) * 0.6
    y = np.tanh((body + click) * 1.8) / np.tanh(1.8)
    return y * vel * 0.5


def clap(vel=1.0):
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    noise = bp(rng.standard_normal(n), 900, 3200)
    e = np.zeros(n)
    for k, d in enumerate([0.0, 0.011, 0.022]):
        i = int(d * SR)
        e[i:] += np.exp(-(t[: n - i]) * (160 if k < 2 else 22)) * (0.7 if k < 2 else 1.0)
    y = noise * e
    y += 0.25 * np.sin(2 * np.pi * 220 * t) * np.exp(-t * 60)
    return y * vel * 0.42


def snare(vel=1.0):
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    y = bp(rng.standard_normal(n), 1500, 7000) * np.exp(-t * 28) + 0.5 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 40)
    return y * vel * 0.26


def hat(vel=1.0, open_=False):
    n = int((0.26 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    # Métallique : carrés désaccordés, filtrés dans l'aigu
    metal = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in (317, 449, 581, 733, 857, 1033))
    y = hp(metal * 0.3 + rng.standard_normal(n) * 0.7, 7500)
    y *= np.exp(-t * (11 if open_ else 85))
    return y * vel * 0.085


def shaker(vel=1.0):
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    e = np.clip(t / 0.01, 0, 1) * np.exp(-t * 55)
    return bp(rng.standard_normal(n), 5500, 12000) * e * vel * 0.07


def conga(m, vel=1.0, slap=False):
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    f = hz(m) * (1 + 0.25 * np.exp(-t * 60))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (14 if not slap else 26))
    y += bp(rng.standard_normal(n), 1200, 5000) * np.exp(-t * 120) * (0.5 if slap else 0.15)
    return y * vel * 0.4


def tom(m, vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = hz(m) * (1 + 0.6 * np.exp(-t * 30))
    return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)) * vel * 0.3


# ------------------------------------------------------------ mélodique
def logdrum(m, dur, vel=1.0):
    """Basse « log drum » (amapiano) : boisée, attaque en glissando."""
    n = int((dur + 0.15) * SR)
    t = np.arange(n) / SR
    f = hz(m) * (1 + 1.0 * np.exp(-t * 55))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.4 * np.sin(3 * ph) * np.exp(-t * 6) + 0.2 * np.sin(4 * ph) * np.exp(-t * 10)
    y *= np.exp(-t * 3.2) * np.clip((dur + 0.15 - t) / 0.06, 0, 1)
    y = np.tanh(y * 1.6)
    return lp(y, 2200) * vel * 0.3


def stab(notes, vel=1.0, dur=0.16):
    """Accord plaqué court (orgue / piano house), légèrement désaccordé."""
    n = int((dur + 0.25) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for m in notes:
        for det, pan in ((-0.06, -0.6), (0.06, 0.6)):
            f = hz(m + det)
            saw = 2 * ((f * t + rng.random()) % 1) - 1
            sq = np.sign(np.sin(2 * np.pi * f * t))
            v = 0.6 * saw + 0.4 * sq
            l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
            out += np.stack([v * l, v * r], axis=1)
    e = np.clip(t / 0.003, 0, 1) * np.exp(-t / dur * 2.2)
    out = lp(out * e[:, None], 3600)
    return out * vel * 0.11


def marimba(m, vel=1.0):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    f = hz(m)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + 0.45 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 22)
    y += 0.12 * np.sin(2 * np.pi * 10 * f * t) * np.exp(-t * 60)
    y[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return y * vel * 0.42


def pad(notes, dur, vel=1.0):
    n = int((dur + 0.6) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for m in notes:
        for det, pan in ((-0.08, -0.8), (0.08, 0.8)):
            f = hz(m + det)
            saw = 2 * ((f * t + rng.random()) % 1) - 1
            l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
            out += np.stack([saw * l, saw * r], axis=1)
    e = np.clip(t / 0.25, 0, 1) * np.clip((dur + 0.6 - t) / 0.6, 0, 1)
    return lp(out * e[:, None], 2400) * vel * 0.035


def noise_sweep(dur, f0, f1, vel=1.0, reverse=False):
    """Montée (ou descente) de bruit filtré : transitions et risers."""
    n = int(dur * SR)
    noise = rng.standard_normal((n, 2))
    out = np.zeros_like(noise)
    step = 256
    prog = np.linspace(0, 1, n)
    fc = f0 * (f1 / f0) ** prog
    zi = None
    for i in range(0, n, step):
        c = fc[i]
        s = signal.butter(2, [max(40, c * 0.6), min(c * 1.6, SR / 2 - 500)], "bp", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((s.shape[0], 2, 2))
        out[i:i + step], zi = signal.sosfilt(s, noise[i:i + step], axis=0, zi=zi)
    e = prog ** 2 if not reverse else (1 - prog) ** 1.5
    return out * e[:, None] * vel * 0.5


def impact(vel=1.0):
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    low = np.sin(2 * np.pi * np.cumsum(40 + 70 * np.exp(-t * 14)) / SR) * np.exp(-t * 3.2)
    air = lp(rng.standard_normal((n, 2)), 2600) * np.exp(-t * 6)[:, None] * 0.3
    return (np.stack([low, low], axis=1) * 0.9 + air) * vel * 0.55


# ------------------------------------------------------------- harmonie
# La mineur, progression ascendante vi–IV–I–V (lumineuse, entraînante).
Am = (45, [57, 60, 64, 67, 71])   # La m9 (sans tension dure)
F = (41, [57, 60, 64, 65, 69])    # Fa maj7
C = (48, [55, 60, 64, 67, 71])    # Do maj7
G = (43, [55, 59, 62, 67, 69])    # Sol 6
LOOP = [Am, F, C, G]

# Motif de marimba sur deux mesures (double croche, note MIDI)
HOOK = [(0, 76), (3, 79), (6, 81), (8, 79), (10, 76), (12, 74), (14, 76),
         (16, 72), (19, 74), (22, 76), (24, 79), (26, 81), (28, 84), (30, 83)]
# Basse log drum : (double croche, intervalle, durée en doubles croches)
LOG = [(0, 0, 3), (3, 12, 2), (6, 0, 3), (10, 7, 2), (12, 0, 2), (14, 12, 2)]
CONGA = [(3, 64, False), (6, 69, True), (7, 64, False), (11, 69, False), (13, 64, True), (14, 69, False)]


def build():
    drums = buf()
    bass = buf()
    music = buf()
    fx = buf()
    kicks = []
    for bar in range(1, BARS + 1):
        sec = section(bar)
        root, notes = LOOP[(bar - 1) % 4]
        t0 = at(bar)
        intro = sec == "intro"
        last = bar == BARS
        pre_drop = bar == SECTIONS["intro"][1]
        fill = bar + 1 in (SECTIONS["etape1"][0], SECTIONS["etape2"][0], SECTIONS["etape3"][0], SECTIONS["etape4"][0], SECTIONS["final"][0])

        # Grosse caisse : quatre temps (étouffée sur l'intro, coupée avant le drop)
        if not last:
            for b in range(4):
                if pre_drop and b >= 2:
                    continue
                k = kick(0.75 if intro else 1.0)
                if intro:
                    k = lp(k, 900)
                add(drums, k, t0 + b * BEAT)
                kicks.append(t0 + b * BEAT)
        else:
            add(drums, kick(1.1), t0)
            kicks.append(t0)

        if not intro and not last:
            # Clap sur 2 et 4, charleston ouvert à contretemps, shaker swingué
            for b in (1, 3):
                add(drums, clap(), t0 + b * BEAT, 1.0, 0.05)
            for s in range(16):
                swing = 0.018 if s % 2 else 0.0
                if s % 4 == 2:
                    add(drums, hat(0.9, open_=True), t0 + s * STEP + swing, 1.0, 0.25)
                add(drums, shaker(1.0 if s % 4 == 0 else 0.62), t0 + s * STEP + swing, 1.0, -0.4)
            for s, m, slap in CONGA:
                add(drums, conga(m, 0.9, slap), t0 + s * STEP + (0.012 if s % 2 else 0), 1.0, 0.45 if m > 66 else -0.2)
            # Basse log drum
            for s, iv, d in LOG:
                add(bass, logdrum(root + iv, d * STEP, 1.0 if s == 0 else 0.8), t0 + s * STEP)
            # Accords plaqués syncopés
            for s in (2, 7, 10):
                add(music, stab(notes[:4], 1.0 if s == 2 else 0.8), t0 + s * STEP)
            add(music, pad(notes[:3], BAR, 1.0), t0)
        elif intro:
            # Intro : shaker et pad filtré, le motif annonce le thème
            for s in range(0, 16, 2):
                add(drums, shaker(0.7), t0 + s * STEP, 1.0, -0.4)
            add(music, pad(notes[:3], BAR, 1.3), t0)

        # Motif de marimba : intro, drop et final, plus discret pendant les étapes
        if sec in ("intro", "drop", "final") or bar % 4 == 0:
            half = (bar - 1) % 2
            v = 1.0 if sec in ("intro", "drop", "final") else 0.55
            for s, m in HOOK:
                if s // 16 == half:
                    add(music, marimba(m, v), t0 + (s % 16) * STEP, 1.0, 0.25)
                    if sec == "final":
                        add(music, marimba(m - 12, v * 0.5), t0 + (s % 16) * STEP, 1.0, -0.25)

        # Roulement de caisse claire avant chaque étape (fin de mesure)
        if fill:
            for i, s in enumerate((12, 13, 14, 15)):
                add(drums, snare(0.5 + i * 0.15), t0 + s * STEP, 1.0, 0.1)
            add(drums, tom(50, 0.8), t0 + 14 * STEP, 1.0, -0.3)
            add(drums, tom(45, 0.9), t0 + 15 * STEP, 1.0, 0.3)
        # Montée avant le drop : roulement accéléré et souffle
        if pre_drop:
            for s in range(8, 16):
                add(drums, snare(0.35 + (s - 8) * 0.08), t0 + s * STEP, 1.0, 0.1)
            add(fx, noise_sweep(BAR, 300, 9000, 0.9), t0)

        if last:
            for i, m in enumerate([root + 12] + notes):
                add(music, stab([m], 1.4, dur=0.9), t0 + i * 0.006)

    # Drop : impact et souffle
    add(fx, impact(1.0), at(SECTIONS["drop"][0]))
    for b in (SECTIONS["etape1"][0], SECTIONS["etape2"][0], SECTIONS["etape3"][0], SECTIONS["etape4"][0], SECTIONS["final"][0]):
        add(fx, noise_sweep(BEAT * 2, 400, 7000, 0.45), at(b) - BEAT * 2)
    add(fx, impact(0.8), at(SECTIONS["final"][0]))

    # Compression latérale : la basse et les accords « respirent » sur la grosse caisse
    n = len(music)
    t = np.arange(n) / SR
    duck = np.ones(n)
    for k in kicks:
        i = int(k * SR)
        m = min(n - i, int(0.3 * SR))
        if m > 0:
            duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.65 * np.exp(-np.arange(m) / SR / 0.09))
    music = reverb(music * duck[:, None], 1.6, 0.22)
    bass = bass * (0.4 + 0.6 * duck)[:, None]
    drums = reverb(drums, 0.6, 0.06, seed=5)
    mix = drums * 1.0 + bass * 1.0 + music * 1.0 + fx * 0.8
    mix = hp(mix, 40)
    # Intro : le filtre s'ouvre jusqu'au drop
    intro_end = at(SECTIONS["drop"][0])
    i_end = int(intro_end * SR)
    opened = lp(mix[:i_end], 2200)
    ramp = np.clip(t[:i_end] / intro_end, 0, 1)[:, None] ** 2
    mix[:i_end] = opened * (1 - ramp) + mix[:i_end] * ramp
    mix *= np.clip(t / 0.05, 0, 1)[:, None]
    tail_from = LAST_HIT + 0.2
    mix *= np.clip(1 - (t - tail_from) / (TOTAL - tail_from), 0, 1)[:, None] ** 1.5 if TOTAL > tail_from else 1
    mix = mix[: int(TOTAL * SR)]
    mix = np.tanh(mix * 1.4) / np.tanh(1.4)
    return mix / np.abs(mix).max() * 0.92


# ---------------------------------------------------------------- effets
def sfx_tap():
    """Toucher : clic court et rond."""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * np.cumsum(1800 * np.exp(-t * 40) + 500) / SR) * np.exp(-t * 70)
    y += bp(rng.standard_normal(n), 2000, 8000) * np.exp(-t * 400) * 0.3
    return stereo(y * 0.6)


def sfx_pop():
    """Ajout au panier : « pop » qui monte, et un éclat de percussion."""
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 300 + 900 * (1 - np.exp(-t * 30))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
    y += 0.5 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * np.exp(-t * 22)
    out = stereo(y * 0.5)
    add(out, conga(76, 1.2, slap=True), 0.0, 1.0, 0.3)
    return reverb(out, 0.5, 0.12)


def sfx_count():
    """Compteur : double clic léger, très aigu."""
    out = np.zeros((int(0.35 * SR), 2))
    for i, f in enumerate((2400, 3200)):
        n = int(0.05 * SR)
        t = np.arange(n) / SR
        add(out, np.sin(2 * np.pi * f * t) * np.exp(-t * 90) * 0.45, i * 0.055, 1.0, (i - 0.5) * 0.6)
    return out


def sfx_whoosh(dur=0.45, up=True):
    a, b = (500, 6000) if up else (6000, 500)
    s = noise_sweep(dur, a, b, 1.2)
    n = len(s)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.3
    return reverb(s * e[:, None] / max(1e-9, np.abs(s).max()) * 0.8, 0.5, 0.12)


def sfx_swish():
    """Titre d'étape : coup de souffle bref et claquement."""
    out = np.zeros((int(0.9 * SR), 2))
    add(out, sfx_whoosh(0.28, True), 0.0)
    add(out, clap(1.6), 0.24, 1.0, 0.0)
    add(out, kick(0.7), 0.24)
    return out


def sfx_type():
    out = np.zeros((int(0.6 * SR), 2))
    for i, d in enumerate((0.0, 0.08, 0.17, 0.25)):
        n = int(0.025 * SR)
        y = bp(rng.standard_normal(n), 2000, 6500) * np.exp(-np.arange(n) / SR * 180)
        add(out, y, d, 0.45 + 0.08 * (i % 2), rng.uniform(-0.3, 0.3))
    return out


def sfx_total():
    """Total : accord plaqué brillant, bref."""
    out = np.zeros((int(1.2 * SR), 2))
    add(out, stab([72, 76, 79, 84], 2.2, dur=0.35), 0.0)
    add(out, sfx_count(), 0.0)
    return reverb(out, 0.9, 0.2)


def sfx_send():
    """Message prêt : glissement vers le haut et « pop »."""
    out = np.zeros((int(1.0 * SR), 2))
    add(out, sfx_whoosh(0.3, True), 0.0)
    add(out, sfx_pop(), 0.22)
    return out


def sfx_final():
    out = np.zeros((int(2.2 * SR), 2))
    add(out, impact(1.0), 0.0)
    add(out, clap(1.4), 0.0)
    return reverb(out, 1.2, 0.2)


def norm(x, peak):
    x = stereo(x)
    return x / np.abs(x).max() * peak


def main():
    os.makedirs(OUT, exist_ok=True)
    # Anciens effets à cloches remplacés : on retire ceux qui ne servent plus.
    for old in ("sfx-shimmer.wav", "sfx-add.wav", "sfx-drawer.wav", "sfx-whoosh-down.wav"):
        p = os.path.join(OUT, old)
        if os.path.exists(p):
            os.remove(p)
    files = {
        "musique.wav": build(),
        "sfx-tap.wav": norm(sfx_tap(), 0.6),
        "sfx-pop.wav": norm(sfx_pop(), 0.75),
        "sfx-count.wav": norm(sfx_count(), 0.5),
        "sfx-whoosh.wav": norm(sfx_whoosh(0.45, True), 0.7),
        "sfx-whoosh-down.wav": norm(sfx_whoosh(0.4, False), 0.6),
        "sfx-swish.wav": norm(sfx_swish(), 0.8),
        "sfx-type.wav": norm(sfx_type(), 0.45),
        "sfx-total.wav": norm(sfx_total(), 0.6),
        "sfx-send.wav": norm(sfx_send(), 0.7),
        "sfx-final.wav": norm(sfx_final(), 0.85),
    }
    for name, data in files.items():
        sf.write(os.path.join(OUT, name), data, SR, subtype="PCM_16")
        print(name, round(len(data) / SR, 2), "s")


if __name__ == "__main__":
    main()

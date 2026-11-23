"""Tutoriel : prépare les captures pour le montage.

  python3 scripts/tutoriel/prepare.py

- Découpe les pages entières en tuiles de 1000 px CSS (défilement fluide).
- Mesure la place exacte de la photo d'accueil dans la capture du site
  (raccord photo → site du premier plan), si OpenCV est disponible.
"""
import json, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..")
CAP = os.path.join(ROOT, "public", "tutoriel", "captures")
DATA = os.path.join(ROOT, "src", "tutoriel", "data", "pages.json")
SCALE, TILE = 3, 1000
PAGES = ["t-creations-page", "t-commande-0", "t-commande-1", "t-commande-2", "t-commande-3"]

pages = json.load(open(DATA)) if os.path.exists(DATA) else {}
os.makedirs(os.path.join(CAP, "tuiles"), exist_ok=True)
for page in PAGES:
    src = os.path.join(CAP, page + ".jpg")
    if not os.path.exists(src):
        continue
    im = Image.open(src)
    step = TILE * SCALE
    n = 0
    for i, y in enumerate(range(0, im.height, step)):
        im.crop((0, y, im.width, min(im.height, y + step))).save(
            os.path.join(CAP, "tuiles", f"{page}-{i:02d}.jpg"), quality=90)
        n += 1
    pages[page] = {"count": n, "tile": TILE, "width": im.width // SCALE, "height": im.height / SCALE}

try:
    import cv2, numpy as np
    photo = cv2.imread(os.path.join(ROOT, "public", "photos", "hero.webp"), 0)
    shot = cv2.imread(os.path.join(CAP, "t-accueil.png"), 0)
    shot = cv2.resize(shot, (390, int(shot.shape[0] / SCALE)), interpolation=cv2.INTER_AREA)
    T = shot[480:760, 60:330]
    best = None
    for s in np.arange(0.38, 0.62, 0.0025):
        im = cv2.resize(photo, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        r = cv2.matchTemplate(im, T, cv2.TM_CCOEFF_NORMED)
        _, mx, _, loc = cv2.minMaxLoc(r)
        if best is None or mx > best[0]:
            best = (mx, s, 60 - loc[0], 480 - loc[1])
    pages["heroInHome"] = {"score": round(float(best[0]), 3), "scale": round(float(best[1]), 4), "x": int(best[2]), "y": int(best[3])}
except ImportError:
    pass

json.dump(pages, open(DATA, "w"), indent=2)
print(json.dumps(pages, indent=1))

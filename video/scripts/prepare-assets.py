"""Prépare les ressources visuelles du film à partir du site.

  python3 scripts/prepare-assets.py

1. Copie dans public/photos les photographies du site utilisées par le film
   (source : ../public/images, aucune retouche).
2. Produit une version floutée de chacune (fonds et profondeur de champ).
3. Découpe les longues captures de pages en tuiles de 1000 px CSS, pour un
   défilement fluide dans le téléphone et le navigateur.
"""
import json, os, shutil
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
SITE_IMAGES = os.path.join(ROOT, "..", "public", "images")
PHOTOS = os.path.join(ROOT, "public", "photos")
CAPTURES = os.path.join(ROOT, "public", "captures")
BRAND = os.path.join(ROOT, "public", "brand")

SELECTION = {
    "hero": "hero-entremets-chocolat.webp",
    "cake-noir-or": "creations/gateau-noir-or-fleurs-roses.webp",
    "cake-turquoise": "creations/gateau-trois-etages-turquoise-argent.webp",
    "cake-licorne": "creations/gateau-licorne-rose-deux-etages.webp",
    "cake-blanc-or": "creations/gateau-blanc-or-31.webp",
    "cake-floral": "creations/gateau-floral-roses-macarons.webp",
    "moelleux": "patisseries/moelleux-au-chocolat-la-marilyn.webp",
    "velvet": "patisseries/velvet-cake-la-marilyn.webp",
    "renverse-ananas": "patisseries/renverse-ananas-la-marilyn.webp",
    "praline": "patisseries/cake-praline-chocolat-la-marilyn.webp",
    "mini-burgers": "mignardises/mini-burgers-la-marilyn.webp",
    "mini-cupcakes": "mignardises/mini-cupcakes-la-marilyn.webp",
    "crepes-suzette": "crepes/crepes-suzette-la-marilyn.webp",
    "crepes-nature": "crepes/crepes-nature-la-marilyn.webp",
    "ecrin-ferme": "ecrin/ecrin-gourmand-ferme.webp",
    "ecrin-ouvert": "ecrin/ecrin-gourmand-ouvert.webp",
    "ecrin-garni": "ecrin/ecrin-gourmand-garni.webp",
    "buffet-reception": "buffet/evenements-professionnels.webp",
    "buffet-table": "buffet/buffet-gourmand-la-marilyn.webp",
    "buffet-fleurs": "evenements-buffet.webp",
}
# Pages réellement défilées dans le film
PAGES = ["m-accueil-page", "m-apropos-page", "d-accueil-page"]
TILE_CSS = 1000

os.makedirs(PHOTOS, exist_ok=True)
os.makedirs(BRAND, exist_ok=True)
sizes = {}
for key, rel in SELECTION.items():
    src = os.path.join(SITE_IMAGES, rel)
    ext = os.path.splitext(rel)[1]
    shutil.copyfile(src, os.path.join(PHOTOS, key + ext))
    im = Image.open(src).convert("RGB")
    sizes[key] = {"file": key + ext, "width": im.width, "height": im.height}
    small = im.resize((max(1, im.width // 6), max(1, im.height // 6)), Image.LANCZOS)
    small.filter(ImageFilter.GaussianBlur(7)).save(os.path.join(PHOTOS, key + "-flou.jpg"), quality=80)
shutil.copyfile(os.path.join(SITE_IMAGES, "logo-la-marilyn.png"), os.path.join(BRAND, "logo-la-marilyn.png"))

tiles = {}
os.makedirs(os.path.join(CAPTURES, "tuiles"), exist_ok=True)
for page in PAGES:
    im = Image.open(os.path.join(CAPTURES, page + ".jpg"))
    scale = 3 if page.startswith("m-") else 2
    step = TILE_CSS * scale
    count = 0
    for i, y in enumerate(range(0, im.height, step)):
        im.crop((0, y, im.width, min(im.height, y + step))).save(
            os.path.join(CAPTURES, "tuiles", f"{page}-{i:02d}.jpg"), quality=90)
        count += 1
    tiles[page] = {"count": count, "tile": TILE_CSS, "width": im.width // scale, "height": im.height / scale}

os.makedirs(os.path.join(ROOT, "src", "data"), exist_ok=True)
json.dump({"photos": sizes, "pages": tiles}, open(os.path.join(ROOT, "src", "data", "assets.json"), "w"), indent=2)
print(len(sizes), "photos ;", {k: v["count"] for k, v in tiles.items()})

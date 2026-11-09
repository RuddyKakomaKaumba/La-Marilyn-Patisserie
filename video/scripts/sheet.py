"""Assemble les images de out/preview en une planche : sheet.py <id> <sortie> [colonnes]"""
import glob, sys
from PIL import Image, ImageDraw
cid, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(f"out/preview/{cid}-*.jpg"))
ims = [Image.open(f) for f in fs]
w, h = ims[0].size
rows = -(-len(ims) // cols)
sheet = Image.new("RGB", (cols * (w + 6), rows * (h + 22)), "#444")
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * (w + 6), (i // cols) * (h + 22)
    sheet.paste(im, (x, y + 18))
    d.text((x + 4, y + 3), f.split("-")[-1][:4], fill="white")
sheet.save(out, quality=86)
print(sheet.size)

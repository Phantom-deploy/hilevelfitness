"""One-off: resize/compress the source PNG portraits into web-ready JPGs."""
import os
from PIL import Image, ImageOps

SRC = "."
OUT = "assets/img"
MAX_SIDE = 1500          # longest edge for full-size use (hero)
GALLERY_SIDE = 900       # longest edge for gallery cards
QUALITY = 82

os.makedirs(OUT, exist_ok=True)

for n in range(2, 11):
    src = f"{n}.png"
    if not os.path.exists(src):
        continue
    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert("RGB")

    for suffix, side, q in (("", MAX_SIDE, QUALITY), ("-sm", GALLERY_SIDE, 80)):
        c = im.copy()
        c.thumbnail((side, side), Image.LANCZOS)
        out = f"{OUT}/{n}{suffix}.jpg"
        c.save(out, "JPEG", quality=q, optimize=True, progressive=True)
        kb = os.path.getsize(out) // 1024
        print(f"{out:24} {c.size[0]}x{c.size[1]}  {kb} KB")

print("done")

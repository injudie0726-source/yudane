# 絵コンテ表（コンタクトシート）生成: out/<name>_cutNN.png → out/<name>_sheet.png
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont

here = os.path.dirname(os.path.abspath(__file__))
font_path = None
for cand in ["/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf", "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"]:
    if os.path.exists(cand):
        font_path = cand; break

def sheet(name, cols=5):
    files = sorted(glob.glob(os.path.join(here, "out", f"{name}_cut*.png")))
    if not files:
        print("no stills for", name); return
    thumb_w = 360; thumb_h = 640; pad = 24; label_h = 40
    rows = (len(files) + cols - 1) // cols
    W = cols * (thumb_w + pad) + pad
    H = rows * (thumb_h + label_h + pad) + pad + 80
    im = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(font_path, 30) if font_path else None
    fs = ImageFont.truetype(font_path, 24) if font_path else None
    d.text((pad, 20), f"絵コンテ表：{name}（Vコン v0.1 / 実写・音声は仮）", fill="black", font=f)
    for i, p in enumerate(files):
        r, c = divmod(i, cols)
        x = pad + c * (thumb_w + pad); y = 80 + pad + r * (thumb_h + label_h + pad)
        t = Image.open(p).resize((thumb_w, thumb_h))
        im.paste(t, (x, y))
        d.rectangle([x, y, x + thumb_w, y + thumb_h], outline="#999", width=2)
        d.text((x, y + thumb_h + 6), f"CUT {i+1:02d}", fill="black", font=fs)
    outp = os.path.join(here, "out", f"{name}_sheet.png")
    im.save(outp)
    print("sheet:", outp)

for n in sys.argv[1:]:
    sheet(n)

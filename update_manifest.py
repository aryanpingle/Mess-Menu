from PIL import Image

img = Image.open("images/logo.png").convert("RGBA")

def remove_transparency(img, bkg_color=[0, 0, 0, 255])->None:
    newdata = img.getdata()
    newdata = list(map(lambda rgba: tuple(bkg_color) if rgba[-1] < 128 else rgba, newdata))
    img.putdata(newdata)

sizes = (72, 96, 144, 192, 256, 384, 720)

for i in sizes:
    img.resize((i,i)).save(f"images/logo{i}.png")

remove_transparency(img)
img.resize((192, 192)).save("images/apple-touch-icon.png")

template = """\t\t{{
\t\t\t"src": "/images/logo{}.png",
\t\t\t"type": "image/png",
\t\t\t"sizes": "{}x{}",
\t\t\t"purpose": "{}"
\t\t}}"""
output = [template.format(size, size, size, purpose) for size in sizes for purpose in ["any", "maskable"]]

import re
src = open("manifest.json").read()
src = re.sub(r'(?<="icons": )\[.*?\]', "[\n" + ",\n".join(output) + "\n\t]", src, flags=re.DOTALL)
open("manifest.json", 'w').write(src)
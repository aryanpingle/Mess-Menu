from PIL import Image

img = Image.open("images/favicon.png").convert("RGBA")

sizes = (72,96,120,128,144,152,180,192,384,512)

for i in sizes:
    img.resize((i,i)).save(f"images/logo{i}.png")

newdata = img.getdata()

def process(rgba):
    if rgba[-1] < 128:
        rgba = [255,255,255,255]
    return tuple(rgba)

newdata = list(map(process, newdata))
img.putdata(newdata)
img.resize((192,192)).save("images/apple-touch-icon.png")
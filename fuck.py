from PIL import Image

img = Image.open("images/right-arrow.png").convert("RGBA")
img.resize((128, 128)).save("images/right-arrow-min.png", "PNG")
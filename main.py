import pyautogui as gui

gui.screenshot(region = (0, 70, 256, 256)).convert("RGBA").save("images/favicon.png")
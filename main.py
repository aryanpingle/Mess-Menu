import pyautogui as gui

gui.screenshot(region = (0, 70, 300, 300)).convert("RGBA").save("images/favicon.png")
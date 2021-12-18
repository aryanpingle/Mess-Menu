import pyautogui as gui

size = 720
gui.screenshot(region=(10, 70+10, size, size)).save("images/logo.png")
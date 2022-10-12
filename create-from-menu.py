s = open("mess.txt").read().strip().split("\n\n")

def capitalize_all_words(s:str) -> str:
    import re
    s = s.strip()
    s = s.replace("/", " / ")
    s = re.sub(r'\s+', " ", s)
    return " ".join(list(map(str.capitalize, re.split(r'\s+', s))))

s = [i.strip().split("\n") for i in s]
s = [list(map(capitalize_all_words, i)) for i in s]
s = [", ".join(i) for i in s]
codes = "B, L, S, D".split(", ")

z = [f"\t\t\"{codes[i]}\": \"{s[i]}\"" for i in range(4)]
z = ",\n".join(z)

import pyperclip
pyperclip.copy(z)
# Все иероглифы — шрифтом Дарьи LXGW WenKai GB (2026-11-16).
# В каждый список шрифтов CSS (font-family, font, --переменные) добавляет 'LXGW WenKai GB'
# сразу после первого шрифта (до system-ui/sans-serif): латиница остаётся своим шрифтом, а китайские
# знаки берутся из LXGW, а не из системного шрифта. Работает на готовом html.
import re
GEN = r'(?:sans-serif|serif|monospace|system-ui|cursive|fantasy)'
FAM = re.compile(r"(Nunito|Manrope|Lora|Georgia|Inter|Arial|Helvetica|sans-serif|serif|monospace|system-ui)", re.I)
DECL = re.compile(r"((?:font-family|font|--[a-zA-Z0-9-]+)\s*:\s*)([^;{}<>\n\"`]+?)(?=[;}\"`\n<]|!important)")
L = "'LXGW WenKai GB'"
def fix_value(v):
    if 'LXGW' in v or 'var(' in v or 'inherit' in v or not FAM.search(v): return v
    i = v.find(',')
    head = v if i < 0 else v[:i]
    g = re.search(r"(" + GEN + r")\s*$", head)
    if g: return v[:g.start(1)] + L + ',' + v[g.start(1):]
    return (v.rstrip() + ',' + L) if i < 0 else (v[:i] + ',' + L + v[i:])
def fix(html):
    n = [0]
    def rep(m):
        nv = fix_value(m.group(2))
        if nv != m.group(2): n[0] += 1
        return m.group(1) + nv
    html = DECL.sub(rep, html)
    if 'var(--han)' in html and '--han:' not in html:
        html = html.replace('</style>', ":root{--han:'LXGW WenKai GB','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif}</style>", 1); n[0] += 1
    return html, n[0]
if __name__ == '__main__':
    import sys
    for p in sys.argv[1:]:
        s = open(p, encoding='utf-8').read(); s, k = fix(s); open(p, 'w', encoding='utf-8').write(s); print(p, 'исправлено', k)

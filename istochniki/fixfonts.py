# Все иероглифы — шрифтом Дарьи LXGW WenKai GB (2026-11-16).
# В каждый список шрифтов CSS (font-family, font, --переменные) добавляет 'LXGW WenKai GB'
# сразу после первого шрифта (до system-ui/sans-serif): латиница остаётся своим шрифтом, а китайские
# знаки берутся из LXGW, а не из системного шрифта. Работает на готовом html.
import re
GEN = r'(?:sans-serif|serif|monospace|system-ui|cursive|fantasy)'
FAM = re.compile(r"(Nunito|Manrope|Lora|Georgia|Inter|Arial|Helvetica|sans-serif|serif|monospace|system-ui)", re.I)
DECL = re.compile(r"((?:font-family|font|--[a-zA-Z0-9-]+)\s*:\s*)([^;{}<>\n\"`]+?)(?=[;}\"`\n<]|!important)")
L = "'PinyinFix','LXGW WenKai GB'"
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
    # В Nunito и Manrope нет букв ǐ и ǒ (пиньинь) — браузер брал их из системного шрифта с засечками.
    # Добавляем в каждый список шрифтов крошечный 'PinyinFix' только с ǐ ǒ (M PLUS Rounded 1c, unicode-range).
    if 'pinyin-fix' not in html:
        import base64, os
        d = os.path.dirname(os.path.abspath(__file__))
        b8 = base64.b64encode(open(os.path.join(d, 'pinyin-fix-800.ttf'), 'rb').read()).decode()
        b9 = base64.b64encode(open(os.path.join(d, 'pinyin-fix-900.ttf'), 'rb').read()).decode()
        ff = '/* pinyin-fix */' + ''.join(
            "@font-face{font-family:'%s';font-weight:%s;src:url(data:font/ttf;base64,%s) format('truetype');unicode-range:U+01D0,U+01D2}" % (fam, w, b)
            for fam in ('PinyinFix',) for (w, b) in (('100 850', b8), ('851 1000', b9)))
        html = html.replace('<style>', '<style>' + ff, 1); n[0] += 1
    return html, n[0]
if __name__ == '__main__':
    import sys
    for p in sys.argv[1:]:
        s = open(p, encoding='utf-8').read(); s, k = fix(s); open(p, 'w', encoding='utf-8').write(s); print(p, 'исправлено', k)

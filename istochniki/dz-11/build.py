# Сборка ДЗ 11 (старый вид, как ДЗ 10): python3 build.py <папка с распакованными npm-пакетами>
# Нужны пакеты (npm pack + tar): @fontsource/onest 5.3.1 → fontsource-onest-5.3.1/, lxgw-wenkai-gb-web 1.530.0 → gb/,
#   hanzi-writer 3.7.3 и hanzi-writer-data 2.0.1 → hw/hanzi-writer-3.7.3/, hw/hanzi-writer-data-2.0.1/
# Собирается из: head.part.html, dz10.css + old.css (вид ДЗ 10), dz11.css, core.part.js, tasks.part.js.
# Результат: index.html здесь + копии в ../../public/dz-10/ и ../../../gruppa-deti-sait/site/dz-10/ (если папка есть), uchitel.html → uchitel/index.html.
import base64, json, os, re, sys, shutil, io
from fontTools.ttLib import TTFont
from fontTools import subset
D = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/fonts').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf-8').read()
src = (rd('head.part.html') + rd('dz10.css') + rd('old.css') + rd('dz11.css') + '\n@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\n</style></head><body>\n'
       '<div id="app"></div><div class="toast" id="toast"></div>\n<script>__HW__</script>\n<script>window.HZDATA=__HZDATA__;</script>\n<script>\n'
       + rd('core.part.js').replace('/*__DATA__*/', rd('tasks.part.js').split('/*__BOOT__*/')[0]) + rd('tasks.part.js').split('/*__BOOT__*/')[1] + '</script></body></html>\n')
b64 = lambda b: base64.b64encode(b).decode()
def sub_font(path, text):
    f = TTFont(path); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']; o.ignore_missing_unicodes = True
    s = subset.Subsetter(o); s.populate(text=text); s.subset(f); bio = io.BytesIO(); f.flavor = 'woff2'; f.save(bio); return bio.getvalue()
css = []
lat = ''.join(chr(c) for c in range(0x20, 0x7f)) + 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ«»—–…·ˉˊˇˋ№⌫＿' + ''.join(chr(c) for c in range(0x410, 0x450)) + 'Ёё'
for w in (400, 500, 600, 700):
    for s in ('latin', 'latin-ext', 'cyrillic'):
        data = sub_font(D + f'fontsource-onest-5.3.1/package/files/onest-{s}-{w}-normal.woff2', lat)
        css.append(f"@font-face{{font-family:Onest;font-weight:{w};font-display:block;src:url(data:font/woff2;base64,{b64(data)}) format('woff2')}}")
hz = {c for c in src if ord(c) > 0x2E7F and c not in '⌫＿'}
GB = D + 'gb/package/lxgwwenkaigb-regular/'
rmin = open(GB + 'result.min.css', encoding='utf-8').read()
need = set(hz)
for m in re.finditer(r'url\((\d+)\.woff2\)[^}]*unicode-range:([^;}]+)', rmin):
    fn, rng = m.group(1), m.group(2); cps = set()
    for r in rng.split(','):
        r = r.strip()[2:]; a, b = (r.split('-') + [None])[:2]; a = int(a, 16); b = int(b, 16) if b else a
        cps.update(c for c in need if a <= ord(c) <= b)
    if cps:
        data = sub_font(GB + fn + '.woff2', ''.join(cps))
        css.append(f"@font-face{{font-family:'LXGW WenKai GB';font-display:block;src:url(data:font/woff2;base64,{b64(data)}) format('woff2')}}")
        need -= cps
if need: print('НЕТ В ШРИФТЕ:', ''.join(sorted(need)))
HW = open(D + 'hw/hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js', encoding='utf-8').read().replace('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/', './')
hzd = {c: json.load(open(D + 'hw/hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8')) for c in '你我好叫妈爸他她们吗是不'}
out = (src.replace('/*__FONTCSS__*/', '\n'.join(css)).replace('<script>__HW__</script>', '<script>' + HW + '</script>')
       .replace('__HZDATA__', json.dumps(hzd, ensure_ascii=False)))
assert not re.search(r'https?://(fonts\.googleapis|cdn\.jsdelivr|unpkg)', out), 'внешняя ссылка'
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
for dst in (os.path.join(HERE, '..', '..', 'public', 'dz-11'), os.path.join(HERE, '..', '..', '..', 'gruppa-deti-sait', 'site', 'dz-11')):
    if os.path.isdir(os.path.dirname(os.path.abspath(dst))):
        os.makedirs(os.path.join(dst, 'img'), exist_ok=True); os.makedirs(os.path.join(dst, 'uchitel'), exist_ok=True)
        shutil.copyfile(os.path.join(HERE, 'index.html'), os.path.join(dst, 'index.html'))
        if os.path.exists(os.path.join(HERE, 'uchitel.html')): shutil.copyfile(os.path.join(HERE, 'uchitel.html'), os.path.join(dst, 'uchitel', 'index.html'))
        for f in os.listdir(os.path.join(HERE, 'img')): shutil.copyfile(os.path.join(HERE, 'img', f), os.path.join(dst, 'img', f))
print('KB', len(out) // 1024, 'иероглифов', len(hz))

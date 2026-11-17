# Сборка ДЗ 9 (новый дизайн): python3 build.py <папка с распакованными npm-пакетами>
# Нужны пакеты (npm pack + tar): @fontsource/onest 5.3.1 → fontsource-onest-5.3.1/,
#   lxgw-wenkai-gb-web 1.530.0 → gb/, hanzi-writer 3.7.3 и hanzi-writer-data 2.0.1 → hw/hanzi-writer-3.7.3/, hw/hanzi-writer-data-2.0.1/
# Всё вшивается в один файл: никаких внешних ссылок (Google Fonts, jsDelivr) нет.
# Результат: index.html здесь + копии в ../../public/dz-9/ и ../../../gruppa-deti-sait/site/dz-9/ (если папка есть).
import base64, json, os, re, sys, shutil, io
from fontTools.ttLib import TTFont
from fontTools import subset
D = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/fonts').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'src.html'), encoding='utf-8').read()
SEL = json.load(open(os.path.join(HERE, 'sel9.json'), encoding='utf-8'))
b64 = lambda b: base64.b64encode(b).decode()

def sub_font(path, text):
    f = TTFont(path); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']; o.ignore_missing_unicodes = True
    s = subset.Subsetter(o); s.populate(text=text); s.subset(f); bio = io.BytesIO(); f.flavor = 'woff2'; f.save(bio); return bio.getvalue()

css = []
# Onest: русский, латиница с тонами (ā á ǎ à …), цифры
lat = ''.join(chr(c) for c in range(0x20, 0x7f)) + 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ«»—–…·ˉˊˇˋ№' + ''.join(chr(c) for c in range(0x410, 0x450)) + 'Ёё'
for w in (400, 500, 600, 700):
    parts = [D + f'fontsource-onest-5.3.1/package/files/onest-{s}-{w}-normal.woff2' for s in ('latin', 'latin-ext', 'cyrillic')]
    # склеиваем три подмножества в одно: сабсет каждого и отдельные @font-face c одним именем
    for p in parts:
        data = sub_font(p, lat)
        css.append(f"@font-face{{font-family:Onest;font-weight:{w};font-display:block;src:url(data:font/woff2;base64,{b64(data)}) format('woff2')}}")
# иероглифы: LXGW WenKai GB, только нужные знаки
hz = {c for c in src + json.dumps(SEL, ensure_ascii=False) if ord(c) > 0x2E7F}
GB = D + 'gb/package/lxgwwenkaigb-regular/'
rmin = open(GB + 'result.min.css', encoding='utf-8').read()
need = set(hz)
for m in re.finditer(r'url\((\d+)\.woff2\)[^}]*unicode-range:([^;}]+)', rmin):
    fn, rng = m.group(1), m.group(2)
    cps = set()
    for r in rng.split(','):
        r = r.strip()[2:]
        a, b = (r.split('-') + [None])[:2]
        a = int(a, 16); b = int(b, 16) if b else a
        cps.update(c for c in need if a <= ord(c) <= b)
    if cps:
        data = sub_font(GB + fn + '.woff2', ''.join(cps))
        css.append(f"@font-face{{font-family:'LXGW WenKai GB';font-display:block;src:url(data:font/woff2;base64,{b64(data)}) format('woff2')}}")
        need -= cps
if need: print('НЕТ В ШРИФТЕ:', ''.join(sorted(need)))
HW = open(D + 'hw/hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js', encoding='utf-8').read().replace('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/', './')  # черты вшиты, внешний адрес не нужен
hzd = {c: json.load(open(D + 'hw/hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8')) for c in '他她们你我好叫妈爸'}
out = (src.replace('/*__FONTCSS__*/', '\n'.join(css)).replace('<script>__HW__</script>', '<script>' + HW + '</script>')
       .replace('__HZDATA__', json.dumps(hzd, ensure_ascii=False)).replace('__SEL__', json.dumps(SEL, ensure_ascii=False)))
assert not re.search(r'https?://(fonts\.googleapis|cdn\.jsdelivr|unpkg)', out), 'внешняя ссылка'
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
for dst in (os.path.join(HERE, '..', '..', 'public', 'dz-9'), os.path.join(HERE, '..', '..', '..', 'gruppa-deti-sait', 'site', 'dz-9')):
    if os.path.isdir(os.path.dirname(os.path.abspath(dst))):
        os.makedirs(os.path.join(dst, 'img'), exist_ok=True)
        shutil.copyfile(os.path.join(HERE, 'index.html'), os.path.join(dst, 'index.html'))
        os.makedirs(os.path.join(dst, 'uchitel'), exist_ok=True)
        shutil.copyfile(os.path.join(HERE, 'uchitel.html'), os.path.join(dst, 'uchitel', 'index.html'))
        for f in os.listdir(os.path.join(HERE, 'img')): shutil.copyfile(os.path.join(HERE, 'img', f), os.path.join(dst, 'img', f))
print('KB', len(out) // 1024, 'иероглифов', len(hz))

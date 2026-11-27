# Сборка «Карточек»: sh assemble.sh && python3 build.py <папка с распакованными npm-пакетами>
# Нужны (npm pack + tar): lxgw-wenkai-gb-web 1.530.0 → gb/, hanzi-writer 3.7.3 и hanzi-writer-data 2.0.1 → hw/hanzi-writer-3.7.3/, hw/hanzi-writer-data-2.0.1/
# Иероглифы карточек — список W в kc.part.js; сюда (HZ) добавлять те же знаки для прописи.
import base64, json, sys, os, re, io
from fontTools.ttLib import TTFont
from fontTools import subset
HZ = '你我好叫妈爸他她们吗是不'
D = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/fonts').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
HW = open(D + 'hw/hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js', encoding='utf-8').read()
src = open(os.path.join(HERE, 'src.html'), encoding='utf-8').read()
def sub_font(path, text):
    f = TTFont(path); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']; o.ignore_missing_unicodes = True
    s = subset.Subsetter(o); s.populate(text=text); s.subset(f); bio = io.BytesIO(); f.flavor = 'woff2'; f.save(bio); return bio.getvalue()
need = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；、·…—')
GB = D + 'gb/package/lxgwwenkaigb-regular/'
rmin = open(GB + 'result.min.css', encoding='utf-8').read()
css = []
for m in re.finditer(r'url\((\d+)\.woff2\)[^}]*unicode-range:([^;}]+)', rmin):
    fn, rng = m.group(1), m.group(2); cps = set()
    for r in rng.split(','):
        r = r.strip()[2:]; a, b = (r.split('-') + [None])[:2]; a = int(a, 16); b = int(b, 16) if b else a
        cps.update(c for c in need if a <= ord(c) <= b)
    if cps:
        data = base64.b64encode(sub_font(GB + fn + '.woff2', ''.join(cps))).decode()
        css.append("@font-face{font-family:'LXGW WenKai GB';src:url(data:font/woff2;base64," + data + ") format('woff2');font-display:block}")
        need -= cps
need -= set('，。！？：；、·…—')
if need: print('НЕТ В ШРИФТЕ:', ''.join(sorted(need)))
RULE = "@font-face{font-family:'LXGW WenKai GB';src:url(data:font/woff;base64,__FONT_GB__) format('woff');font-display:block}"
assert RULE in src
hz = {c: json.load(open(D + 'hw/hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8')) for c in HZ}
out = src.replace(RULE, ''.join(css)).replace('__HW__', HW).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False))
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
print('total KB', len(out) // 1024)

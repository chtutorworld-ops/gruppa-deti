# Сборка ДЗ 8: sh assemble.sh && python3 build.py <шрифт LXGWWenKaiGB-Regular.ttf> <папка с распакованными npm hanzi-writer-3.7.3 и hanzi-writer-data-2.0.1>
# Игры «Крот: тоны» (как на уроке 8) и «Иероглифный ниндзя» (kat/core.js + kat/moles8.js + kat/ninja8.js) вшиваются вместо /*__KAT__*/.
import base64, json, sys, os
from fontTools.ttLib import TTFont
from fontTools import subset
FONT = sys.argv[1] if len(sys.argv) > 1 else '/root/.fonts/LXGWWenKaiGB-Regular.ttf'
D = (sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/hw').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
HW = open(D + 'hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js', encoding='utf-8').read()
KAT = '\n'.join(open(os.path.join(HERE, 'kat', f), encoding='utf-8').read() for f in ('core.js', 'moles8.js', 'ninja8.js'))
src = open(os.path.join(HERE, 'src.html'), encoding='utf-8').read()
chars = {c for c in src + KAT if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont(FONT); o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f); f.flavor = 'woff'; f.save('/tmp/dz8.woff')
b64 = base64.b64encode(open('/tmp/dz8.woff', 'rb').read()).decode()
hz = {}
for c in sorted(set('你我好叫妈爸日天山四上门口十田王三川小人')):
    hz[c] = json.load(open(D + 'hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8'))
out = src.replace('__FONT_GB__', b64).replace('__HW__', HW).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False)).replace('/*__KAT__*/', KAT)
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
print('font KB', len(b64) * 3 // 4 // 1024, 'strokes', ''.join(sorted(hz)), 'total KB', len(out) // 1024)

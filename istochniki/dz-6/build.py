# ДЗ 6: python3 build.py <шрифт LXGWWenKaiGB-Regular.ttf> <папка с распакованными npm hanzi-writer-3.7.3 и hanzi-writer-data-2.0.1>
# Собирает index.html из src.html (шрифт-подмножество + Hanzi Writer + данные черт). Картинки — папка img/ рядом.
import base64, json, sys, os
from fontTools.ttLib import TTFont
from fontTools import subset
FONT = sys.argv[1] if len(sys.argv) > 1 else '/root/.fonts/LXGWWenKaiGB-Regular.ttf'
D = (sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/hw').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'src.html'), encoding='utf-8').read()
katsrc = ''.join(open(os.path.join(HERE, 'kat', n), encoding='utf-8').read() for n in ('moles.js', 'alch.js'))
# names of the children's parents are made from this dictionary at runtime: include all its characters
chars = {c for c in src + katsrc if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont(FONT); o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f); f.flavor = 'woff'; f.save('/tmp/dz6.woff')
b64 = base64.b64encode(open('/tmp/dz6.woff', 'rb').read()).decode()
hz = {c: json.load(open(D + 'hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8')) for c in '你我好叫妈爸吗吧'}
hw = open(D + 'hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js', encoding='utf-8').read()
kat = '\n'.join(open(os.path.join(HERE, 'kat', n), encoding='utf-8').read() for n in ('core.js', 'moles.js', 'alch.js'))
assert '</script' not in kat
out = src.replace('/*__KAT__*/', kat, 1).replace('__FONT_GB__', b64).replace('__HW__', hw).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False))
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
print('hanzi', len(chars), 'font KB', len(b64) * 3 // 4 // 1024, 'total KB', len(out) // 1024)

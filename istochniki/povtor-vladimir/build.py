# Повторение для Владимира: вшивает шрифт LXGW WenKai GB (подмножество), Hanzi Writer и данные черт.
# Нужны: шрифт (навык chinese-course-font), npm pack hanzi-writer@3.7.3 hanzi-writer-data@2.0.1 в папку HZ.
import base64, json, re, sys
from fontTools.ttLib import TTFont
from fontTools import subset
FONT = sys.argv[1] if len(sys.argv) > 1 else '/root/.fonts/LXGWWenKaiGB-Regular.ttf'
HZ = sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/hzd/'
src = open('src.html', encoding='utf-8').read()
chars = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont(FONT)
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
f.flavor = 'woff'; f.save('/tmp/claude-0/pv-vl.woff')
b64 = base64.b64encode(open('/tmp/claude-0/pv-vl.woff', 'rb').read()).decode()
# stroke data: the four characters, the name, the stroke-order rules
need = set('你我好叫弗拉基米尔三川十人日小')
hz = {c: json.load(open(HZ + 'data/' + c + '.json')) for c in sorted(need)}
hw = open(HZ + 'package/dist/hanzi-writer.min.js', encoding='utf-8').read()
out = src.replace('__FONT_GB__', b64).replace('__HW__', hw).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False))
open('index.html', 'w', encoding='utf-8').write(out)
print('hanzi', len(chars), 'font KB', len(b64) * 3 // 4 // 1024, 'total KB', len(out) // 1024)

# Догоняем урок 5: вшивает шрифт (подмножество LXGW WenKai GB), Hanzi Writer и данные черт.
# Hanzi Writer и данные черт берутся из уже собранных страниц урока 5 (../urok-5/index.html и zadaniya/index.html).
import base64, json, re
from fontTools.ttLib import TTFont
from fontTools import subset
src = open('src.html', encoding='utf-8').read()
chars = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont('/root/.fonts/LXGWWenKaiGB-Regular.ttf')
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
f.flavor = 'woff'; f.save('/tmp/dogon5-gb.woff')
b64 = base64.b64encode(open('/tmp/dogon5-gb.woff', 'rb').read()).decode()
hz, hw = {}, ''
for p in ['../urok-5/index.html', '../urok-5/zadaniya/index.html']:
    t = open(p, encoding='utf-8').read()
    hz.update(json.loads(re.search(r'window\.HZDATA=(\{.*?\});</script>', t, re.S).group(1)))
    m = re.search(r'<script>(/\*\*.*?)</script>', t, re.S)
    if m and not hw: hw = m.group(1)
out = src.replace('__FONT_GB__', b64).replace('__HW__', hw).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False))
open('index.html', 'w', encoding='utf-8').write(out)
print('hanzi', len(chars), 'font KB', len(b64) * 3 // 4 // 1024, 'HW KB', len(hw) // 1024, 'strokes', ''.join(sorted(hz)), 'total KB', len(out) // 1024)

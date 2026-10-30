# ДЗ 5: font subset + Hanzi Writer with stroke data for the writing practice (你 我 好 叫)
# needs: /root/.fonts/LXGWWenKaiGB-Regular.ttf, `npm pack hanzi-writer@3.7.3 hanzi-writer-data@2.0.1` unpacked into HWD
import base64, json, sys
from fontTools.ttLib import TTFont
from fontTools import subset
HWD = sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/hw/'
src = open('src.html', encoding='utf-8').read()
chars = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont('/root/.fonts/LXGWWenKaiGB-Regular.ttf')
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
f.flavor = 'woff'; f.save('/tmp/claude-0/d4.woff')
b64 = base64.b64encode(open('/tmp/claude-0/d4.woff', 'rb').read()).decode()
hz = {c: json.load(open(HWD + 'hanzi-writer-data-2.0.1/package/' + c + '.json')) for c in '你我好叫'}
hw = open(HWD + 'hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js').read()
out = src.replace('__FONT_GB__', b64).replace('__HW__', hw).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False))
open('index.html', 'w', encoding='utf-8').write(out)
print('hanzi', len(chars), 'font KB', len(b64) * 3 // 4 // 1024, 'total KB', len(out) // 1024)

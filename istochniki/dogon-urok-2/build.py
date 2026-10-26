import base64
from fontTools.ttLib import TTFont
from fontTools import subset
src = open('src.html', encoding='utf-8').read()
chars = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont('/root/.fonts/LXGWWenKaiGB-Regular.ttf')
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
f.flavor = 'woff'; f.save('/tmp/claude-0/dogon-gb.woff')
b64 = base64.b64encode(open('/tmp/claude-0/dogon-gb.woff', 'rb').read()).decode()
open('index.html', 'w', encoding='utf-8').write(src.replace('__FONT_GB__', b64))
print('hanzi', len(chars), 'font KB', len(b64) * 3 // 4 // 1024)

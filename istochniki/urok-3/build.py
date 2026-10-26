import base64
from fontTools.ttLib import TTFont
from fontTools import subset
import sys
P = sys.argv[1] if len(sys.argv)>1 else '.'
src = open(P+'/src.html', encoding='utf-8').read()
amap = open('audio-map.js', encoding='utf-8').read()
chars = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont('/root/.fonts/LXGWWenKaiGB-Regular.ttf')
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
f.flavor = 'woff'; f.save('/tmp/claude-0/u3.woff')
b64 = base64.b64encode(open('/tmp/claude-0/u3.woff', 'rb').read()).decode()
open(P+'/index.html', 'w', encoding='utf-8').write(src.replace('__FONT_GB__', b64))
print('hanzi', len(chars), 'font KB', len(b64)*3//4//1024)

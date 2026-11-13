# Сборка страницы «Звуки»: sh assemble.sh && python3 build.py <шрифт LXGWWenKaiGB-Regular.ttf>
# Вшивает подмножество шрифта LXGW WenKai GB (только иероглифы со страницы) → index.html
import base64, sys, os
from fontTools.ttLib import TTFont
from fontTools import subset
FONT = sys.argv[1] if len(sys.argv) > 1 else '/root/.fonts/LXGWWenKaiGB-Regular.ttf'
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'src.html'), encoding='utf-8').read()
body = src.split('/* ===================== Звуки', 1)[1]
chars = {c for c in body if ord(c) > 0x2E7F} | set('，。！？：；、·…—')
f = TTFont(FONT); o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f); f.flavor = 'woff'; f.save('/tmp/zv.woff')
b64 = base64.b64encode(open('/tmp/zv.woff', 'rb').read()).decode()
out = src.replace('__FONT_GB__', b64)
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
print('font KB', len(b64) * 3 // 4 // 1024, 'chars', ''.join(sorted(chars)), 'total KB', len(out) // 1024)

# Сборка пробного кабинета родителя: python3 build.py
# Шрифт иероглифов берётся из уже собранной страницы заданий урока 8 (там вшит LXGW WenKai GB) и урезается до нужных знаков.
import base64, io, os, re
from fontTools.ttLib import TTFont
from fontTools import subset
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'src.html'), encoding='utf-8').read()
u8 = open(os.path.join(HERE, '..', 'urok-8', 'zadaniya', 'index.html'), encoding='utf-8').read()
b = re.search(r"font-family:'LXGW WenKai GB';src:url\(data:font/woff;base64,([A-Za-z0-9+/=]+)", u8).group(1)
chars = {c for c in src if 0x3400 <= ord(c) <= 0x9fff} | set('！？，。…')
f = TTFont(io.BytesIO(base64.b64decode(b)))
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
buf = io.BytesIO(); f.flavor = 'woff'; f.save(buf)
out = src.replace('__FONT_GB__', base64.b64encode(buf.getvalue()).decode())
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
print('знаки:', ''.join(sorted(chars)), '| KB', len(out) // 1024)

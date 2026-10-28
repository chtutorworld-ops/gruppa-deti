import base64, json, re, sys
from fontTools.ttLib import TTFont
from fontTools import subset
P = sys.argv[1] if len(sys.argv)>1 else '.'
D='/tmp/claude-0/-home-claude/841cb62f-d9c3-5be4-989d-9d1f2380c08c/scratchpad/hw/'
src = open(P+'/src.html', encoding='utf-8').read()
chars = {c for c in src if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont('/root/.fonts/LXGWWenKaiGB-Regular.ttf')
o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f)
f.flavor = 'woff'; f.save('/tmp/claude-0/u5.woff')
b64 = base64.b64encode(open('/tmp/claude-0/u5.woff', 'rb').read()).decode()
# characters that get a stroke-order widget: data-hz="X", the HZW list in the tasks page, and the kids' names
need = set(re.findall(r'data-hz="(.)"', src)) | set(re.findall(r'data-strip="(.)"', src)) | set(''.join(re.findall(r"HZW='([^']*)'", src)))
for m in re.findall(r"hzcell\('(.)'", src): need.add(m)
for m in re.findall(r"charSlide\('(.)'", src): need.add(m)
for m in re.findall(r"\['(.)','[^']*'\]", src[src.find('笔顺'):src.find('笔顺')+600]): need.add(m)
hz = {}
for c in sorted(need):
    try: hz[c] = json.load(open(D+'hanzi-writer-data-2.0.1/package/'+c+'.json'))
    except FileNotFoundError: print('нет данных черт для', c)
hw = open(D+'hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js').read() if '__HW__' in src else ''
out = src.replace('__FONT_GB__', b64).replace('__HW__', hw).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False))
open(P+'/index.html', 'w', encoding='utf-8').write(out)
print('hanzi', len(chars), 'font KB', len(b64)*3//4//1024, 'strokes for', ''.join(sorted(hz)), 'total KB', len(out)//1024)

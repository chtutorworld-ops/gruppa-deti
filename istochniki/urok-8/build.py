# Сборка урока 8: python3 assemble.py && sh assemble-zadaniya.sh && python3 build.py <шрифт LXGWWenKaiGB-Regular.ttf> <папка с распакованными npm hanzi-writer-3.7.3 и hanzi-writer-data-2.0.1>
# Собирает index.html (презентация) и zadaniya/index.html (задания на телефоне).
# Игра «Крот: тоны» (kat/core.js + kat/moles8.js) вшивается в задания вместо /*__KAT__*/.
import base64, json, sys, os
from fontTools.ttLib import TTFont
from fontTools import subset
FONT = sys.argv[1] if len(sys.argv) > 1 else '/root/.fonts/LXGWWenKaiGB-Regular.ttf'
D = (sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/hw').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
HW = open(D + 'hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js', encoding='utf-8').read()
kat = lambda fs: '\n'.join(open(os.path.join(HERE, 'kat', f), encoding='utf-8').read() for f in fs)
def font(text, out):
    chars = {c for c in text if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
    f = TTFont(FONT); o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
    s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f); f.flavor = 'woff'; f.save(out)
    return base64.b64encode(open(out, 'rb').read()).decode()
def build(folder, need, K):
    src = open(os.path.join(HERE, folder, 'src.html'), encoding='utf-8').read()
    b64 = font(src + K, '/tmp/u8-' + (folder or 'main') + '.woff')
    hz = {}
    for c in sorted(need):
        try: hz[c] = json.load(open(D + 'hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8'))
        except FileNotFoundError: print('нет данных черт для', c)
    out = src.replace('__FONT_GB__', b64).replace('__HW__', HW).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False)).replace('/*__KAT__*/', K)
    open(os.path.join(HERE, folder, 'index.html'), 'w', encoding='utf-8').write(out)
    print(folder or 'урок', 'font KB', len(b64) * 3 // 4 // 1024, 'strokes', ''.join(sorted(hz)), 'total KB', len(out) // 1024)
build('', set('你我好叫妈爸他她它们您十口日天山四上门马巴女父子') | set('吗吧骂码把爬三川人小'), kat(['core.js']))
build('zadaniya', set('你我好叫妈爸他她它们您'), kat(['core.js', 'moles8.js']))

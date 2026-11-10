# Догоняем урок 7 (для пропустивших урок 7): python3 build.py <шрифт LXGWWenKaiGB-Regular.ttf> <папка с hanzi-writer-3.7.3 и hanzi-writer-data-2.0.1>
# src.html собирается из оформления заданий урока 6 + урок 7 (zadaniya.css, zad.part.js: мемори, блиц, пропись, контрольная, крот)
# + свои части dg-head.js (список заданий, шкала %, итоги, теория, тесты), dg.css, dg-tail.js. Затем вшиваются шрифт, Hanzi Writer, черты, крот.
import base64, json, os, sys
from fontTools.ttLib import TTFont
from fontTools import subset
HERE = os.path.dirname(os.path.abspath(__file__)); U6 = os.path.join(HERE, '..', 'urok-6', 'zadaniya', 'src.html'); U7 = os.path.join(HERE, '..', 'urok-7')
FONT = sys.argv[1] if len(sys.argv) > 1 else '/root/.fonts/LXGWWenKaiGB-Regular.ttf'
D = (sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/hw').rstrip('/') + '/'
rd = lambda p: open(p, encoding='utf-8').read()
L6 = rd(U6).split('\n')
z7 = rd(os.path.join(U7, 'zad.part.js'))
body = z7[z7.index('/* ---- 1, 2: memory cards'):z7.index('function krot()')]
def sub(a, b):
    global body
    assert a in body, a; body = body.replace(a, b)
# only what the group has learned: 你 我 好 叫 妈 爸 (no 呢 吗 再见)
sub("['nǐ ne?','а ты?','你呢'],['zàijiàn','до свидания','再见']", "['hǎo','хорошо','好'],['wǒ jiào','меня зовут','我叫']")
sub("""['<span class="zh bq">吗</span>Какая часть — <b>ключ</b>?',['口','马'],'口 «рот» — ключ. 马 подсказывает чтение ma.','zh'],""", """['Ключ <span class="zh bk">父</span> значит…',['отец','рот','женщина'],'父 — «отец», как в 爸 «папа».'],""")
for a, b in [('function blitz(){const n=3;', 'function blitz(){const n=4;'), ('function propis(){const n=4;', 'function propis(){const n=5;'), ('function test(){const n=6;', 'function test(){const n=7;')]:
    sub(a, b)
sub('Этот рассказ будет', 'Этот рассказ будет') if 'Этот рассказ будет' in body else None
head = '\n'.join(L6[:167]).replace('<title>课堂任务 — Задания урока 6</title>', '<title>补课 — Догоняем урок 7</title>')
assert '补课' in head
src = (head + '\n' + rd(os.path.join(U7, 'zadaniya.css')) + rd(os.path.join(HERE, 'dg.css')) + '</style></head><body>\n'
       '<div class="app" id="app"></div><div class="toast" id="toast"></div>\n<script>' + rd(os.path.join(U7, 'audio-map.js')) + '</script>\n'
       '<script>__HW__</script>\n<script>window.HZDATA=__HZDATA__;</script>\n<script>/*__KAT__*/</script>\n'
       + '\n'.join(L6[172:262]).replace("new URL('../../audio/',location.href)", "new URL('../audio/',location.href)") + '\n' + rd(os.path.join(HERE, 'dg-head.js')) + '\n' + body + rd(os.path.join(HERE, 'dg-tail.js')) + '</script></body></html>\n')
open(os.path.join(HERE, 'src.html'), 'w', encoding='utf-8').write(src)
HW = rd(D + 'hanzi-writer-3.7.3/package/dist/hanzi-writer.min.js')
KAT = '\n'.join(rd(os.path.join(U7, 'kat', f)) for f in ('core.js', 'moles7.js'))
chars = {c for c in src + KAT if ord(c) > 0x2E7F} | set('，。！？：；《》「」、（）·…—')
f = TTFont(FONT); o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']
s = subset.Subsetter(o); s.populate(text=''.join(chars)); s.subset(f); f.flavor = 'woff'; f.save('/tmp/dg7.woff')
b64 = base64.b64encode(open('/tmp/dg7.woff', 'rb').read()).decode()
hz = {}
for c in '你我好叫妈爸女马父巴口子三川十人日小':
    try: hz[c] = json.load(open(D + 'hanzi-writer-data-2.0.1/package/' + c + '.json', encoding='utf-8'))
    except FileNotFoundError: print('нет данных черт для', c)
out = src.replace('__FONT_GB__', b64).replace('__HW__', HW).replace('__HZDATA__', json.dumps(hz, ensure_ascii=False)).replace('/*__KAT__*/', KAT)
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
print('font KB', len(b64) * 3 // 4 // 1024, 'strokes', ''.join(sorted(hz)), 'total KB', len(out) // 1024)

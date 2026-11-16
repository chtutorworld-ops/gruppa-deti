# Собирает src.html урока 9 (презентация) из оформления и движка урока 7 + slides.css + slides.part.js. Звуки слогов новых финалей — из audio-map.js урока 9.
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
u7 = open(os.path.join(HERE, '..', 'urok-7', 'src.html'), encoding='utf-8').read()
part = open(os.path.join(HERE, 'slides.part.js'), encoding='utf-8').read()
css = open(os.path.join(HERE, 'slides.css'), encoding='utf-8').read()
amap = open(os.path.join(HERE, 'audio-map.js'), encoding='utf-8').read()
add = amap[amap.index("// урок 9"):amap.index(" wa:'挖,娃,瓦,袜'")] if "// урок 9" in amap else ''
s = u7.replace('<title>Урок 7 — Повторяем всё</title>', '<title>Урок 9 — Он, она, мы</title>', 1)
# звук слогов: страница грузит audio-map.js из своей папки (копия audio-map.js урока 9 кладётся рядом с index.html)
i = s.index('</style>'); s = s[:i] + css + s[i:]
s = re.sub(r"<script>window\.VOK=null;try\{.*?</script>", '<script>window.VOK=null;</script>', s, count=1, flags=re.S)
x = s.index('B.length=0;B.push('); y = s.index('/* ---------- engine ---------- */')
s = s[:x] + part + '\n\n' + s[y:]
s = s.replace("'lesson7-slide'", "'lesson9-slide'").replace("gruppa-deti-sait/urok-7/'", "gruppa-deti-sait/urok-9/'")
open(os.path.join(HERE, 'src.html'), 'w', encoding='utf-8').write(s)
print('src.html', len(s) // 1024, 'KB')

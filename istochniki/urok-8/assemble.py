# Собирает src.html урока 8 (презентация) из оформления и движка урока 7 + slides.css + slides.part.js.
# Слайды 24–34 урока 7 (вторая строчка инициалей: z c s zh ch sh) переносятся как есть (блок 3).
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
u7 = open(os.path.join(HERE, '..', 'urok-7', 'src.html'), encoding='utf-8').read()
part = open(os.path.join(HERE, 'slides.part.js'), encoding='utf-8').read()
css = open(os.path.join(HERE, 'slides.css'), encoding='utf-8').read()
s = u7.replace('<title>Урок 7 — Повторяем всё</title>', '<title>Урок 8 — Я, ты, он, она</title>', 1)
i = s.index('</style>'); s = s[:i] + css + s[i:]
# записи .wav не используем: только готовые mp3 синтезатора
s = re.sub(r"<script>window\.VOK=null;try\{.*?</script>", '<script>window.VOK=null;</script>', s, count=1, flags=re.S)
a = u7.index("add(5,'Вторая строчка: z c s zh ch sh'"); b = u7.index("add(5,'Игра «Бей крота» — всем классом'")
old = u7[a:b].replace('add(5,', 'add(3,')
assert old.count('add(3,') == 11, old.count('add(3,')
part = part.replace('/*__U7_SLIDES__*/', old.rstrip() + '\n')
x = s.index('B.length=0;B.push('); y = s.index('/* ---------- engine ---------- */')
s = s[:x] + part + '\n\n' + s[y:]
s = s.replace("'lesson7-slide'", "'lesson8-slide'").replace("gruppa-deti-sait/urok-7/'", "gruppa-deti-sait/urok-8/'")
# «открытая самостоятельная»: показ ответа подсвечивает правильный вариант
s = s.replace("h.classList.add('on');const g=", "h.classList.add('on');if(h.dataset.win)h.closest('.slide').querySelectorAll(h.dataset.win).forEach(x=>x.classList.add('win'));const g=", 1)
s = s.replace("rvs(cur).forEach(e=>e.classList.toggle('on',!!revealAll));", "rvs(cur).forEach(e=>e.classList.toggle('on',!!revealAll));s.querySelectorAll('[data-win]').forEach(h=>s.querySelectorAll(h.dataset.win).forEach(x=>x.classList.toggle('win',!!revealAll)));", 1)
assert "lesson8-slide" in s and "h.dataset.win" in s and "querySelectorAll('[data-win]')" in s
open(os.path.join(HERE, 'src.html'), 'w', encoding='utf-8').write(s)
print('src.html', len(s) // 1024, 'KB')

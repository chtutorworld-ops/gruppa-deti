# Исходники уроков и ДЗ детской группы

Здесь лежат исходники. Собранные страницы, которые открывают дети, лежат в `public/` этого репозитория
(Cloudflare) и в `site/` репозитория `gruppa-deti-sait` (GitHub Pages). Выкладывать в оба места одинаково.

| Папка | Что это | Собранная страница |
|---|---|---|
| urok-1 | Урок 1 «Привет, китайский!» (33 слайда) | site/urok-1/ |
| dogon-urok-2 | «Догоняем урок» — повторение уроков 1–2 для пропустившего | site/dogon-urok-2/ |
| urok-3 | Урок 3 «Инициали»: презентация (src.html + slides.js + extra.css), zadaniya/ — задания урока по номерам, uchitel/ — кабинет урока | site/urok-3/ |
| dz-1 | ДЗ 1 (пиньинь, тоны, анализатор голоса), uchitel/ — кабинет | site/dz-1/ |
| dz-2 | ДЗ 2 «Инициали» (10 заданий + итоги), uchitel/ — кабинет с досье и отчётом для родителей | site/dz-2/ |
| trainer | Тренажёр тонов | site/trainer/ |
| zapis | Страница записи голоса учителя (эталонные слоги) | site/zapis/ |
| tests | Playwright-тесты (Chromium: /opt/pw-browsers/chromium), vk.json — список голосовых файлов для теста | — |

## Сборка
Иероглифы — шрифт LXGW WenKai GB, вшитый подмножеством (навык chinese-course-font; шрифт кладётся в
/root/.fonts/LXGWWenKaiGB-Regular.ttf, нужен `pip install fonttools`).

- урок 3, ДЗ 2, задания урока 3: `cd urok-3 && python3 build.py ../dz-2` (build.py читает audio-map.js из текущей папки,
  поэтому запускать из urok-3; без аргумента собирает сам урок; `python3 build.py zadaniya` — задания).
- догоняем: `cd dogon-urok-2 && python3 build.py`; урок 1: `cd urok-1 && python3 build.py` (шрифт уже в fonts/).
- trainer, zapis, кабинеты — без сборки, файл как есть.
- ДЗ 2: картинка img/yazyk.jpg копируется рядом с index.html.

## Голос и звук
- Голос учителя: site/audio/voice/<слог><тон>.wav (ba1, yi1, ma0 — нейтральный; b0 p0 … h0 — чистые звуки инициалей),
  список — audio/voice/index.json. Записи делаются на странице zapis/ и хранятся в Cloudflare KV, на сайт их
  забирает tools/fetch_voice.py при каждой выкладке.
- mp3 курса: tools/audio-list.txt → tools/make_audio.py (edge-tts, проверка тона) → site/audio/<коды>.mp3.
- Страницы на workers.dev берут звук с GitHub Pages (на Cloudflare папки audio нет).

## API (src/worker.js, KV DZ)
`/api/dz/save` · `/api/dz/audio` · `/api/dz/list?hw=&key=` · `/api/dz/play` · `/api/voice/put|list|get`.
Имя «учитель», «teacher», «тест» — ничего не сохраняется.

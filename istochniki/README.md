# Исходники уроков и ДЗ детской группы

Здесь лежат исходники. Собранные страницы, которые открывают дети, лежат в `public/` этого репозитория
(Cloudflare) и в `site/` репозитория `gruppa-deti-sait` (GitHub Pages). Выкладывать в оба места одинаково.

| Папка | Что это | Собранная страница |
|---|---|---|
| urok-1 | Урок 1 «Привет, китайский!» (33 слайда) | site/urok-1/ |
| dogon-urok-2 | «Догоняем урок» — повторение уроков 1–2 для пропустившего | site/dogon-urok-2/ |
| dogon-urok-4 | «Догоняем урок 4» — для пропустивших урок 4 (Султан, Владимир), в конце переход в ДЗ 4 | site/dogon-urok-4/ |
| povtor-vladimir | Повторение уроков 4–5 для Владимира (24 шага: тоны и выдох, иероглифы, ключи, пропись 你 我 好 叫 и имени, 小明, z c s zh ch sh), hw=pv-vl; uchitel/ — кабинет с отчётом. Сборка: `python3 build.py <шрифт.ttf> <папка npm hanzi-writer>` | site/povtor-vladimir/ |
| urok-3 | Урок 3 «Инициали»: презентация (src.html + slides.js + extra.css), zadaniya/ — задания урока по номерам, uchitel/ — кабинет урока | site/urok-3/ |
| dz-1 | ДЗ 2 (пиньинь, тоны, анализатор голоса), uchitel/ — кабинет | site/dz-1/ |
| dz-2 | ДЗ 3 «Инициали» (10 заданий + итоги), uchitel/ — кабинет с досье и отчётом для родителей | site/dz-2/ |
| dz-3 | ДЗ 4 к уроку 4: 3 + 3, 3 + 4, 你好, 我叫, диалог, ИИ-тренер пар слогов (10 заданий + итоги), uchitel/ — кабинет | site/dz-3/ |
| dz-5 | ДЗ 5 к уроку 5 (слайды 1–27): тоны 3 + 3 / 3 + 4, придыхание p t k, ключи, 5 прописей 你 我 好 叫 по 10 кругов, 小明, Ли На, мини-диалог (19 заданий + итоги); uchitel/ — кабинет без ключа; ?name= подставляет имя | site/dz-5/ (старый адрес dz-4/ переадресует сюда)  |
| trainer | Тренажёр тонов | site/trainer/ |
| zapis | Страница записи голоса учителя (эталонные слоги) | site/zapis/ |
| tests | Playwright-тесты (Chromium: /opt/pw-browsers/chromium), vk.json — список голосовых файлов для теста | — |

**Номер ДЗ = номер урока** (с 2026-10-30): папка dz-1 = ДЗ 2, dz-2 = ДЗ 3, dz-3 = ДЗ 4, dz-5 = ДЗ 5 (dz-4 — переадресация на dz-5). Папки dz-1…dz-3 и hw-id в хранилище (dz1…dz4) не переименованы, чтобы старые ссылки и результаты детей остались.

## Сборка
Иероглифы — шрифт LXGW WenKai GB, вшитый подмножеством (навык chinese-course-font; шрифт кладётся в
/root/.fonts/LXGWWenKaiGB-Regular.ttf, нужен `pip install fonttools`).

- урок 3, ДЗ 3, ДЗ 4, задания урока 3: `cd urok-3 && python3 build.py ../dz-2` (или `../dz-3`) (build.py читает audio-map.js из текущей папки,
  поэтому запускать из urok-3; без аргумента собирает сам урок; `python3 build.py zadaniya` — задания).
- догоняем: `cd dogon-urok-2 && python3 build.py` (так же dogon-urok-4); урок 1: `cd urok-1 && python3 build.py` (шрифт уже в fonts/).
- ДЗ 5: `cd dz-5 && python3 build.py /путь/к/hw/` (шрифт + Hanzi Writer 3.7.3 и данные черт из `npm pack hanzi-writer@3.7.3 hanzi-writer-data@2.0.1`).
- trainer, zapis, кабинеты — без сборки, файл как есть.
- ДЗ 3: картинка img/yazyk.jpg копируется рядом с index.html.

## Голос и звук
- Голос учителя: site/audio/voice/<слог><тон>.wav (ba1, yi1, ma0 — нейтральный; b0 p0 … h0 — чистые звуки инициалей; слова и пары — da3gu3, ni3hao3, wo3jiao4ma3ke3),
  список — audio/voice/index.json. Записи делаются на странице zapis/ и хранятся в Cloudflare KV, на сайт их
  забирает tools/fetch_voice.py при каждой выкладке.
- mp3 курса: tools/audio-list.txt → tools/make_audio.py (edge-tts, проверка тона) → site/audio/<коды>.mp3.
- Страницы на workers.dev берут звук с GitHub Pages (на Cloudflare папки audio нет).

## API (src/worker.js, KV DZ)
`/api/dz/save` · `/api/dz/audio` · `/api/dz/list?hw=` · `/api/dz/play` · `/api/voice/put|list|get`.
Имя «учитель», «teacher», «тест» — ничего не сохраняется.

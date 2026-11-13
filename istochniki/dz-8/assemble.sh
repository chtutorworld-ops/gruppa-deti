#!/bin/sh
# Собирает src.html ДЗ 8: оформление и помощники из урока 6 (задания) + оформление урока 7, ДЗ 7 и урока 8 + dz8.css + dz8.part.js
# Звук: только готовые mp3 синтезатора; страница лежит в site/dz-8/, поэтому путь ../audio/ (не ../../audio/).
cd "$(dirname "$0")"; S=../urok-6/zadaniya/src.html
{ sed -n 1,167p $S | sed 's/课堂任务 — Задания урока 6/作业 — Домашнее задание 8/'; cat ../urok-7/zadaniya.css ../dz-7/dz7.css ../urok-8/u8.css dz8.css; echo '</style></head><body>'; echo '<div class="app" id="app"></div><div class="toast" id="toast"></div>'; echo '<script>'; cat ../urok-8/audio-map.js; echo '</script>'; echo '<script>__HW__</script>'; echo '<script>window.HZDATA=__HZDATA__;</script>'; echo '<script>/*__KAT__*/</script>'; sed -n 173,262p $S | sed "s@'../../audio/'@'../audio/'@" | sed "s@const VOKP=fetch(VOICE+'index.json?'+Date.now()).then(r=>r.json()).then(j=>VOK=j).catch(()=>{});@const VOKP=Promise.resolve();@"; cat dz8.part.js; echo '</script></body></html>'; } > src.html
grep -q "const VOKP=Promise.resolve();" src.html || echo "ВНИМАНИЕ: записи .wav не отключены"
grep -q "new URL('../audio/'" src.html || echo "ВНИМАНИЕ: путь к звукам не ../audio/"

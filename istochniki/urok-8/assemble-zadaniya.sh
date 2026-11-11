#!/bin/sh
# Собирает zadaniya/src.html урока 8: оформление и помощники из урока 6 (задания) + оформление урока 7 и ДЗ 7 + u8.css + u8.part.js
# Звук: только готовые mp3 синтезатора (../../audio/ — страница лежит в urok-8/zadaniya/), записи .wav не используются.
cd "$(dirname "$0")"; S=../urok-6/zadaniya/src.html
{ sed -n 1,167p $S | sed 's/Задания урока 6/Задания урока 8/'; cat ../urok-7/zadaniya.css ../dz-7/dz7.css u8.css; echo '</style></head><body>'; echo '<div class="app" id="app"></div><div class="toast" id="toast"></div>'; echo '<script>'; cat audio-map.js; echo '</script>'; echo '<script>__HW__</script>'; echo '<script>window.HZDATA=__HZDATA__;</script>'; echo '<script>/*__KAT__*/</script>'; sed -n 173,262p $S | sed "s@const VOKP=fetch(VOICE+'index.json?'+Date.now()).then(r=>r.json()).then(j=>VOK=j).catch(()=>{});@const VOKP=Promise.resolve();@"; cat u8.part.js; echo '</script></body></html>'; } > zadaniya/src.html
grep -q "const VOKP=Promise.resolve();" zadaniya/src.html || echo "ВНИМАНИЕ: записи .wav не отключены"
grep -q "'../../audio/'" zadaniya/src.html || echo "ВНИМАНИЕ: путь к звукам не ../../audio/"

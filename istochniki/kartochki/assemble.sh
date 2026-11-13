#!/bin/sh
# Собирает src.html «Карточки: наши иероглифы» (你 我 好 叫 妈 爸; 2 задания по номерам + итоги с зонами):
# оформление и помощники из урока 6 (задания) + оформление урока 7 + ДЗ 7 (шкала %, «не доделано») + kc.css + kc.part.js
# Звук: только готовые mp3 синтезатора (один голос); страница лежит в site/kartochki/, поэтому путь ../audio/.
cd "$(dirname "$0")"; S=../urok-6/zadaniya/src.html
{ sed -n 1,167p $S | sed 's/<title>.*<\/title>/<title>Карточки — наши иероглифы<\/title>/'; cat ../urok-7/zadaniya.css ../dz-7/dz7.css kc.css; echo '</style></head><body>'; echo '<div class="app" id="app"></div><div class="toast" id="toast"></div>'; echo '<script>'; cat ../urok-7/audio-map.js; echo '</script>'; echo '<script>__HW__</script>'; echo '<script>window.HZDATA=__HZDATA__;</script>'; sed -n 173,262p $S | sed "s@'../../audio/'@'../audio/'@" | sed "s@const VOKP=fetch(VOICE+'index.json?'+Date.now()).then(r=>r.json()).then(j=>VOK=j).catch(()=>{});@const VOKP=Promise.resolve();@"; cat kc.part.js; echo '</script></body></html>'; } > src.html
grep -q "const VOKP=Promise.resolve();" src.html || echo "ВНИМАНИЕ: записи .wav не отключены"
grep -q "new URL('../audio/'" src.html || echo "ВНИМАНИЕ: путь к звукам не ../audio/"

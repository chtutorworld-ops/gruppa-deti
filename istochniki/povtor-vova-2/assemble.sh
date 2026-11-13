#!/bin/sh
# Собирает src.html «Повторения 2 для Володи» (звуки и тоны, 8 заданий по номерам):
# оформление и помощники из урока 6 (задания) + оформление урока 7 (окно игры) + ДЗ 7 (шкала %, «не доделано») + «Звуки» + pv2.css + pv2.part.js
# Звук: только готовые mp3 синтезатора (один голос); страница лежит в site/povtor-vova-2/, поэтому путь ../audio/.
cd "$(dirname "$0")"; S=../urok-6/zadaniya/src.html
{ sed -n 1,167p $S | sed 's/<title>.*<\/title>/<title>Повторение 2 — звуки и тоны<\/title>/'; cat ../urok-7/zadaniya.css ../dz-7/dz7.css ../zvuki/zv.css pv2.css; echo '</style></head><body>'; echo '<div class="app" id="app"></div><div class="toast" id="toast"></div>'; echo '<script>'; cat ../urok-7/audio-map.js; echo '</script>'; echo '<script>'; cat kat/core.js kat/raketa.js; echo '</script>'; sed -n 173,262p $S | sed "s@'../../audio/'@'../audio/'@" | sed "s@const VOKP=fetch(VOICE+'index.json?'+Date.now()).then(r=>r.json()).then(j=>VOK=j).catch(()=>{});@const VOKP=Promise.resolve();@"; cat pv2.part.js; echo '</script></body></html>'; } > src.html
grep -q "const VOKP=Promise.resolve();" src.html || echo "ВНИМАНИЕ: записи .wav не отключены"
grep -q "new URL('../audio/'" src.html || echo "ВНИМАНИЕ: путь к звукам не ../audio/"

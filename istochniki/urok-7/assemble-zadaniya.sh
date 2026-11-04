#!/bin/sh
# Собирает zadaniya/src.html: оформление и помощники из урока 6 + zadaniya.css + zad.part.js
cd "$(dirname "$0")"; S=../urok-6/zadaniya/src.html
{ sed -n 1,167p $S | sed 's/Задания урока 6/Задания урока 7/'; cat zadaniya.css; echo '</style></head><body>'; echo '<div class="app" id="app"></div><div class="toast" id="toast"></div>'; echo '<script src="../audio-map.js"></script>'; echo '<script>__HW__</script>'; echo '<script>window.HZDATA=__HZDATA__;</script>'; echo '<script>/*__KAT__*/</script>'; sed -n 173,262p $S; cat zad.part.js; echo '</script></body></html>'; } > zadaniya/src.html

/* ---- 10: whack-a-mole on the whole screen ---- */
function krot(){const n=10;
 shell(`${backBtn}${tag(n)}<h2>🔨 Бей крота</h2><div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Как играть</b>Слушай слог и бей молотком крота <b>с этим слогом</b>. Не перепутай: b — p, z — c, zh — ch, s — sh. Помни: <b>ci</b> = «цы», <b>chi</b> = «чшы» — без предыхания!</div><div id="kg"></div><div id="kr"></div>`);
 katMount('moles7',$('#kg'),r=>{const best=Math.max(r.score||0,+(S.kbest||0));S.kbest=best;keepS();
  finish(n,r.right,r.of,{pts:r.score,best,miss:r.miss});const L=left();
  $('#kr').innerHTML=`<div class="qcard n" style="text-align:center"><div class="res">🔨 ${r.right} / ${r.of}</div><p class="lead">Очки: <b>${r.score}</b>${best>r.score?` · рекорд ${best}`:''}. ${r.miss&&r.miss.length?'Можно повторить для закрепления: <b class="py">'+r.miss.map(esc).join(', ')+'</b>':'Без ошибок! 🏆'}</p>
   <div class="row" style="justify-content:center"><button class="btn" onclick="location.hash='#itog'">🏁 Мои итоги${L.length?' · осталось '+L.length:''}</button><button class="btn g" onclick="location.hash=''">‹ Все задания</button></div></div>`;});}
route();

/* ---------- slides ---------- */
const S=[]; const add=(block,title,html,cls='')=>S.push({block,title,html,cls});
const B=['Начало','1. Как учёные «видят» язык','2. Инициали b p m f d t n l g k h','3. Инициали z c s zh ch sh','4. Инициали y w r j q x','Конец'];

/* mode badges: choral (mics off) / one by one (mics on) */
const CHORAL='<div class="mode ch">🔇 Хором · микрофоны выключены</div>';
const SOLO='<div class="mode ind">🎤 По очереди · включи микрофон</div>';
const choral=(groups,cols,size,title)=>`${hd('我们一起练习','wǒmen yìqǐ liànxí',title||'Повторяем хором')}${CHORAL}${drill(groups,cols,size)}`;
// quick individual check: 6 numbered cards, the teacher ticks a number when the student has spoken
const solo=(groups,title)=>`${hd('一个一个来','yí ge yí ge lái',title||'Проверка: каждый по очереди')}${SOLO}
  <div class="six">${groups.map((g,i)=>`<div class="sx nk"><button class="sxn" data-tick aria-label="Отметить ученика ${i+1}">${i+1}</button><div class="sxg">${g.map((s,j)=>(j&&g.isPair?'<span class="dash">—</span>':'')+sy(s)).join('')}</div></div>`).join('')}</div>
  <div class="hint">Каждый ученик читает свою карточку вслух · нажми на номер, когда ученик ответил ✓</div>`;
// a task the students do on their own phone (individual tasks page)
const ZURL='zadaniya/';
const task=(n,z,p,title,what,answers)=>`${hd(z,p,title)}
  <div class="tk">
    <div class="tkL nk">
      <div class="k2">На своём телефоне</div>
      <div class="tkN"><span>Задание</span><b>№ ${n}</b></div>
      <p class="lead" style="font-size:20px">${what}</p>
      <div class="tkQ"><div class="qrbox" data-qr="${ZURL}#${n}" style="width:190px;height:190px;padding:10px"></div><div class="k2" style="text-transform:none;letter-spacing:0;font-size:14px">Страница заданий уже открыта? Просто выбери <b>№ ${n}</b></div></div>
    </div>
    ${answers?`<div class="tkR">${answers}</div>`:''}
  </div>`;
const dictAns=list=>`<div class="dl2">${list.map((s,i)=>`<div class="db"><span class="k">${i+1}</span><span class="s hid" data-ans>${s}</span>${SYL.char(s)?`<button class="ear" data-say="${SYL.char(s)}" data-v="${vkey(s)}" aria-label="Произнести слог ${i+1}">${EAR}</button>`:''}</div>`).join('')}</div>
  <div style="display:flex;justify-content:center;margin-top:14px"><button class="btn solid" data-reveal>Показать ответы</button></div>`;
const note3=(items)=>`<div class="nt3">${items.map(([ic,col,html])=>`<div class="ntc nk rv"><span class="nti" style="background:${col}">${ic}</span><div>${html}</div></div>`).join('')}</div>`;

/* ===== start ===== */
add(0,'Обложка',`
  <div class="tit"><div class="orb"><div class="zh">声母</div><div class="py">shēngmǔ</div></div>
  <div class="ru">Урок 3 · Инициали</div><div class="sub">Группа <b>11–12 лет</b> · артикуляция и 21 инициаль</div></div>`);

add(0,'Задания урока по QR-коду',`
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:grid;grid-template-columns:1fr 360px;gap:70px;align-items:center">
    <div style="display:grid;gap:18px">
      <div class="k2">Пока все подключаются</div>
      <div style="display:flex;align-items:baseline;gap:16px"><span class="z" style="font-size:70px;line-height:1;color:#2B3270">课堂任务</span><span class="pyn" style="font-size:26px;color:#5B6BD8">kètáng rènwu</span></div>
      <div style="font-weight:800;font-size:46px;line-height:1.05;color:#1E2350;letter-spacing:-.02em">Задания урока — на втором устройстве</div>
      <div style="display:grid;gap:12px;margin-top:6px">
      ${[['📱','Открой код на телефоне или планшете — и не закрывай до конца урока'],['1️⃣','Сейчас: <b>№ 1 — повторение за 3 минуты</b> (тоны и финали)'],['🔢','Дальше я скажу, какое задание открыть']].map(([e,t])=>`<div class="nk" style="display:flex;align-items:center;gap:16px;padding:13px 20px;font-size:21px;font-weight:700;color:#3D4560"><span style="font-size:28px">${e}</span><span>${t}</span></div>`).join('')}
      </div>
      <div class="k2" style="text-transform:none;letter-spacing:0;font-size:15px" data-link="${ZURL}"></div>
    </div>
    <div class="nk" style="padding:26px;display:grid;justify-items:center;gap:12px"><div class="qrbox" data-qr="${ZURL}#1"></div><div class="pyn" style="font-size:18px;color:#5B6BD8">课堂任务 · Задания урока</div></div>
  </div>`);

/* ===== 1. palatography ===== */
add(1,'Палатограмма',`<img class="bg fit" src="img/palateview.webp" alt="Программа электропалатографии: зоны касания у преподавателя и ученика" style="background:#fff">`);
add(1,'Электропалатограф',`<img class="bg" src="img/epg.webp" alt="Электропалатограф: искусственное нёбо с датчиками, блок и экран">`);
const PAL=(zone,col)=>{ // palate seen from below: teeth on top, sensor dots; zone 'front' | 'back' | 'demo'
  const rows=[[150,52,7],[150,76,8],[150,100,8],[150,124,8],[150,148,7],[150,172,6],[150,196,5]];let d='';
  rows.forEach(([cx,y,n],ri)=>{const w=n*17;for(let i=0;i<n;i++){const x=cx-w/2+8+i*17;const on=zone==='front'?ri<=1:zone==='back'?ri>=3&&ri<=5&&Math.abs(x-cx)<46:zone==='demo'?(ri===1||ri===2)&&(i===0||i===n-1)||ri===0:false;
    d+=`<circle cx="${x}" cy="${y}" r="5.2" fill="${on?col:'#C9D0E0'}"/>`;}});
  return `<svg viewBox="0 0 300 230" width="100%" height="100%" aria-hidden="true"><path d="M40 44 Q150 -6 260 44 L250 200 Q150 236 50 200 Z" fill="#F7E1E5" stroke="#E59AAE" stroke-width="3"/>
   ${[...Array(14)].map((_,i)=>{const a=Math.PI*(0.06+0.88*i/13);const x=150-118*Math.cos(a),y=48-34*Math.sin(a);return `<rect x="${x-8}" y="${y-9}" width="16" height="18" rx="5" fill="#fff" stroke="#D9C9CF" stroke-width="1.5"/>`;}).join('')}${d}</svg>`;};
add(1,'Палатография',`
  ${ttl('','','Палатография — как учёные «видят» язык')}
  <div class="pg">
    <div class="pgc nk rv" style="grid-area:a"><span class="pgi" style="background:#E4E8FF">🔬</span><div class="pgh">Что это?</div>
      <p>Метод экспериментальной фонетики. Он показывает, <b>где именно язык касается нёба</b>, когда мы произносим звук.</p>
      <div class="pgh" style="font-size:19px;margin-top:12px">Зачем это нужно?</div>
      <ul><li>сравнивать артикуляцию в разных языках</li><li>видеть разницу между носителем и учеником</li><li>исправлять ошибки — понять, почему русские «долбят языком в зубы», а китайцы нет</li></ul></div>
    <div class="pgc nk rv" style="grid-area:b"><span class="pgi" style="background:#FFF1D6">🍫</span><div class="pgh">Классический метод</div>
      <ol class="pgs">${[['🍫','Язык покрывают специальным составом — раньше брали <b>шоколад с угольным порошком</b>'],['🗣️','Человек произносит нужный звук'],['👄','На нёбе остаются следы — <b>зоны касания</b>'],['📸','Учёный фотографирует «карту касаний» — <b>палатограмму</b>']].map(([e,t],i)=>`<li><span class="pgn">${i+1}</span><span class="pge">${e}</span><span>${t}</span></li>`).join('')}</ol></div>
    <div class="pgc nk rv" style="grid-area:c"><span class="pgi" style="background:#DDF5EC">⚡</span><div class="pgh">Современный метод</div>
      <div style="display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center"><div style="height:118px">${PAL('demo','#2DBE8C')}</div>
      <p><b>Электропалатография:</b> во рту — тонкое искусственное нёбо с датчиками. Язык касается датчика — компьютер сразу видит это на экране.</p></div></div>
    <div class="pgw rv" style="grid-area:d">
      <div class="pgwt"><span class="k2" style="color:#fff;opacity:.85">Главный вывод для нас</span><b>У русских язык касается нёба впереди, у зубов. У китайцев — дальше, у нёба.</b><span>Эту привычку мы и меняем, когда учим китайский.</span></div>
      <div class="pgp"><div style="height:96px">${PAL('front','#FF5C8A')}</div><span>🇷🇺 у зубов</span></div>
      <div class="pgp"><div style="height:96px">${PAL('back','#2DBE8C')}</div><span>🇨🇳 дальше назад</span></div>
    </div>
  </div>`);
add(1,'Альвеолы',`<img class="bg fit" src="img/anatomy.webp" alt="Строение артикуляционного аппарата и альвеолы" style="background:#fff">`);

/* ===== 2. b p m f d t n l g k h ===== */
add(2,'Непридыхательные и придыхательные',`
  ${ttl('','','Непридыхательные и придыхательные')}
  <div class="page"><div class="cols" style="grid-template-columns:1.2fr 1fr;align-items:center;gap:50px">
    <div style="display:grid;gap:16px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;font-size:18px;font-weight:800;color:var(--muted);text-align:center"><span>непридыхательные</span><span style="color:var(--rose)">придыхательные 💨</span></div>
      ${[['b','б','波','bo1','p','пх','坡','po1'],['d','д','德','de2','t','тх','特','te4'],['g','г','哥','ge1','k','кх','科','ke1']].map(([a,ar,ac,av,b,br,bc,bv])=>`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
        <button class="syl has card round" data-say="${ac}" data-v="${av}" style="padding:14px 0;font-family:Nunito;font-size:84px;font-weight:900;color:var(--vio-2)">${a} <span style="font-family:var(--sans);font-size:26px;color:var(--muted)">(${ar})</span></button>
        <button class="syl has card round" data-say="${bc}" data-v="${bv}" data-blow style="padding:14px 0;font-family:Nunito;font-size:84px;font-weight:900;color:var(--rose)">${b} <span style="font-family:var(--sans);font-size:26px;color:var(--muted)">(${br})</span></button></div>`).join('')}
    </div>
    <div style="display:grid;justify-items:center;gap:16px">
      <div style="display:flex;align-items:flex-start;gap:26px">
        <svg viewBox="0 0 120 140" width="170" height="198" aria-hidden="true"><path d="M70 10C38 10 18 34 18 64c0 18 8 30 8 42v24h46v-16h16c8 0 10-6 10-12V88l12-4-12-26C96 30 88 10 70 10z" fill="#FFFDF8" stroke="#2B3270" stroke-width="3" stroke-linejoin="round"/><circle cx="80" cy="50" r="4" fill="#2B3270"/><path d="M98 84h8" stroke="#FF5C8A" stroke-width="4" stroke-linecap="round"/><path d="M110 74l8-4M112 84h8M110 94l8 4" stroke="#5B6BD8" stroke-width="3" stroke-linecap="round"/></svg>
        <div class="paper-strip" id="strip"></div>
      </div>
      <p class="lead" style="font-size:20px;text-align:center;max-width:400px">Поднеси листок бумаги ко рту. На <b style="color:var(--rose)">p, t, k</b> он отклоняется от сильного выдоха, на b, d, g — почти не шевелится.</p>
    </div>
  </div></div>`);
add(2,'Инициали b p m f d t n l g k h',initials([['b','б','波','bo1'],['p','пх','坡','po1'],['m','м','摸','mo1'],['f','ф','佛','fo2'],['d','д','德','de2'],['t','тх','特','te4'],['n','н','讷','ne4'],['l','л','乐','le4'],['g','г','哥','ge1'],['k','кх','科','ke1'],['h','х','喝','he1']]));
add(2,'Язык: d t n l g k h',tongue(['root','tip'],'b, p, m, f — работают губы.'));
add(2,'Хором: пары b/p, d/t, g/k',choral(pairs('bō — pō; gǔ — kǔ; dé — tè; gā — kā; bì — pì; dú — tú; bǔ — pǔ; gè — kè; dī — tī; bà — pà'),2,50,'Хором: пары b/p, d/t, g/k'));
add(2,'Хором: пары слогов',choral(pairs('bā — pá; bí — pì; bǔ — pù; bō — pō; dá — tú; dú — tù; dì — tí; gē — kè; gǔ — kū; gè — ké; nā — là; ní — nì; nù — lú; mā — mí; mù — mǐ'),3,40,'Хором: пары слогов'));
add(2,'По очереди: пары',solo(pairs('bō — pō; dú — tú; gē — kè; bì — pì; dī — tī; gǔ — kǔ'),'Проверка: каждый читает свою пару'));
add(2,'Хором: четыре тона',choral(sets('bō bó bǒ bò; dū dú dǔ dù; kē ké kě kè; pī pí pǐ pì; gē gé gě gè; tī tí tǐ tì; bū bú bǔ bù; pō pó pǒ pò; gū gú gǔ gù; dā dá dǎ dà; kū kú kǔ kù; mā má mǎ mà'),3,42,'Хором: четыре тона'));
add(2,'Хором: ряды слогов',choral(sets('bā bá bǎ bà; bī bí bǐ bì; pī pí pǐ pì; pū pú pǔ pù; mī mí mǐ mì; mō mó mǒ mò; dī dí dǐ dì; tū tú tǔ tù; lī lí lǐ lì; hū hú hǔ hù; nī ní nǐ nì; fū fú fǔ fù'),3,42,'Хором: ряды слогов'));
add(2,'По очереди: ряды',solo(sets('bā bá bǎ bà; dī dí dǐ dì; tū tú tǔ tù; mī mí mǐ mì; lī lí lǐ lì; hū hú hǔ hù'),'Проверка: каждый читает свой ряд'));
const D1=['gē','nù','bí','mā','tù','hú','pì','dā','lú','kè'];
add(2,'Диктант 1 — на телефоне',task(2,'听写','tīngxiě','Диктант 1','Слушай слог и выбирай правильный ответ на телефоне. 10 слогов: b p m f d t n l g k h.',dictAns(D1)));

/* ===== 3. z c s zh ch sh ===== */
add(3,'Инициали z c s zh ch sh',initials([['z','дз','资','zi1'],['c','цх','词','ci2'],['s','с','丝','si1'],['zh','дж','知','zhi1'],['ch','чх','吃','chi1'],['sh','ш','诗','shi1']]));
add(3,'Язык: z c s zh ch sh',tongue(['tip'],'Все шесть инициалей делает кончик языка.'));
add(3,'Важное примечание',`
  ${ttl('注意','zhùyì','Важно запомнить')}
  ${note3([['Ы','#5B6BD8',`Со всей второй строчкой инициалей звук «i» звучит как <b>«Ы»</b>: <span class="p">${['zī','cí','sì','zhī','chī','shí'].map(sy).join(' ')}</span>`],
   ['💨','#FF5C8A','В слогах с «i» у придыхательных <b>c</b> и <b>ch</b> придыхание исчезает: «c» читается как <b>«Ц»</b>, «ch» — как <b>«ЧШ»</b>.'],
   ['✗o','#2DBE8C','Вся вторая строчка инициалей <b>не сочетается</b> с финалью «o»!']])}`);
add(3,'Хором: четыре тона',choral(sets('zā zá zǎ zà; cī cí cǐ cì; zhī zhí zhǐ zhì; chē ché chě chè; sū sú sǔ sù; chī chí chǐ chì; shā shá shǎ shà; chū chú chǔ chù; sī sí sǐ sì; zhē zhé zhě zhè; shī shí shǐ shì; shū shú shǔ shù'),3,38,'Хором: четыре тона'));
add(3,'Хором: пары',choral(pairs('chě — zhé; zhú — cù; sè — shé; cí — zì; zá — cā; zhā — shà; sù — zǔ; zhì — shí; sà — zā; zè — cè; zhī — zǐ; cì — chī; sū — shù; chá — zhā; sī — zì'),3,38,'Хором: пары'));
add(3,'По очереди',solo([...sets('zū zú zǔ zù; zhū zhú zhǔ zhù; chī chí chǐ chì'),...pairs('cí — zì; sī — shì; zhā — chá')],'Проверка: каждый читает свою карточку'));
const D2=['zhǎ','sū','cí','shè','zā','chě','zhì','sè','shù','cè'];
add(3,'Диктант 2 — на телефоне',task(3,'听写','tīngxiě','Диктант 2','Слушай слог и выбирай правильный ответ. 10 слогов: z c s zh ch sh.',dictAns(D2)));
const CH3=[['tǎ','tà','tā'],['zì','zǐ','zī'],['bǎ','bā','bà'],['shí','shī','shǐ'],['cā','cǎ','cá'],['dà','dǎ','dā'],['sè','sǐ','sà'],['gé','gě','gē'],['chè','chě','chē'],['zhù','zhū','zhǔ']];
add(3,'Выбери слог — на телефоне',task(4,'选音节','xuǎn yīnjié','Выбери слог на слух','Прозвучит слог — выбери из трёх вариантов тот, который услышал. 10 вопросов.',`<div class="dl2" style="grid-template-columns:1fr">${CH3.map((o,i)=>`<div class="db" style="gap:12px"><span class="k">${i+1}</span><span class="p" style="font-size:24px;display:flex;gap:16px">${o.map(s=>`<span>${s}</span>`).join('')}</span><span class="s hid" data-ans style="min-width:70px;font-size:26px">${o[0]}</span>${SYL.char(o[0])?`<button class="ear" data-say="${SYL.char(o[0])}" data-v="${vkey(o[0])}">${EAR}</button>`:''}</div>`).join('')}</div><div style="display:flex;justify-content:center;margin-top:12px"><button class="btn solid" data-reveal>Показать ответы</button></div>`));
const D3=['zú','chē','sì','zhě','cā','bó','tè','gǔ','shū','kě'];
add(3,'Диктант 3 — на телефоне',task(5,'听写','tīngxiě','Диктант 3','Слушай слог и выбирай правильный ответ. Все инициали, которые мы уже прошли.',dictAns(D3)));
add(3,'温故知新 — Повторение',`
  ${hd('温故知新','wēn gù zhī xīn','Повторение изученного')}
  <div style="position:absolute;left:90px;right:90px;top:120px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">
    ${[['🔤','#E4E8FF','Инициали','Назовите все изученные инициали.'],['🎵','#DDF5EC','Финали','Назовите все изученные финали.'],['〰️','#FFE3EB','Тон','Расскажите всё, что вы знаете про тоны китайского языка.']].map(([e,c,h,t],i)=>`<div class="nk rv" style="padding:26px 26px;min-height:300px"><div style="display:flex;justify-content:space-between;align-items:center"><span class="pgi" style="background:${c};position:static">${e}</span><span class="k2">№ ${i+1}</span></div><div class="h2" style="font-size:34px;margin:16px 0 10px">${h}</div><p class="lead" style="font-size:22px">${t}</p></div>`).join('')}
  </div>
  <div style="position:absolute;left:0;right:0;bottom:56px;display:grid;justify-items:center;gap:4px;text-align:center">
    <div style="font-family:var(--sans);font-size:26px;font-weight:800;color:var(--ink-3)">«Повторяя старое, познаёшь новое»</div>
    <div style="font-size:15px;color:var(--muted);font-weight:700">Конфуций, «Лунь юй»</div>
  </div>`);
add(3,'Хором: пары вперемешку',choral(pairs('zé — zhě; nì — lǐ; sè — shè; bó — pǒ; zhí — zì; mǎ — mà; cù — chǔ; fū — hú; chā — cǎ; gē — kè; shū — sū; nù — lù; zhǔ — chù; sī — shǐ; gǔ — kù'),3,38,'Хором: пары вперемешку'));
add(3,'По очереди',solo(pairs('bǐ — pì; dū — tù; fá — hā; zé — cè; zhǔ — chù; sī — shǐ'),'Проверка: каждый читает свою пару'));
const D4=['chǐ','zè','shǔ','cā','zhē','sù','tì','pǔ','shū','fó'];
add(3,'Диктант 4 — на телефоне',task(6,'听写','tīngxiě','Диктант 4','Слушай слог и выбирай правильный ответ. Повторяем всё пройденное.',dictAns(D4)));

/* ===== 4. y w r j q x ===== */
add(4,'Инициали y w r j q x',initials([['y','й','衣','yi1'],['w','w','乌','wu1'],['r','ж/р','日','ri4'],['j','дзь','鸡','ji1'],['q','тсь','七','qi1'],['x','сь','西','xi1']]));
add(4,'Язык: j q x и r',tongue(['mid','tip'],'j, q, x — спинка языка, r — кончик языка.'));
add(4,'最狡猾的声母 — Коварные инициали',`
  ${ttl('最狡猾的声母','zuì jiǎohuá de shēngmǔ','Самые коварные инициали')}
  <div class="page" style="display:grid;grid-template-columns:1fr 1fr;gap:24px 28px;align-content:center">
    ${[['j','ji, ju','Средняя часть языка прижата к нёбу. Звук похож на русский «д» в словах «Дима», «дюшес».','鸡','ji1','#E4E8FF'],['r','ж/р','Язык свёрнут назад, кончик у альвеол. Губы чуть растянуты. Звук между русскими «ж» и «р». Не твёрдый, не мягкий.','日','ri4','#FFE3EB'],['q','qi, qu — с выдохом','Сильный выдох при произнесении. Похоже на английское «ch» в слове «cheap», только мягче и с придыханием.','七','qi1','#FFF1D6'],['x','xi, xu','Средняя часть языка прижата к нёбу. Звук немного шипящий и отдалённо напоминает звук «Щ».','西','xi1','#DDF5EC']].map(([l,s,t,c,v,bg])=>`<div class="nk rv" style="display:grid;grid-template-columns:110px 1fr;gap:18px;align-items:center;padding:20px 22px"><button class="syl has" data-say="${c}" data-v="${v}" style="font-family:Nunito;font-size:76px;font-weight:900;line-height:1;color:var(--vio-2);background:${bg};border-radius:22px;height:110px">${l}</button><div><div class="p" style="font-size:20px">${s}</div><p class="lead" style="font-size:19px;margin-top:4px;line-height:1.45">${t}</p></div></div>`).join('')}
  </div>`);
add(4,'Важное примечание',`
  ${ttl('注意','zhùyì','Важно запомнить')}
  ${note3([['✗yo','#5B6BD8','Инициаль <b>«y»</b> не сочетается с финалью «o» — слога «yo» не бывает!'],['✗wi','#2DBE8C','Инициаль <b>«w»</b> не сочетается с финалями «i» и «e»: слогов «wi» и «we» не бывает!'],['✗ro','#FF5C8A','Инициаль <b>«r»</b> не сочетается с финалью «o» — слога «ro» не бывает!'],['i/u','#F5A524','Инициали <b>«j», «q», «x»</b> сочетаются только с финалями «i» и «u»!']])}`);
add(4,'Хором: четыре тона',choral(sets('yā yá yǎ yà; rē ré rě rè; qī qí qǐ qì; wū wú wǔ wù; jī jí jǐ jì; xī xí xǐ xì; yē yé yě yè; rū rú rǔ rù; qū qú qǔ qù; wō wó wǒ wò; jū jú jǔ jù; xū xú xǔ xù'),3,38,'Хором: четыре тона'));
add(4,'Хором: пары',choral(pairs('yā — wā; jī — qí; xī — jǐ; qù — xū; jǔ — qú; xǔ — yǔ; qì — jì; xí — yǐ; jù — qù; xū — yǔ; qí — xí; yú — rù'),3,40,'Хором: пары'));
add(4,'По очереди',solo([...sets('jī jí jǐ jì; qū qú qǔ qù; xī xí xǐ xì'),...pairs('jī — qí; xū — yǔ; rè — lè')],'Проверка: каждый читает свою карточку'));
const D5=['jǐ','yē','qù','xú','wǎ','rè','qí','yě','xì','jū'];
add(4,'Диктант 5 — на телефоне',task(7,'听写','tīngxiě','Диктант 5','Слушай слог и выбирай правильный ответ. 10 слогов: y w r j q x.',dictAns(D5)));
const D6=['zhǔ','cè','sǐ','chà','zhù','zé','pì','tǔ','fó','chī'];
add(4,'Диктант 6 — на телефоне',task(8,'听写','tīngxiě','Диктант 6','Слушай слог и выбирай правильный ответ. Повторяем z c s zh ch sh и b p m f.',dictAns(D6)));
add(4,'Хором: все инициали',choral(sets('mō mó mǒ mò; zhī zhí zhǐ zhì; sū sú sǔ sù; qū qú qǔ qù; rū rú rǔ rù; dī dí dǐ dì; shī shí shǐ shì; xī xí xǐ xì; yī yí yǐ yì; chī chí chǐ chì; pū pú pǔ pù; jī jí jǐ jì'),3,38,'Хором: все инициали'));
add(4,'Хором: пары вперемешку',choral(pairs('sè — shè; jǔ — qǔ; mǎ — mà; rè — lè; zhí — zì; hú — xī; wǒ — wò; nì — lǐ; zhǔ — chù; xì — fá; yě — yè; sī — shǐ; jù — xù; gǔ — kù; dū — tù'),3,38,'Хором: пары вперемешку'));
add(4,'По очереди',solo(pairs('jǔ — qǔ; rè — lè; zhí — zì; hú — xī; sī — shǐ; bǐ — pì'),'Проверка: каждый читает свою пару'));
const D7=['chè','jī','wǒ','cā','rè','zé','yǐ','qù','zhì','xī'];
add(4,'Диктант 7 — на телефоне',task(9,'听写','tīngxiě','Диктант 7','Последний диктант: все 21 инициаль вперемешку!',dictAns(D7)));

add(5,'下课！再见！',`
  <img class="bg" src="img/liriver.webp" alt="" style="object-position:60% 50%">
  <div class="gradL" style="width:700px"></div>
  <div class="big"><div class="z">下课！再见！</div><div class="p">xià kè! zàijiàn!</div><div class="r">Урок окончен. До встречи!</div></div>`);

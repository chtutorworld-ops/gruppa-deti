/* ===================== УРОК 8 · Я, ТЫ, ОН, ОНА — МЕСТОИМЕНИЯ ===================== */
B.length=0;B.push('Начало','1. Разминка: первая строчка и тоны','2. Диктанты','3. Вторая строчка: z c s zh ch sh','4. Порядок черт','5. 他 и 她','6. 它 и 您','7. Много: 们 и таблица','Конец');
// small QR in the corner of a slide: the number of the task in the phone cabinet
const qrMini=(n,label)=>`<div class="u8q nk"><div class="qrbox" data-qr="${ZURL}#${n}" data-size="96" style="width:108px;height:108px;padding:6px"></div><div><span class="k2">Кабинет</span><b>№ ${n}</b><small>${label}</small></div></div>`;
// one stroke of a character highlighted (pink), the others grey
const strokeSvg=(c,hi,size)=>{const D=(window.HZDATA||{})[c];if(!D)return `<span class="z">${c}</span>`;return `<svg viewBox="0 0 1024 1024" width="${size}" height="${size}"><g transform="translate(0,900) scale(1,-1)">${D.strokes.map((p,i)=>`<path d="${p}" fill="${i===hi?'#FF3D77':hi<0?'#2B3270':'#CDD2DE'}"/>`).join('')}</g></svg>`;};
const TC8={1:'#1FA77A',2:'#E8910C',3:'#6A5BFF',4:'#F0407A',0:'#9AA2BC'};
const tpy8=s=>s.split(' ').map(w=>{const t=[1,2,3,4].find(k=>TMARK[k].test(w));return `<span style="color:${TC8[t||0]}">${w}</span>`;}).join(' ');
const py8=s=>s.replace(/men$/,'\u0001men').split('\u0001').map(w=>tpy8(w)).join('');
const PRON=[['我','wǒ','я'],['你','nǐ','ты'],['他','tā','он'],['她','tā','она'],['它','tā','оно']];
const PRONM=[['我们','wǒmen','мы'],['你们','nǐmen','вы'],['他们','tāmen','они'],['她们','tāmen','они (девочки)'],['它们','tāmen','они (вещи, животные)']];
const pcell=(p,big)=>p?`<div class="u8pc nk${/它/.test(p[0])?' u8grey':''}"><button class="syl has z" data-say="${p[0]}" style="font-size:${big?58:52}px">${p[0]}</button><span class="pyn">${py8(p[1])}</span><b>${p[2]}</b></div>`:`<div class="u8pc u8none"><small>它 — без пары с 们</small></div>`;
const ptable=(reveal)=>`<div class="u8pt"><div class="u8ph">один</div><div class="u8ph">много · 们</div>${PRON.map((p,i)=>`<div class="u8pr${reveal?' rv':''}">${pcell(p,1)}${pcell(PRONM[i],1)}</div>`).join('')}</div>`;

/* ===== start ===== */
add(0,'Обложка',`
  <div class="tit"><div class="orb"><div class="zh" style="font-size:112px">我你他</div><div class="py" style="font-family:Nunito;font-style:normal">wǒ nǐ tā</div></div>
  <div class="ru">Урок 8 · Я, ты, он, она</div><div class="sub">Разминка · диктанты · порядок черт · <b>我们 你们 他们 她们</b></div></div>`);
add(0,'Задания урока по QR-коду',`
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:grid;grid-template-columns:1fr 360px;gap:70px;align-items:center">
    <div style="display:grid;gap:18px">
      <div class="k2">Пока все подключаются</div>
      <div style="display:flex;align-items:baseline;gap:16px"><span class="z" style="font-size:70px;line-height:1;color:#2B3270">课堂任务</span><span class="pyn" style="font-size:26px;color:#5B6BD8">kètáng rènwu</span></div>
      <div style="font-weight:800;font-size:46px;line-height:1.05;color:#1E2350;letter-spacing:-.02em">Задания урока — на втором устройстве</div>
      <div style="display:grid;gap:12px;margin-top:6px">
      ${[['📱','Открой код на телефоне или планшете — и не закрывай до конца урока'],['🔨','<b>№ 1 — крот</b>: играешь, пока другие отвечают'],['📝','<b>№ 2 и № 3</b> — диктанты'],['🧩','<b>№ 4–12</b> — местоимения: пишем, он/она, таблица, карточки, мемори']].map(([e,t])=>`<div class="nk" style="display:flex;align-items:center;gap:16px;padding:13px 20px;font-size:21px;font-weight:700;color:#3D4560"><span style="font-size:28px">${e}</span><span>${t}</span></div>`).join('')}
      </div>
      <div class="k2" style="text-transform:none;letter-spacing:0;font-size:15px" data-link="${ZURL}"></div>
    </div>
    <div class="nk" style="padding:26px;display:grid;justify-items:center;gap:12px"><div class="qrbox" data-qr="${ZURL}"></div><div class="pyn" style="font-size:18px;color:#5B6BD8">Задания урока 8</div></div>
  </div>`);

/* ===== 1. warm-up: the first row of initials + tones ===== */
const CH8=sets('bā bá bǎ bà; pō pó pǒ pò; mā má mǎ mà; fū fú fǔ fù; dī dí dǐ dì; tū tú tǔ tù; lū lú lǔ lù; kē ké kě kè; hū hú hǔ hù');
const SC8='nǐ gē lè bù tā hé mǎ fó dé kǔ nà gǔ pà lí tè bǐ'.split(' ');
add(1,'Разминка: хором за учителем',`${hd('热身','rèshēn','Разминка: первая строчка + тоны','left')}${CHORAL}
  <div class="u8w">
    <div class="u8lab"><span>🔗</span> Цепочки тонов: 1 → 2 → 3 → 4</div>
    <div class="u8ch">${CH8.map(g=>`<div class="g nk">${g.map(sy).join('<i class="ar">›</i>')}</div>`).join('')}</div>
    <div class="u8lab rv"><span>🎲</span> А теперь вперемешку</div>
    <div class="u8sc rv">${SC8.map(s=>`<div class="nk">${sy(s)}</div>`).join('')}</div>
  </div>`);
const SO8='bà pí mǎ fū; dé tǔ nǐ lù; gē kǔ hé bō; pà mí fó dī; tè nà lí gǔ; kē hú bǐ mù'.split(';').map(x=>x.trim().split(' '));
add(1,'По очереди + крот',`${hd('一个一个来','yí ge yí ge lái','Каждый по очереди читает свою карточку','left')}${SOLO}
  <div class="u8solo">${SO8.map((g,i)=>`<div class="sx nk"><button class="sxn" data-tick aria-label="Отметить ученика ${i+1}">${i+1}</button><div class="sxg">${g.map(sy).join('')}</div></div>`).join('')}</div>
  <div class="u8krot"><div class="u8kh">🔨 Пока отвечает другой —<br>играй в крота!</div>${qrMini(1,'Крот: тоны')}<div class="u8pause">⏸ Учитель позвал отвечать?<br>Нажми <b>«Пауза»</b>!</div></div>`);

/* ===== 2. dictations ===== */
const D2=['mā','bà','tǔ','dí','kě','fó','lù','hē','nǐ','pō'];
const D3=['bā','dù','gē','pí','mǔ','tè','bǐ','dé','kū','ná','lǐ','hú'];
const plain8=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
add(2,'Диктант на тоны',`${hd('听写声调','tīngxiě shēngdiào','Диктант: какой тон?','left')}${qrMini(2,'Диктант на тоны')}
  <div class="u8dw c5">${D2.map((s,i)=>`<div class="u8db nk"><span class="k">${i+1}</span><span class="u8s"><b class="mk hid" data-ans>${s}</b><b class="pl">${plain8(s)}</b></span></div>`).join('')}</div>
  <div class="u8rule">Слушай 2 раза → в кабинете нажми <b>значок тона</b>: ${[1,2,3,4].map(t=>`<span class="u8mk" style="--tc:${TC8[t]}"><svg viewBox="0 0 80 60"><path d="${['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'][t]}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`).join('')}</div>
  <div class="u8rb"><button class="btn solid" data-reveal>Показать ответы</button></div>`);
add(2,'Диктант: пиши слоги',`${hd('听写','tīngxiě','Диктант: напиши слог и тон','left')}${qrMini(3,'Диктант: пиши слоги')}
  <div class="u8dw c6">${D3.map((s,i)=>`<div class="u8db nk"><span class="k">${i+1}</span><span class="u8s"><b class="mk hid" data-ans>${s}</b><b class="pl q">?</b></span></div>`).join('')}</div>
  <div class="u8rule">Слушай 3 раза → напиши слог <b>латиницей</b> → нажми <b>значок тона</b>. Помни: <b>b</b> — палочка вверх, животик справа · <b>d</b> — животик слева · <b>g</b> — хвостик вниз</div>
  <div class="u8rb"><button class="btn solid" data-reveal>Показать ответы</button></div>`);

/* ===== 3. the second row (slides 24–34 of lesson 7: not finished yet) ===== */
/*__U7_SLIDES__*/

/* ===== 4. stroke order ===== */
add(4,'Почему в 口 первая — вертикаль?',`${hd('笔顺','bǐshùn','Почему в 口 первая черта — вертикаль?','left')}
  <div class="u8why">
    <div class="u8wc nk"><div class="u8wt" style="background:#5B6BD8">十 — черты <b>ПЕРЕСЕКАЮТСЯ</b></div>${hzcell('十',210)}${strip('十')}<p>Крестик: сначала <b>горизонталь</b>, потом вертикаль</p></div>
    <div class="u8wc nk"><div class="u8wt" style="background:#FF3D77">口 — это <b>РАМКА</b>, черты не пересекаются</div>${hzcell('口',210)}${strip('口')}<p>1 левая стенка ┃ · 2 верх + правая стенка — <b>одна черта с поворотом</b> ┓ · 3 дно — «закрываем дверь» в конце</p></div>
  </div>
  <div class="u8big rv">💡 «Горизонталь раньше вертикали» — только когда черты <b>пересекаются</b>, как в 十.<br>Если иероглиф в <b>рамке</b> — сначала рамка: левая стенка → верх с поворотом → внутри → дно в конце: 口 日 四.</div>`);
add(4,'Открытая самостоятельная',`<div class="u8open">
   <div class="k2">Открытая самостоятельная</div><div class="u8oh">✋ Покажи ответ рукой в камеру</div>
   <div class="u8os">${[['1','👀','Смотри на большой иероглиф на доске'],['2','🔍','Найди черту, которую пишут ПЕРВОЙ'],['3','✋','Покажи в камеру 1, 2 или 3 пальца']].map(([n,e,t])=>`<div class="nk"><span class="n">${n}</span><span class="e">${e}</span><span>${t}</span></div>`).join('')}</div>
   <div class="u8on">📱 Кабинет не нужен — работаем все вместе</div></div>`);
const SOQ=[['日',[1,2,0],'Сначала рамка: левая стенка. «Дно» — в самом конце.'],
 ['天',[0,2,3],'Сверху вниз: первая — верхняя горизонталь.'],
 ['山',[1,0,2],'Сначала середина, потом бока — как в 小.'],
 ['四',[4,1,0],'Рамка: левая стенка, потом верх с поворотом. Дно — в конце.'],
 ['上',[2,0,1],'Хитрый! Черты не пересекаются: вертикаль первая, длинное «дно» — в конце.'],
 ['门',[0,2,1],'Сверху вниз: сначала точка. Запомни 门 — он спрятан в 们!']];
SOQ.forEach(([c,o,why],k)=>add(4,`Открытая самостоятельная ${k+1}: ${c}`,`${hd('第一笔','dì yī bǐ','Какую черту пишут первой? ✋ 1 · 2 · 3','left')}<div class="mode ind">✋ Покажи пальцы в камеру</div>
  <div class="u8so"><div class="u8sb nk">${strokeSvg(c,-1,330)}<span class="u8nw">${k+1} / ${SOQ.length}</span></div>
   <div class="u8sr"><div class="u8opts">${o.map((s,j)=>`<div class="u8o nk"${s===0?' data-ok':''}><span class="num">${j+1}</span>${strokeSvg(c,s,170)}</div>`).join('')}</div>
    <div class="u8sa rv" data-win=".u8o[data-ok]"><b>✓ Правильно: ${o.indexOf(0)+1}</b> ${why}${strip(c)}</div></div></div>`));

/* ===== 5. 他 и 她 — полностью: рассказ → написание → сразу пишем в кабинете → упражнение ===== */
const PORTR=[['malchik','他'],['pevica','她'],['vrach','他'],['puteshestvennica','她'],['paren','他'],['uchitelnica','她']];
const W8=[['他','tā','он','亻 человек + 也',[['🔑','<b style="color:#FF5C8A">亻</b> «человек» — ключ слева: смысл. «Он» — это человек'],['✍️','Слева направо: сначала 亻 (2 черты: 丿, потом 丨), потом 也 (3 черты)'],['🧩','也 yě в древности подсказывал чтение — сейчас уже не похоже']]],
 ['她','tā','она','女 женщина + 也',[['🔑','<b style="color:#FF5C8A">女</b> «женщина» — ключ слева. Ты знаешь его по 妈 и 好!'],['✍️','女 слева узкий: последняя черта — короткая, вверх'],['🧩','Правая часть — та же, что в 他: 也']]],
 ['它','tā','оно','宀 крыша + 匕',[['🔑','Сверху <b style="color:#FF5C8A">宀</b> «крыша»: точка, ещё точка, потом «крыша» с крючком'],['✍️','Сверху вниз: сначала крыша, потом 匕'],['🐍','Когда-то это был рисунок змеи']]],
 ['们','men','много (суффикс)','亻 человек + 门 mén',[['🔑','<b style="color:#FF5C8A">亻</b> «человек» — смысл: 们 — про людей'],['🔊','<b style="color:#5B6BD8">门</b> mén «ворота» — чтение'],['✍️','门: сначала точка, потом левая стенка, потом верх с крючком']]],
 ['您','nín','Вы (уважительно)','你 + 心 сердце',[['🧩','Сверху — знакомый <b>你</b>, снизу <b style="color:#FF5C8A">心</b> «сердце»'],['✍️','Сверху вниз: сначала весь 你, потом 心'],['❤️','«Ты — от всего сердца»: уважительное «Вы»']]]];
const W8M=Object.fromEntries(W8.map(x=>[x[0],x]));
const writeSlide=(n,c)=>{const [cc,py,ru,parts,rules]=W8M[c];add(n,`Как пишется ${c}`,charSlide(cc,py,ru,parts,rules));};
add(5,'他叫小明。她叫小美。',`${hd('他和她','tā hé tā','Он и она','left')}
  <div class="u8ph2">
   <div class="u8who nk"><img src="img/xiaoming.jpg" alt=""><div class="u8wtx"><button class="syl has z" data-say="他叫小明。">他叫小明。</button><span class="pyn">${tpy8('tā jiào Xiǎo Míng')}</span><b>Его зовут Сяо Мин.</b></div></div>
   <div class="u8who nk"><img src="img/xiaomei.jpg" alt=""><div class="u8wtx"><button class="syl has z" data-say="她叫小美。">她叫小美。</button><span class="pyn">${tpy8('tā jiào Xiǎo Měi')}</span><b>Её зовут Сяо Мэй.</b></div></div>
  </div>
  <div class="u8eq rv"><span><b class="z">他</b> tā = он</span><span><b class="z">她</b> tā = она</span><span>🔊 звучат <b style="color:#FFE59A">одинаково</b>!</span></div>`);
add(5,'История: откуда взялся 她',`${hd('她的故事','tā de gùshi','Как появился иероглиф «она»','left')}
  <div class="u8hist">
   <div class="u8hc nk rv"><span class="u8yr">Давным-давно</span><div class="u8hz">${hzSvg('他',150)}</div><p>Был только <b>他</b> — и «он», и «она». Женского иероглифа не было!</p></div>
   <span class="u8ar rv">→</span>
   <div class="u8hc nk rv"><span class="u8yr">≈ 100 лет назад</span><div class="u8hz">${hzSvg('她',150)}</div><p>Поэт <b>Лю Баньнун</b> предложил новый иероглиф: ключ <b style="color:#FF3D77">女</b> «женщина» вместо <b style="color:#FF3D77">亻</b> «человек»</p></div>
   <span class="u8ar rv">→</span>
   <div class="u8hc nk rv"><span class="u8yr">Сейчас</span><div class="u8hz" style="font-size:44px">😮 → 👍</div><p>Сначала многие спорили. Но <b>她</b> прижился — теперь его пишут все</p></div>
  </div>
  <div class="u8big rv">🔊 他 и 她 звучат одинаково — <b>tā</b>. На слух не различить, только на письме!</div>`);
writeSlide(5,'他');writeSlide(5,'她');
add(5,'Задание № 4 — пропись 他 她',task(4,'','','Пропись: 他 и 她','Сначала обведи по образцу, потом напиши сам'));
add(5,'Кто это: 他 или 她?',`${hd('他还是她？','tā háishi tā?','Кто это: он или она? Скажи вслух!','left')}
  <div class="u8port">${PORTR.map(([f,c],i)=>`<div class="u8pt8 nk rv"><img src="img/p-${f}.webp" alt=""><span class="n">${i+1}</span><b class="z ${c==='他'?'m':'f'}">${c}</b></div>`).join('')}</div>`);
add(5,'Задание № 5 — он или она?',task(5,'','','Он или она?','Смотри на фото и нажми 他 или 她'));

/* ===== 6. 它 и 您 ===== */
add(6,'История: 它 — змея!',`${hd('它的故事','tā de gùshi','Иероглиф 它 был… змеёй! 🐍','left')}
  <div class="u8snake">
   <div class="u8sk nk"><img class="u8cat" src="img/kotik.webp" alt=""><div class="u8hz">${hzSvg('它',150)}</div><span class="pyn" style="font-size:34px">tā</span><b style="font-size:26px">оно</b></div>
   <div class="u8sl">
    <div class="nk rv"><span class="e">🐍</span><p>Древний знак <b>它</b> — это рисунок <b>змеи</b>.</p></div>
    <div class="nk rv"><span class="e">🌾</span><p>Люди жили в траве и боялись змей. При встрече спрашивали: «Змеи не было?» — как наше «Всё в порядке?»</p></div>
    <div class="nk rv"><span class="e">🐱</span><p>Сейчас <b>它</b> = «<b>оно</b>»: так говорят про <b>животных и вещи</b>.</p></div>
   </div></div>`);
writeSlide(6,'它');
add(6,'Задание № 6 — пропись 它',task(6,'','','Пропись: 它','Обведи по образцу, потом напиши сам'));
add(6,'您 — уважительное «Вы»',`${hd('您','nín','Вежливое «Вы»','left')}
  <div class="u8one"><div class="u8tw nk rv" style="--b:#2DBE8C"><button class="syl has z" data-say="您" style="font-size:120px">您</button><span class="pyn">${tpy8('nín')}</span><p><b>Вы</b> — уважительно, <b>одному</b> человеку: учителю, бабушке, взрослому</p><div class="u8f"><span class="z">你</span> ты + <span class="z">心</span> сердце = «ты — от всего сердца» ❤️</div></div></div>`);
writeSlide(6,'您');
add(6,'Задание № 7 — пропись 您',task(7,'','','Пропись: 您','Обведи по образцу, потом напиши сам'));

/* ===== 7. много: 们, потом таблица ===== */
add(7,'История: суффикс 们',`${hd('们','men','Суффикс 们 — «много»','left')}
  <div class="u8men">
   <div class="u8m1 nk rv"><div class="u8eq2"><span class="z" style="color:#FF5C8A">亻</span><small>человек<br>смысл</small><i>+</i><span class="z" style="color:#5B6BD8">门</span><small>mén «ворота»<br>чтение</small><i>=</i><button class="syl has z" data-say="们" style="font-size:96px">们</button><small>men<br>лёгкий тон</small></div>
    <p>Знакомое правило: <b style="color:#FF5C8A">смысл</b> + <b style="color:#5B6BD8">чтение</b>! Появился около <b>1000 лет назад</b>.</p></div>
   <div class="u8m2">
    <div class="nk rv"><b>С местоимениями</b><p class="z" style="font-size:40px">我们 · 你们 · 他们 · 她们</p></div>
    <div class="nk rv"><b>Иногда — со словами о людях</b><p><span class="pyn">péngyou<b>men</b></span> «друзья» · <span class="pyn">tóngxué<b>men</b></span> «одноклассники» · <span class="pyn">háizi<b>men</b></span> «дети»</p></div>
    <div class="nk rv" style="background:#FFF0F4"><b>❌ Не с вещами</b><p>«книги», «столы» — без <b>们</b>. <b>们</b> любит людей 👥</p></div>
   </div></div>`);
writeSlide(7,'们');
add(7,'Задание № 8 — пропись 们',task(8,'','','Пропись: 们','Обведи по образцу, потом напиши сам'));
add(7,'Два «они»: 他们 и 她们',`${hd('他们 · 她们','tāmen · tāmen','Почему «они» два раза?','left')}
  <div class="u8two">
   <div class="u8tw nk rv"><img class="u8pp" src="img/muzh-zhena.webp" alt=""><button class="syl has z" data-say="他们" style="font-size:84px">他们</button><span class="pyn">${tpy8('tāmen')}</span><div class="u8e"><span>мальчики</span><span>мальчики + девочки</span></div><p><b>они — для всех</b>: мальчики, или мальчики и девочки вместе</p></div>
   <div class="u8tw nk rv" style="--b:#FF3D77"><img class="u8pp" src="img/podrugi.webp" alt=""><button class="syl has z" data-say="她们" style="font-size:84px">她们</button><span class="pyn">${tpy8('tāmen')}</span><div class="u8e g"><span>девочки</span><span>женщины</span></div><p><b>они — только девочки</b> или женщины</p></div>
  </div>
  <div class="u8big rv">💡 В группе хотя бы один мальчик — уже <b>他们</b>!</div>`);
add(7,'它们 и 您: редко и никогда',`${hd('它们 · 您','tāmen · nín','Что бывает редко, а чего не бывает','left')}
  <div class="u8two">
   <div class="u8tw nk rv u8grey"><button class="syl has z" data-say="它们" style="font-size:110px">它们</button><span class="pyn">${tpy8('tāmen')}</span><p><b>они</b> — про животных и вещи. Говорят <b>редко</b>, поэтому в таблице 它 и 它们 <b>серые</b></p></div>
   <div class="u8tw nk rv" style="--b:#2DBE8C"><button class="syl has z" data-say="您" style="font-size:110px">您</button><span class="pyn">${tpy8('nín')}</span><p><b>您们 не говорят!</b> Если уважительно ко многим — всё равно <b class="z" style="font-size:34px">你们</b></p></div>
  </div>`);
add(7,'Таблица местоимений',`${hd('人称代词','rénchēng dàicí','Личные местоимения','left')}${ptable(true)}`);
add(7,'Хором: таблица',`${hd('我们一起读','wǒmen yìqǐ dú','Читаем таблицу хором','left')}${CHORAL}${ptable(false)}`);
const SOP=[['我','我们'],['你','你们'],['他','他们'],['她','她们'],['它','它们'],['您','你们']];
const PALL=Object.fromEntries([...PRON,...PRONM.filter(Boolean),['您','nín','Вы']].map(p=>[p[0],p]));
add(7,'Каждый после учителя',`${hd('一个一个来','yí ge yí ge lái','Каждый читает свою карточку','left')}${SOLO}
  <div class="u8solo w">${SOP.map((g,i)=>`<div class="sx nk"><button class="sxn" data-tick aria-label="Отметить ученика ${i+1}">${i+1}</button><div class="u8sp">${g.map(c=>`<div><button class="syl has z" data-say="${c}" style="font-size:54px">${c}</button><span class="pyn">${py8(PALL[c][1])}</span></div>`).join('<i>—</i>')}</div></div>`).join('')}</div>`);
add(7,'Задание № 9 — таблица',task(9,'','','Заполни таблицу местоимений','Знакомые 我 你 — пиши сам, новые — по образцу. Поставь значки тона'));
add(7,'Задание № 10 — запиши себя',task(10,'','','Прочитай таблицу и запиши голос','Учитель послушает твою запись 🎧'));
add(7,'Задание № 11 — собери местоимения',task(11,'','','Собери местоимения','11.1 перетащи карточку к переводу · 11.2 три корзинки'));
add(7,'Задание № 12 — мемори-финал',task(12,'','','Мемори-финал','Все наши иероглифы — от 你 до 们 🏆'));

/* ===== end ===== */
add(8,'下课！再见！',`
  <img class="bg" src="img/liriver.webp" alt="" style="object-position:60% 50%">
  <div class="gradL" style="width:700px"></div>
  <div class="big"><div class="z">下课！再见！</div><div class="p">xià kè! zàijiàn!</div><div class="r">Урок окончен. До встречи!</div><button class="btn solid" data-say="再见" style="justify-self:start;margin-top:8px">🔊 再见！</button></div>`);

/* ===================== УРОК 9 · ОН, ОНА, МЫ · ФИНАЛИ ai ei ao ou an en ===================== */
B.length=0;B.push('Начало','1. 他 и 她','2. Много: 们 и таблица','3. ai ei · ao ou','4. Как придумали пиньинь','5. an en','Конец');
const qrMini=(n,label)=>`<div class="u8q nk"><div class="qrbox" data-qr="${ZURL}#${n}" data-size="96" style="width:108px;height:108px;padding:6px"></div><div><span class="k2">Кабинет</span><b>№ ${n}</b><small>${label}</small></div></div>`;
const TC8={1:'#1FA77A',2:'#E8910C',3:'#6A5BFF',4:'#F0407A',0:'#9AA2BC'};
const tpy8=s=>s.split(' ').map(w=>{const t=[1,2,3,4].find(k=>TMARK[k].test(w));return `<span style="color:${TC8[t||0]}">${w}</span>`;}).join(' ');
const py8=s=>s.replace(/men$/,'\u0001men').split('\u0001').map(w=>tpy8(w)).join('');
const PRON=[['我','wǒ','я'],['你','nǐ','ты'],['他','tā','он'],['她','tā','она']];
const PRONM=[['我们','wǒmen','мы'],['你们','nǐmen','вы'],['他们','tāmen','они'],['她们','tāmen','они (девочки)']];
const pcell=(p)=>`<div class="u8pc nk"><button class="syl has z" data-say="${p[0]}" style="font-size:56px">${p[0]}</button><span class="pyn">${py8(p[1])}</span><b>${p[2]}</b></div>`;
const ptable=(reveal)=>`<div class="u8pt u9pt"><div class="u8ph">один</div><div class="u8ph">много · 们</div>${PRON.map((p,i)=>`<div class="u8pr${reveal?' rv':''}">${pcell(p)}${pcell(PRONM[i])}</div>`).join('')}</div>`;
// finals: colour + a Russian hint
const FC9={ai:'#E8910C',ei:'#1FA77A',ao:'#6A5BFF',ou:'#F0407A',an:'#2B8FD8',en:'#B4529E'};
const fsy=(s,f)=>{const c=SYL.char(s);const i=s.length-f.length;return `<button class="syl has u9s" data-say="${c}" data-v="${vkey(s)}" title="Послушать">${s.slice(0,i)}<b style="color:${FC9[f]}">${s.slice(i)}</b></button>`;};

/* ===== start ===== */
add(0,'Обложка',`
  <div class="tit"><div class="orb"><div class="zh" style="font-size:104px">他她们</div><div class="py" style="font-family:Nunito;font-style:normal">tā tā men</div></div>
  <div class="ru">Урок 9 · Он, она, мы</div><div class="sub">我们 你们 他们 她们 · финали <b>ai ei ao ou an en</b> · как придумали пиньинь</div></div>`);
add(0,'Задания урока по QR-коду',`
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:grid;grid-template-columns:1fr 360px;gap:70px;align-items:center">
    <div style="display:grid;gap:18px">
      <div class="k2">Пока все подключаются</div>
      <div style="display:flex;align-items:baseline;gap:16px"><span class="z" style="font-size:70px;line-height:1;color:#2B3270">课堂任务</span><span class="pyn" style="font-size:26px;color:#5B6BD8">kètáng rènwu</span></div>
      <div style="font-weight:800;font-size:46px;line-height:1.05;color:#1E2350;letter-spacing:-.02em">Задания урока — на втором устройстве</div>
      <div style="display:grid;gap:12px;margin-top:6px">
      ${[['📱','Открой код на телефоне или планшете — и не закрывай до конца урока'],['✍️','<b>№ 1–7</b> — 他 她 们: пишем, он/она, таблица, фразы'],['🔨','<b>№ 8–9</b> — игры на новые финали: крот и космический шутер'],['📝','<b>№ 10</b> — диктант · <b>№ 11</b> — мемори-финал']].map(([e,t])=>`<div class="nk" style="display:flex;align-items:center;gap:16px;padding:13px 20px;font-size:21px;font-weight:700;color:#3D4560"><span style="font-size:28px">${e}</span><span>${t}</span></div>`).join('')}
      </div>
      <div class="k2" style="text-transform:none;letter-spacing:0;font-size:15px" data-link="${ZURL}"></div>
    </div>
    <div class="nk" style="padding:26px;display:grid;justify-items:center;gap:12px"><div class="qrbox" data-qr="${ZURL}"></div><div class="pyn" style="font-size:18px;color:#5B6BD8">Задания урока 9</div></div>
  </div>`);

/* ===== 1. 他 и 她 — через фразу ===== */
const PORTR=[['malchik','他'],['pevica','她'],['vrach','他'],['puteshestvennica','她'],['paren','他'],['uchitelnica','她']];
const W9={'他':['他','tā','он',[['mean','亻','КЛЮЧ = СМЫСЛ','«человек» → <b>他</b> — это человек'],['note','也','ВТОРАЯ ЧАСТЬ','раньше подсказывала чтение, сейчас уже не похоже'],['write','✍️','КАК ПИСАТЬ','сначала 亻 (丿, потом 丨), потом 也 — 3 черты']]],
 '她':['她','tā','она',[['mean','女','КЛЮЧ = СМЫСЛ','«женщина» → <b>她</b> — это она. Ты знаешь 女 по 妈 и 好!'],['note','也','ВТОРАЯ ЧАСТЬ','та же, что в 他'],['write','✍️','КАК ПИСАТЬ','女 слева узкий: последняя черта короткая, вверх']]],
 '们':['们','men','много (суффикс)',[['mean','亻','КЛЮЧ = СМЫСЛ','«человек» → <b>们</b> — про людей'],['sound','门','ПОДСКАЗКА ЧТЕНИЯ','<span class="pyn">mén</span> «ворота» → <b>们</b> звучит <span class="pyn">men</span>'],['write','✍️','КАК ПИСАТЬ','门: точка, левая стенка, верх с крючком']]]};
const K9={mean:['#FF4F86','#FFE6EE','#FFD0DE'],sound:['#4D63E0','#E6EBFF','#CCD5FF'],note:['#8A6BE8','#F0EAFF','#DDD2FF'],write:['#2BB38A','#E2F7EF','#C4EEDD']};
const charSlide9=(c,py,ru,rules)=>`${hd(c,py,ru,'left')}
  <div style="position:absolute;left:64px;top:104px;display:grid;gap:12px;justify-items:center">${hzcell(c,430)}${strip(c)}<button class="btn" data-replay="${c}">▶ Ещё раз медленно</button></div>
  <div style="position:absolute;left:556px;right:48px;top:100px;bottom:40px;display:grid;gap:14px;align-content:start">
    <div class="nk" style="padding:12px 22px;display:flex;align-items:center;gap:20px"><button class="syl has z" data-say="${c}" style="font-size:78px;line-height:1">${c}</button><div><div class="pyn" style="font-size:40px;color:#2B3270">${py}</div><div style="font-weight:900;font-size:26px;color:#2B3270">${ru}</div></div></div>
    ${rules.map(([k,g,lab,t])=>{const [cl,bg,bd]=K9[k];return `<div class="rv u9rule" style="--c:${cl};background:${bg};border:3px solid ${bd}"><span class="u9g${g.length>1||/[✍]/.test(g)?' em':''}">${g}</span><div><div class="u9lab">${lab}</div><div class="u9txt">${t}</div></div></div>`;}).join('')}
  </div>`;
const writeSlide=(n,c)=>{const [cc,py,ru,rules]=W9[c];add(n,`Как пишется ${c}`,charSlide9(cc,py,ru,rules));};
add(1,'他叫小明。她叫小美。',`${hd('他和她','tā hé tā','Слушай фразы: кто это?','left')}
  <div class="u8ph2">
   <div class="u8who nk"><img src="img/xiaoming.jpg" alt=""><div class="u8wtx"><button class="syl has z" data-say="他叫小明。">他叫小明。</button><span class="pyn">${tpy8('tā jiào Xiǎo Míng')}</span><b class="rv">Его зовут Сяо Мин.</b></div></div>
   <div class="u8who nk"><img src="img/xiaomei.jpg" alt=""><div class="u8wtx"><button class="syl has z" data-say="她叫小美。">她叫小美。</button><span class="pyn">${tpy8('tā jiào Xiǎo Měi')}</span><b class="rv">Её зовут Сяо Мэй.</b></div></div>
  </div>
  <div class="u8eq rv"><span><b class="z">他</b> tā = он</span><span><b class="z">她</b> tā = она</span><span>🔊 звучат <b style="color:#FFE59A">одинаково</b>!</span></div>`);
add(1,'История: откуда взялся 她',`${hd('她的故事','tā de gùshi','Как появился иероглиф «она»','left')}
  <div class="u8hist">
   <div class="u8hc nk rv"><span class="u8yr">Давным-давно</span><div class="u8hz">${hzSvg('他',150)}</div><p>Был только <b>他</b> — и «он», и «она». Женского иероглифа не было!</p></div>
   <span class="u8ar rv">→</span>
   <div class="u8hc nk rv"><span class="u8yr">≈ 100 лет назад</span><div class="u8hz">${hzSvg('她',150)}</div><p>Поэт <b>Лю Баньнун</b> предложил новый иероглиф: ключ <b style="color:#FF3D77">女</b> «женщина» вместо <b style="color:#FF3D77">亻</b> «человек»</p></div>
   <span class="u8ar rv">→</span>
   <div class="u8hc nk rv"><span class="u8yr">Сейчас</span><div class="u8hz" style="font-size:44px">😮 → 👍</div><p>Сначала многие спорили. Но <b>她</b> прижился — теперь его пишут все</p></div>
  </div>
  <div class="u8big rv">🔊 他 и 她 звучат одинаково — <b>tā</b>. На слух не различить, только на письме!</div>`);
writeSlide(1,'他');writeSlide(1,'她');
add(1,'Задание № 1 — пропись 他 她',task(1,'','','Пропись: 他 и 她','Сначала обведи по образцу, потом напиши сам'));
add(1,'Кто это: 他 или 她?',`${hd('他还是她？','tā háishi tā?','Кто это: он или она? Скажи вслух!','left')}
  <div class="u8port">${PORTR.map(([f,c],i)=>`<div class="u8pt8 nk rv"><img src="img/p-${f}.webp" alt=""><span class="n">${i+1}</span><b class="z ${c==='他'?'m':'f'}">${c}</b></div>`).join('')}</div>`);
add(1,'Задание № 2 — он или она?',task(2,'','','Он или она?','Смотри на фото и нажми 他 или 她'));

/* ===== 2. 们 и таблица ===== */
add(2,'我们 — мы!',`${hd('我们','wǒmen','А если людей много?','left')}
  <div class="u9we">
   <div class="u9wa nk"><button class="syl has z" data-say="我" style="font-size:120px">我</button><span class="pyn">${tpy8('wǒ')}</span><b>я</b></div>
   <span class="u9plus rv">+ <b class="z">们</b></span>
   <div class="u9wa nk rv" style="--b:#5B6BD8"><button class="syl has z" data-say="我们" style="font-size:120px">我们</button><span class="pyn">${py8('wǒmen')}</span><b>мы</b></div>
   <div class="u9wa nk rv"><button class="syl has z" data-say="你们好" style="font-size:84px">你们好！</button><span class="pyn">${py8('nǐmen')} ${tpy8('hǎo')}</span><b>Здравствуйте, ребята!</b></div>
  </div>
  <div class="u8big rv">💡 Добавь <b class="z" style="font-size:30px">们</b> — и «я» превращается в «мы», «ты» — в «вы»!</div>`);
add(2,'История: суффикс 们',`${hd('们','men','Суффикс 们 — «много»','left')}
  <div class="u8men">
   <div class="u8m1 nk rv"><div class="u8eq2"><span class="z" style="color:#FF5C8A">亻</span><small>человек<br>смысл</small><i>+</i><span class="z" style="color:#5B6BD8">门</span><small>mén «ворота»<br>чтение</small><i>=</i><button class="syl has z" data-say="们" style="font-size:96px">们</button><small>men<br>лёгкий тон</small></div>
    <p>Знакомое правило: <b style="color:#FF5C8A">смысл</b> + <b style="color:#5B6BD8">чтение</b>! Появился около <b>1000 лет назад</b>.</p></div>
   <div class="u8m2">
    <div class="nk rv"><b>С местоимениями</b><p class="z" style="font-size:40px">我们 · 你们 · 他们 · 她们</p></div>
    <div class="nk rv"><b>Иногда — со словами о людях</b><p><span class="pyn">péngyou<b>men</b></span> «друзья» · <span class="pyn">tóngxué<b>men</b></span> «одноклассники» · <span class="pyn">háizi<b>men</b></span> «дети»</p></div>
    <div class="nk rv" style="background:#FFF0F4"><b>❌ Не с вещами</b><p>«книги», «столы» — без <b>们</b>. <b>们</b> любит людей 👥</p></div>
   </div></div>`);
writeSlide(2,'们');
add(2,'Задание № 3 — пропись 们',task(3,'','','Пропись: 们','Обведи по образцу, потом напиши сам'));
add(2,'Два «они»: 他们 и 她们',`${hd('他们 · 她们','tāmen · tāmen','Почему «они» два раза?','left')}
  <div class="u8two u9two">
   <div class="u8tw nk rv"><img class="u8pp" src="img/muzh-zhena.webp" alt=""><button class="syl has z" data-say="他们" style="font-size:84px">他们</button><span class="pyn">${py8('tāmen')}</span><div class="u8e"><span>мальчики</span><span>мальчики + девочки</span></div><p><b>они — для всех</b>: мальчики или мальчики с девочками</p></div>
   <div class="u8tw nk rv" style="--b:#FF3D77"><img class="u8pp" src="img/podrugi.webp" alt=""><button class="syl has z" data-say="她们" style="font-size:84px">她们</button><span class="pyn">${py8('tāmen')}</span><div class="u8e g"><span>девочки</span><span>женщины</span></div><p><b>они — только девочки</b> или женщины</p></div>
  </div>
  <div class="u8big rv">💡 В группе хотя бы один мальчик — уже <b>他们</b>!</div>`);
add(2,'Таблица местоимений',`${hd('人称代词','rénchēng dàicí','Личные местоимения','left')}${ptable(true)}`);
add(2,'Хором: таблица',`${hd('我们一起读','wǒmen yìqǐ dú','Читаем таблицу хором','left')}${CHORAL}${ptable(false)}`);
const SOP=[['我','我们'],['你','你们'],['他','他们'],['她','她们'],['我们','她们']];
const PALL=Object.fromEntries([...PRON,...PRONM].map(p=>[p[0],p]));
add(2,'Каждый читает всю таблицу',`${hd('一个一个来','yí ge yí ge lái','Каждый читает ВСЮ таблицу','left')}${SOLO}${ptable(false)}`);
add(2,'Задание № 4 — таблица',task(4,'','','Заполни таблицу местоимений','Знакомые 我 你 — пиши сам, новые — по образцу. Поставь значки тона'));
add(2,'Задание № 5 — запиши себя',task(5,'','','Прочитай таблицу и запиши голос','Учитель послушает твою запись 🎧'));
add(2,'Задание № 6 — собери местоимения',task(6,'','','Собери местоимения','6.1 перетащи карточку к переводу · 6.2 три корзинки'));
add(2,'Задание № 7 — собери фразу',task(7,'','','Собери фразу','他叫小明 · 她叫小美 · 你们好 — нажимай таблички по порядку'));

/* ===== 3. ai ei · ao ou ===== */
const frule=(a,b,ra,rb,ex)=>`<div class="u9fr">
  ${[[a,ra],[b,rb]].map(([f,r])=>`<div class="u9fc nk" style="--fc:${FC9[f]}"><div class="u9fb">${/i$/.test(f)?f.slice(0,-1)+'<span class="u9i">i<em>й</em></span>':f}</div><div class="u9ft">${r}</div><div class="u9fx">${ex[f].map(s=>fsy(s,f)).join('')}</div></div>`).join('')}</div>`;
add(3,'Новые финали: ai и ei',`${hd('复韵母','fù yùnmǔ','Две гласные — один слог: ai и ei','left')}
  ${frule('ai','ei','читаем «а<b>й</b>»<small>e и a — как «э» и «а», i в конце — «й»</small>'.replace('e и a — как «э» и «а», ','a — «а», '),'читаем «э<b>й</b>»<small>e — «э», i в конце — «й»</small>',{ai:['bái','mǎi','lái','hǎi'],ei:['běi','měi','fēi','hēi']})}
  <div class="u9ij rv"><span class="u9ijw">⚠️</span><div><b>i в конце слога</b> читается как <b class="y">«й»</b>: b<u>ai</u> = «бай», m<u>ei</u> = «мэй».<small>А одна i в слоге — это «и»: nǐ, bǐ, mǐ. Только в конце после a и e — «й»!</small></div></div>`);
add(3,'Хором: ai и ei',`${hd('跟我读','gēn wǒ dú','ai · ei — хором за учителем','left')}${CHORAL}
  <div class="u8w"><div class="u8lab"><span>🔗</span> Цепочки тонов: 1 → 2 → 3 → 4</div>
   <div class="u8ch u9ch">${[['bāi','bái','bǎi','bài'],['mái','mǎi','mài'],['tāi','tái','tài'],['bēi','běi','bèi'],['fēi','féi','fěi','fèi'],['pēi','péi','pèi']].map(g=>`<div class="g nk">${g.map(s=>fsy(s,s.slice(-2).normalize('NFD').replace(/[̀-ͯ]/g,''))).join('<i class="ar">›</i>')}</div>`).join('')}</div>
   <div class="u8lab rv"><span>⚖️</span> Пары: слушай разницу!</div>
   <div class="u9pairs rv">${[['bái','běi'],['mǎi','měi'],['lái','léi'],['gǎi','gěi'],['hǎi','hēi'],['pái','péi']].map(([x,y])=>`<div class="nk">${fsy(x,'ai')}<i>—</i>${fsy(y,'ei')}</div>`).join('')}</div></div>`);
add(3,'Новые финали: ao и ou',`${hd('复韵母','fù yùnmǔ','ao и ou','left')}
  ${frule('ao','ou','похоже на «<b>ао</b>»<small>рот широко → губы трубочкой</small>','похоже на «<b>оу</b>»<small>губы круглые с самого начала</small>',{ao:['hǎo','māo','dāo','lǎo'],ou:['gǒu','kǒu','tóu','shǒu']})}
  <div class="u8big rv">💡 <b class="z" style="font-size:30px">好</b> hǎo — ты его уже знаешь! В нём финаль <b>ao</b>. А <b>ou</b> — как в слове <b>kǒu</b> «рот».</div>`);
add(3,'Хором: ao и ou',`${hd('跟我读','gēn wǒ dú','ao · ou — хором за учителем','left')}${CHORAL}
  <div class="u8w"><div class="u8lab"><span>🔗</span> Цепочки тонов</div>
   <div class="u8ch u9ch">${[['bāo','bǎo','bào'],['māo','máo','mào'],['dāo','dǎo','dào'],['dōu','dǒu','dòu'],['tōu','tóu','tòu'],['gōu','gǒu','gòu']].map(g=>`<div class="g nk">${g.map(s=>fsy(s,s.slice(-2).normalize('NFD').replace(/[̀-ͯ]/g,''))).join('<i class="ar">›</i>')}</div>`).join('')}</div>
   <div class="u8lab rv"><span>⚖️</span> Пары: слушай разницу!</div>
   <div class="u9pairs rv">${[['dào','dòu'],['tǎo','tóu'],['lǎo','lóu'],['gǎo','gǒu'],['kǎo','kǒu'],['hǎo','hòu']].map(([x,y])=>`<div class="nk">${fsy(x,'ao')}<i>—</i>${fsy(y,'ou')}</div>`).join('')}</div></div>`);
const SO9=[['bái','měi','dào','gǒu'],['hǎi','fēi','māo','tóu'],['lái','hēi','gāo','kǒu'],['mǎi','běi','zǎo','shǒu'],['tài','gěi','lǎo','zǒu']];
add(3,'По очереди + крот',`${hd('一个一个来','yí ge yí ge lái','Каждый по очереди читает свою карточку','left')}${SOLO}
  <div class="u8solo u9solo">${SO9.map((g,i)=>`<div class="sx nk"><button class="sxn" data-tick aria-label="Отметить ученика ${i+1}">${i+1}</button><div class="sxg">${g.map(s=>fsy(s,s.normalize('NFD').replace(/[̀-ͯ]/g,'').slice(-2))).join('')}</div></div>`).join('')}</div>
  <div class="u8krot"><div class="u8kh">🔨 Пока отвечает другой —<br>играй в крота!</div>${qrMini(8,'Крот: финали')}<div class="u8pause">⏸ Учитель позвал отвечать?<br>Нажми <b>«Пауза»</b>!</div></div>`);

/* ===== 4. как придумали пиньинь ===== */
add(4,'Как записать китайский звук?',`${hd('拼音的故事','pīnyīn de gùshi','Как придумали пиньинь','left')}
  <div class="u9q">
   <div class="u9qa nk"><span class="z" style="font-size:150px;color:#2B3270">好</span><p>В иероглифе <b>не написано</b>, как он звучит!</p></div>
   <div class="u9qb">
    <div class="nk rv"><span class="e">🤔</span><p>Как иностранцу запомнить звук <b>hǎo</b>? Нужны <b>буквы</b>!</p></div>
    <div class="nk rv"><span class="e">🌍</span><p>Но у русских — <b>кириллица</b>, у англичан — <b>латиница</b>. И в Китае много звуков, которых <b>нет</b> ни в русском, ни в английском.</p></div>
    <div class="nk rv"><span class="e">🔎</span><p>Учёные слушали, как говорят китайцы, и искали <b>похожие</b> буквы. Получилось несколько разных систем!</p></div>
   </div></div>`);
add(4,'Три системы: кто придумал',`${hd('三种拼法','sān zhǒng pīnfǎ','Три способа записать звуки буквами','left')}
  <div class="u9tl">
   <div class="u9tc nk rv" style="--tc:#D9473D"><div class="u9fl">🇷🇺</div><span class="u9yr">XIX век</span><h3>Палладий</h3><p>Русский монах-учёный жил в Пекине <b>30 лет</b>. Придумал запись <b>русскими буквами</b>.</p><div class="u9ex">«ни хао» · «Бэйцзин»</div><small>Ей пользуются в России <b>до сих пор</b>!</small></div>
   <div class="u9tc nk rv" style="--tc:#2E5FB8"><div class="u9fl">🇬🇧</div><span class="u9yr">XIX век</span><h3>Уэйд и Джайлз</h3><p>Английский дипломат и учёный. Запись <b>латинскими буквами</b> для англичан.</p><div class="u9ex">kung fu · Pei-ching</div><small>Отсюда на Западе слово <b>kung fu</b>!</small></div>
   <div class="u9tc nk rv" style="--tc:#8E5BE8"><div class="u9fl">🇷🇺 + 🇨🇳</div><span class="u9yr">1930-е</span><h3>Синьвэньцзы</h3><p>Советские и китайские учёные вместе сделали <b>латиницу</b> — «новые буквы», чтобы китайцам было легче учиться читать.</p><small>Это была проба перед пиньинем</small></div>
  </div>`);
add(4,'1958: рождение пиньиня',`${hd('汉语拼音','Hànyǔ pīnyīn','1958 год: появился пиньинь','left')}
  <div class="u9py">
   <div class="u9pz nk rv"><span class="u9big">1958</span><p>Китайская комиссия в КНР сделала <b>свою</b> систему — <b>пиньинь</b>. Главный автор — <b>Чжоу Югуан</b>.</p><div class="u9fun">🎂 Чжоу Югуан прожил <b>111 лет</b>!</div></div>
   <div class="u9pl">
    <div class="nk rv"><span class="e">🏫</span><p>С пиньиня начинают учиться все китайские дети</p></div>
    <div class="nk rv"><span class="e">📱</span><p>На пиньине китайцы <b>печатают иероглифы</b> в телефоне</p></div>
    <div class="nk rv"><span class="e">🌍</span><p>Сейчас это главная запись в <b>мире</b>. Её учим и мы!</p></div>
   </div></div>`);
add(4,'Одно слово — три записи',`${hd('一个词，三种写法','yí ge cí, sān zhǒng xiěfǎ','Одно слово — разные буквы','left')}
  <div class="u9cmp">
   <div class="u9cw nk"><span class="z">功夫</span><small>кунг-фу</small></div>
   <div class="u9cr">
    <div class="nk rv" style="--tc:#D9473D"><span>🇷🇺 Палладий</span><b>гунфу</b></div>
    <div class="nk rv" style="--tc:#2E5FB8"><span>🇬🇧 Уэйд–Джайлз</span><b>kung fu</b></div>
    <div class="nk rv" style="--tc:#1FA77A"><span>🇨🇳 пиньинь</span><b>gōngfu</b></div>
   </div></div>
  <div class="u8big rv u9moral">💡 Звук <b>один</b>, а буквы — <b>разные</b>! Буквы — только <b>инструмент</b>: их подбирали для <b>похожих</b> звуков. Поэтому китайское <b>b</b> — не совсем наше «б», а <b>n</b> в конце слога — <b>не наше «н»</b>!</div>`);

/* ===== 5. an en ===== */
add(5,'n в конце — не наш «н»!',`${hd('前鼻韵母','qián bí yùnmǔ','n в конце слога — НЕ наш «н»!','left')}
  <div class="u9n">
   <div class="u9ni nk"><span class="u9tg">👅</span><b>n</b><small>мягко</small></div>
   <div class="u9nr">
    <div class="u9nh rv">👅 Как сказать <b>-n</b></div>
    <div class="u9ns rv"><span>1</span><p>Язык <b>мягкий</b>, расслабленный</p></div>
    <div class="u9ns rv"><span>2</span><p><b>Подушечкой</b> языка <b>мягко прижми к нёбу</b></p></div>
    <div class="u9ns rv"><span>3</span><p>И всё! Этот звук получится <b>сам</b> ✨</p></div>
    <div class="u9nw rv">❌ Не жми кончиком языка в зубы, как в нашем «н»</div>
   </div></div>
  <div class="u8big rv">📜 Даже Палладий записывал эти слоги с мягким знаком: «ань», «энь» — он слышал, что это не наш «н»!</div>`);
add(5,'an и en',`${hd('前鼻韵母','qián bí yùnmǔ','an и en','left')}
  ${frule('an','en','<b>a</b> + мягкий <b>n</b><small>рот широко, язык мягко к нёбу</small>','<b>e</b> + мягкий <b>n</b><small>e — как в знакомом слоге <b>e</b></small>',{an:['sān','fàn','kàn','shān'],en:['mén','hěn','běn','fēn']})}
  <div class="u8big rv">💡 <b class="z" style="font-size:30px">门</b> mén «ворота» — та самая часть в <b class="z" style="font-size:30px">们</b>! А <b class="z" style="font-size:30px">们</b> men — тоже на <b>en</b>.</div>`);
add(5,'Хором: an и en',`${hd('跟我读','gēn wǒ dú','an · en — хором за учителем','left')}${CHORAL}
  <div class="u8w"><div class="u8lab"><span>🔗</span> Цепочки тонов</div>
   <div class="u8ch u9ch">${[['bān','bǎn','bàn'],['fān','fán','fǎn','fàn'],['tān','tán','tǎn','tàn'],['bēn','běn','bèn'],['fēn','fén','fěn','fèn'],['zhēn','zhěn','zhèn']].map(g=>`<div class="g nk">${g.map(s=>fsy(s,s.slice(-2).normalize('NFD').replace(/[̀-ͯ]/g,''))).join('<i class="ar">›</i>')}</div>`).join('')}</div>
   <div class="u8lab rv"><span>⚖️</span> Пары: слушай разницу!</div>
   <div class="u9pairs rv">${[['bàn','bèn'],['pán','pén'],['mǎn','mén'],['fàn','fèn'],['gān','gēn'],['shān','shēn']].map(([x,y])=>`<div class="nk">${fsy(x,'an')}<i>—</i>${fsy(y,'en')}</div>`).join('')}</div></div>`);
add(5,'Все шесть финалей',`${hd('六个韵母','liù ge yùnmǔ','Все новые финали вместе','left')}
  <div class="u9six">${[['ai','«ай»',['bái','hǎi']],['ei','«эй»',['měi','fēi']],['ao','«ао»',['hǎo','māo']],['ou','«оу»',['gǒu','kǒu']],['an','a + мягкий n',['sān','fàn']],['en','e + мягкий n',['mén','hěn']]].map(([f,r,ex])=>`<div class="u9sc nk" style="--fc:${FC9[f]}"><b>${f}</b><small>${r}</small><div>${ex.map(s=>fsy(s,f)).join('')}</div></div>`).join('')}</div>`);
add(5,'Задание № 9 — шутер',task(9,'','','Космический шутер: услышь финаль','Звучит слог — сбей астероид с его пиньинем'));
const D10=['bái','měi','dào','gǒu','fàn','hěn','lái','shǒu','sān','mén'];
const plain9=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
add(5,'Диктант: новые финали',`${hd('听写','tīngxiě','Диктант: напиши слог и тон','left')}${qrMini(10,'Диктант: финали')}
  <div class="u8dw c5">${D10.map((s,i)=>`<div class="u8db nk"><span class="k">${i+1}</span><span class="u8s"><b class="mk hid" data-ans>${s}</b><b class="pl q">?</b></span></div>`).join('')}</div>
  <div class="u8rule">Слушай 3 раза → напиши слог <b>латиницей</b> → нажми <b>значок тона</b>. Слушай конец: <b>ai ei ao ou an en</b>?</div>
  <div class="u8rb"><button class="btn solid" data-reveal>Показать ответы</button></div>`);

/* ===== end ===== */
add(6,'Задание № 11 — мемори-финал',task(11,'','','Мемори-финал','Все наши иероглифы — от 你 до 我们 🏆'));
add(6,'下课！再见！',`
  <img class="bg" src="img/liriver.webp" alt="" style="object-position:60% 50%">
  <div class="gradL" style="width:700px"></div>
  <div class="big"><div class="z">下课！再见！</div><div class="p">xià kè! zàijiàn!</div><div class="r">Урок окончен. До встречи!</div><button class="btn solid" data-say="再见" style="justify-self:start;margin-top:8px">🔊 再见！</button></div>`);

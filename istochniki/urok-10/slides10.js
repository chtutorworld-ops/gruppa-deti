/* ===================== УРОК 10 · ДЕТЕКТИВНАЯ ИСТОРИЯ · 吗 是 不 · an en ===================== */
const PH=(z,p,r,who)=>`<div class="c10b">${who?`<div class="c10who">${who}</div>`:''}<button class="syl has z c10z" data-say="${z}">${z}</button><div class="pyn c10p">${tpy8(p)}</div><div class="c10r">${r}</div></div>`;
const frame=(n,title,lines)=>add(3,title,`<img class="bg" src="img/kadr-${n}.webp" alt="" style="object-fit:cover">
  <div class="c10sh"></div><div class="c10cap">${lines.map((l,i)=>`<div class="${i?'rv ':''}c10line">${PH(...l)}</div>`).join('')}</div>`);
/* ===== start ===== */
add(0,'Обложка',`<img class="bg" src="img/kadr-1.webp" alt="" style="object-fit:cover"><div class="c10sh" style="background:linear-gradient(90deg,rgba(20,16,40,.82) 0%,rgba(20,16,40,.55) 45%,rgba(20,16,40,0) 75%)"></div>
  <div class="big c10cover"><div class="k2" style="color:#CFCBE0">Урок 10 · Детективная история</div><div class="z" style="color:#fff">是 · 不 · 吗</div><div class="pyn" style="font-size:32px;color:#E4DFF5">shì · bù · ma</div><div style="font-size:24px;font-weight:700;color:#E4DFF5">Он твой папа? Да или нет! · финали an en</div></div>`);
add(0,'Задания урока по QR-коду',`
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:grid;grid-template-columns:1fr 360px;gap:70px;align-items:center">
    <div style="display:grid;gap:18px">
      <div class="k2">Пока все подключаются</div>
      <div style="font-weight:800;font-size:46px;line-height:1.05;color:#1E2350;letter-spacing:-.02em">Задания урока — на втором устройстве</div>
      <div style="display:grid;gap:12px;margin-top:6px">
      ${[['1','Найди иероглиф: три комнаты'],['2','Взлом сейфа: звуки'],['3–5','Пропись 吗 · 是 · 不'],['6','Ключи и фонетики — важно!'],['7','Мемори']].map(([e,t])=>`<div class="nk" style="display:flex;align-items:center;gap:16px;padding:13px 20px;font-size:22px;font-weight:700;color:#3D4560"><b style="min-width:54px;color:#664796">№ ${e}</b><span>${t}</span></div>`).join('')}
      </div>
    </div>
    <div class="nk" style="padding:26px;display:grid;justify-items:center;gap:12px"><div class="qrbox" data-qr="${ZURL}"></div><div class="pyn" style="font-size:18px;color:#5B6BD8">Задания урока 10</div></div>
  </div>`);
/* ===== 1. повторение ===== */
const PR8=[...PRON,...PRONM];
add(1,'Местоимения жестами',`${hd('我 你 他 她','wǒ nǐ tā tā','Местоимения: покажи жестом','left')}
  <div class="c10pg">${PR8.map(p=>`<div class="nk c10pc"><button class="syl has z" data-say="${p[0]}">${p[0]}</button><span class="pyn">${py8(p[1])}</span><b>${p[2]}</b></div>`).join('')}</div>`);
add(1,'Таблица местоимений',`${hd('人称代词','rénchēng dàicí','Таблица местоимений','left')}${ptable(false)}`);
add(1,'Каждый называет всю таблицу',`${hd('','','Каждый называет ВСЮ таблицу','left')}${SOLO}
  <div class="c10ru">${PRON.map((p,i)=>`<div class="nk">${p[2]}</div><div class="nk">${PRONM[i][2]}</div>`).join('')}</div>
  <div style="position:absolute;right:40px;bottom:28px">${qrMini(1,'Ждёшь очереди? Найди иероглиф!')}</div>`);
add(1,'Задание № 2 — взлом сейфа',task(2,'','','Взлом сейфа','Слушай слог и поставь колёсики: инициаль + финаль. 3 сейфа'));
/* ===== 2. an en ===== */
add(2,'n в конце — не наш «н»!',`${hd('前鼻韵母','qián bí yùnmǔ','an и en: n в конце — НЕ наш «н»!','left')}
  <div class="u9n">
   <div class="u9ni nk"><img src="img/yazyk.jpg" alt="Рот и язык: спинка языка, нёбо"></div>
   <div class="u9nr">
    <div class="u9nh rv">Как сказать <b>-n</b></div>
    <div class="u9ns rv"><span>1</span><p>Язык <b>мягкий</b>, расслабленный</p></div>
    <div class="u9ns rv"><span>2</span><p><b>Подушечкой</b> языка <b>мягко прижми к нёбу</b></p></div>
    <div class="u9ns rv"><span>3</span><p>И всё! Звук получится <b>сам</b></p></div>
    <div class="u9nw rv">Не жми кончиком языка в зубы, как в нашем «н»</div>
   </div></div>`);
add(2,'an и en',`${hd('前鼻韵母','qián bí yùnmǔ','an и en','left')}
  ${frule('an','en','<b>a</b> + мягкий <b>n</b><small>рот широко, язык мягко к нёбу</small>','<b>e</b> + мягкий <b>n</b><small>e — как в знакомом слоге <b>e</b></small>',{an:['sān','fàn','kàn','shān'],en:['mén','hěn','běn','fēn']})}
  <div class="u8big rv">Ты уже знаешь слог на <b>en</b>: <b class="z" style="font-size:30px">们</b> men!</div>`);
add(2,'Хором: an и en',`${hd('跟我读','gēn wǒ dú','an · en — хором за учителем','left')}${CHORAL}
  ${chorus9('an','en',[['fān','fán','fǎn','fàn'],['tān','tán','tǎn','tàn'],['cān','cán','cǎn','càn'],['fēn','fén','fěn','fèn'],['shēn','shén','shěn','shèn'],['bēn','mén','běn','bèn']],[['gān','gēn'],['shān','shēn'],['pán','pén'],['fán','fén'],['bǎn','běn'],['fǎn','fěn'],['bàn','bèn'],['fàn','fèn']])}`);
const TRI=[[['bān','bāi','bēi'],0],[['méi','mén','mán'],1],[['gǒu','gǎo','gǎn'],2],[['shēn','zhēn','chēn'],1],[['zài','cài','sài'],1],[['láo','lóu','lán'],0],[['kěn','hěn','gěn'],1],[['tóu','tán','táo'],2],[['fàn','fèi','fèn'],2],[['zān','sān','cān'],0]];
const triBox=(t,k)=>{const [o,a]=t;const c=SYL.char(o[a]);return `<div class="nk c10t"><div class="c10tn">${k}</div><button class="btn solid c10ear" data-say="${c}" data-v="${vkey(o[a])}">Слушай</button><div class="c10to">${o.map((s,i)=>`<div class="c10o${i===a?' ok':''}"><span>${i+1}</span><b>${s}</b>${i===a?'<i class="rv">верно</i>':''}</div>`).join('')}</div></div>`;};
for(let i=0;i<TRI.length;i+=2)add(2,`Самостоятельная ${i/2+1}: покажи 1, 2 или 3`,`${hd('','','Открытая самостоятельная: покажи в камеру 1, 2 или 3','left')}<div class="c10tw">${triBox(TRI[i],i+1)}${triBox(TRI[i+1],i+2)}</div>`);
/* ===== 3. история ===== */
frame(1,'Кадр 1',[['小朋友，你好！','xiǎo péngyou, nǐ hǎo!','Привет, дружок!','Полицейский']]);
frame(2,'Кадр 2',[['您好！','nín hǎo!','Здравствуйте!','Мальчик']]);
frame(3,'Кадр 3',[['小朋友，你叫什么名字？','xiǎo péngyou, nǐ jiào shénme míngzi?','Дружок, как тебя зовут?','Полицейский'],['我叫小明。','wǒ jiào Xiǎo Míng.','Меня зовут Сяо Мин.','Мальчик']]);
frame(4,'Кадр 4',[['她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?','Полицейский'],['不是，不是！她不是我妈妈。','bú shì, bú shì! tā bú shì wǒ māma.','Нет, нет! Она не моя мама.','Мальчик']]);
frame(5,'Кадр 5',[['她是我妈妈！','tā shì wǒ māma!','Вот моя мама!','Мальчик']]);
const DLG=[['p','小朋友，你好！','xiǎo péngyou, nǐ hǎo!','Привет, дружок!'],['b','您好！','nín hǎo!','Здравствуйте!'],['p','小朋友，你叫什么名字？','xiǎo péngyou, nǐ jiào shénme míngzi?','Как тебя зовут?'],['b','我叫小明。','wǒ jiào Xiǎo Míng.','Меня зовут Сяо Мин.'],['p','她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?'],['b','不是，不是！她不是我妈妈。','bú shì, bú shì! tā bú shì wǒ māma.','Нет, нет! Она не моя мама.'],['b','她是我妈妈！','tā shì wǒ māma!','Вот моя мама!']];
const hl=z=>z.replace(/(吗|是|不)/g,'<em>$1</em>');
add(3,'Весь диалог',`${hd('对话','duìhuà','Диалог','left')}
  <div class="c10chat nk">${DLG.map(([w,z,p,r])=>`<div class="c10m ${w}"><span class="c10av ${w}"></span><div class="c10bub"><button class="syl has z" data-say="${z}">${hl(z)}</button><div class="pyn">${tpy8(p)}</div><small>${r}</small></div></div>`).join('')}</div>
  <div class="c10new">${[['吗','ma','вопрос «да или нет?»'],['是','shì','является (связка)'],['不','bù','не']].map(([z,p,r])=>`<div class="nk rv"><button class="syl has z" data-say="${z}">${z}</button><div><div class="pyn">${tpy8(p)}</div><b>${r}</b></div></div>`).join('')}</div>`);
/* ===== 4. 吗 是 不 ===== */
add(4,'吗 — вопрос «да или нет?»',`${hd('吗','ma','Вопросительная частица 吗','left')}
  <div class="c10rule nk">Общий вопрос (на него отвечают <b>«да»</b> или <b>«нет»</b>): просто поставь <b class="z">吗</b> в <b>конец</b> предложения!</div>
  <div class="c10ex"><img src="img/malchik-obychnyj.webp" alt="Сяо Мин">
   <div class="c10exs"><div class="nk c10s1"><button class="syl has z" data-say="他叫小明。">他叫小明。</button><div class="pyn">${tpy8('tā jiào Xiǎo Míng.')}</div><small>Его зовут Сяо Мин.</small></div>
   <div class="c10q nk rv">Как спросить?</div>
   <div class="nk c10s1 rv"><button class="syl has z" data-say="他叫小明吗？">他叫小明<em>吗</em>？</button><div class="pyn">${tpy8('tā jiào Xiǎo Míng ma?')}</div><small>Его зовут Сяо Мин?</small></div></div></div>
  <div class="c10hint rv"><b class="z">吗</b> = <b class="z">口</b> «рот» + <b class="z">马</b> «звучит ma» — как в <b class="z">妈</b>!</div>`);
add(4,'是 и 不是 — да и нет',`${hd('是 · 不是','shì · bú shì','Как ответить на вопрос с 吗?','left')}
  <div class="c10yn"><div class="nk"><img src="img/malchik-obychnyj.webp" alt=""><div><button class="syl has z c10big" data-say="是">是</button><div class="pyn">${tpy8('shì')}</div><b>да · «является»</b></div></div>
  <div class="nk rv"><img src="img/malchik-net.webp" alt=""><div><button class="syl has z c10big" data-say="不是">不是</button><div class="pyn">${tpy8('bú shì')}</div><b>нет · «не является»</b></div></div></div>`);
add(4,'是 — связка',`${hd('是','shì','是 — связка (как to be)','left')}
  <div class="c10lk">
   <div class="nk rv"><span>RU</span><p>Она <b class="gap">—</b> моя мама.</p></div>
   <div class="nk rv"><span>EN</span><p>She <b>is</b> my mom.</p></div>
   <div class="nk rv"><span>中</span><p><button class="syl has z" data-say="她是我妈妈。">她<em>是</em>我妈妈。</button> <i class="pyn">${tpy8('tā shì wǒ māma.')}</i></p></div>
  </div><div class="c10rule nk rv" style="top:auto;bottom:40px"><b class="z">是</b> связывает: <b>кто</b> = <b>кто</b>. В русском на этом месте тире, в английском — <b>is</b>.</div>`);
add(4,'不 перед 4-м тоном',`${hd('不','bù','Тон 不 меняется!','left')}
  <div class="c10rule nk"><b class="z">不</b> <span class="pyn">bù</span> — 4-й тон. Но <b>перед 4-м тоном</b> он становится <b>2-м</b>: <span class="pyn">bù → bú</span></div>
  <div class="c10tn2"><div class="nk rv"><button class="syl has z" data-say="不是">不是</button><div class="pyn">${tpy8('bù')} + ${tpy8('shì')} → ${tpy8('bú shì')}</div><b>4 + 4 → 2 + 4</b></div>
   <div class="nk rv"><button class="syl has z" data-say="不好">不好</button><div class="pyn">${tpy8('bù hǎo')}</div><b>перед 3-м тоном — не меняется</b></div></div>`);
add(4,'Да или нет: 是 и 不是',`${hd('是 · 不是','shì · bú shì','Скажи «да» и «нет»','left')}
  <div class="c10neg">${[['她是我妈妈。','tā shì wǒ māma.','Она моя мама.','她不是我妈妈。','tā bú shì wǒ māma.','Она не моя мама.'],['他是我爸爸。','tā shì wǒ bàba.','Он мой папа.','他不是我爸爸。','tā bú shì wǒ bàba.','Он не мой папа.']].map(([a,ap,ar,b,bp,br])=>`<div class="nk"><button class="syl has z" data-say="${a}">${hl(a)}</button><div class="pyn">${tpy8(ap)}</div><small>${ar}</small></div><div class="nk rv"><button class="syl has z" data-say="${b}">${hl(b)}</button><div class="pyn">${tpy8(bp)}</div><small>${br}</small></div>`).join('')}</div>`);
add(4,'Она твоя мама?',`<img class="bg" src="img/kadr-4.webp" alt="" style="object-fit:cover"><div class="c10sh"></div>
  <div class="c10cap"><div class="c10line">${PH('她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?','Вопрос')}</div><div class="c10line rv">${PH('不是！','bú shì!','Нет!','Ответ')}</div></div>`);
add(4,'А эта — мама?',`<img class="bg" src="img/kadr-5.webp" alt="" style="object-fit:cover"><div class="c10sh"></div>
  <div class="c10cap"><div class="c10line">${PH('她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?','Вопрос')}</div><div class="c10line rv">${PH('是！她是我妈妈。','shì! tā shì wǒ māma.','Да! Она моя мама.','Ответ')}</div></div>`);
add(4,'Задание № 3 — пропись 吗',task(3,'','','Пропись: 吗','Ключ 口 «рот» + 马 «звучит ma»'));
add(4,'Задание № 4 — пропись 是',task(4,'','','Пропись: 是','Сверху 日, снизу ноги'));
add(4,'Задание № 5 — пропись 不',task(5,'','','Пропись: 不','Всего 4 черты'));
/* ===== 5. ключи и фонетики ===== */
add(5,'Задание № 6 — ключи и фонетики',task(6,'','','Ключи и фонетики — ВАЖНО!','Все ключи и подсказки чтения, которые мы прошли. Запомни их!'));
const QZ=[['女','Это ключ «женщина»',1,'Да: 女 «женщина», как в 妈 и 她'],['马','Это ключ «рот»',0,'Нет: 马 подсказывает чтение ma'],['口','Это ключ «рот»',1,'Да: 口 «рот», как в 叫 и 吗'],['亻','Это ключ «вода»',0,'Нет: 亻 — ключ «человек», как в 你 他 们'],['巴','Подсказывает чтение ba',1,'Да: 巴 → 爸 bà'],['门','Подсказывает чтение ma',0,'Нет: 门 подсказывает men → 们'],['氵','Это ключ «вода»',1,'Да: 氵 «вода»'],['日','Это ключ «дерево»',0,'Нет: 日 — «солнце». «Дерево» — 木'],['父','Это ключ «отец»',1,'Да: 父 сверху в 爸'],['丩','Подсказывает чтение jiao',1,'Да: 丩 → 叫 jiào']];
QZ.forEach(([z,t,a,ex],i)=>add(5,`Квиз ${i+1}: 是 или 不是?`,`${hd('是不是？','shì bu shì?',`Квиз ${i+1} из ${QZ.length}: покажи жестом — да или нет`,'left')}
  <div class="c10qz"><div class="nk c10qc"><span class="z">${z}</span></div>
   <div class="c10qr"><div class="c10qt">${t}</div>
    <div class="c10qb"><div class="nk${a?' win':''}"><span class="z">是</span><span class="pyn">shì</span><small>да</small></div><div class="nk${a?'':' win'}"><span class="z">不是</span><span class="pyn">bú shì</span><small>нет</small></div></div>
    <div class="c10qa rv">${ex}</div></div></div>`,'c10quiz'));
add(5,'Задание № 7 — мемори',task(7,'','','Мемори','Если осталось время: найди пары'));
add(6,'下课！再见！',`<img class="bg" src="img/kadr-5.webp" alt="" style="object-fit:cover"><div class="c10sh" style="background:linear-gradient(90deg,rgba(20,16,40,.8),rgba(20,16,40,0) 70%)"></div>
  <div class="big"><div class="z" style="color:#fff">下课！再见！</div><div class="pyn" style="font-size:34px;color:#E4DFF5">xià kè! zàijiàn!</div><div style="font-size:26px;font-weight:700;color:#E4DFF5">Урок окончен. До встречи!</div><button class="btn solid" data-say="再见" style="justify-self:start;margin-top:8px">再见！</button></div>`);

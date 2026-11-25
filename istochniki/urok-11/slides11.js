/* ===================== УРОК 11 · ПОВТОРЯЕМ: звуки · иероглифы · 吗 是 不 · ключи · диалог ===================== */
/* Порядок Дарьи (2026-11-25): звуки → диктант на слоги на листочке → старые иероглифы (кабинет 1, 2) →
   объяснение 吗 是 不 → пропись (кабинет 3) → ключи + открытая самостоятельная → диалог за учителем →
   кабинет 4–6 (верно/неверно, плитки, пишем предложения), пока учитель опрашивает диалог → мемори в запасе. */
B.length=0;B.push('Начало','1. Звуки','2. Диктант на слоги','3. Повторяем иероглифы','4. 吗 · 是 · 不','5. Ключи и фонетики','6. Диалог и задания','Конец');
const PH=(z,p,r,who)=>`<div class="c10b">${who?`<div class="c10who">${who}</div>`:''}<button class="syl has z c10z" data-say="${z}">${z}</button><div class="pyn c10p">${tpy8(p)}</div><div class="c10r">${r}</div></div>`;
const hl=z=>z.replace(/(吗|是|不)/g,'<em>$1</em>');
const HZ11=[['你','nǐ','ты'],['我','wǒ','я'],['好','hǎo','хорошо'],['叫','jiào','звать'],['妈','mā','мама'],['爸','bà','папа'],['他','tā','он'],['她','tā','она'],['们','men','много (们)']];
const NEW11=[['吗','ma','вопрос «да или нет?»'],['是','shì','являться · да'],['不','bù','не']];

/* ===== 0. начало ===== */
add(0,'Обложка',`<div class="c11cov">
  <div class="c11cl"><div class="k2">Урок 11</div><div class="c11ct">Повторяем и пишем</div>
   <div class="c11cs">звуки · иероглифы · ключи · диалог</div></div>
  <div class="c11cg">${HZ11.map(h=>`<div class="nk"><span class="z">${h[0]}</span></div>`).join('')}${NEW11.map(h=>`<div class="nk c11cn"><span class="z">${h[0]}</span></div>`).join('')}</div></div>`);
add(0,'Задания урока по QR-коду',`
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:grid;grid-template-columns:1fr 360px;gap:70px;align-items:center">
    <div style="display:grid;gap:16px">
      <div class="k2">Пока все подключаются</div>
      <div style="font-weight:800;font-size:46px;line-height:1.05;color:#1E2350;letter-spacing:-.02em">Задания урока — на втором устройстве</div>
      <div style="display:grid;gap:10px;margin-top:6px">
      ${[['1','Собери комплект карточек'],['2','Диктант: с русского на китайский'],['3','Пропись 吗 · 是 · 不'],['4','Верно или неверно?'],['5','Собери предложение из плиток'],['6','Напиши предложение иероглифами'],['7','Мемори']].map(([e,t])=>`<div class="nk" style="display:flex;align-items:center;gap:16px;padding:11px 20px;font-size:22px;font-weight:700;color:#3D4560"><b style="min-width:54px;color:#664796">№ ${e}</b><span>${t}</span></div>`).join('')}
      </div>
    </div>
    <div class="nk" style="padding:26px;display:grid;justify-items:center;gap:12px"><div class="qrbox" data-qr="${ZURL}"></div><div class="pyn" style="font-size:18px;color:#5B6BD8">Задания урока 11</div></div>
  </div>`);

/* ===== 1. звуки ===== */
const INI1=[['b','б'],['p','пх'],['m','м'],['f','ф'],['d','д'],['t','тх'],['n','н'],['l','л'],['g','г'],['k','кх'],['h','х']];
const INI2=[['z','дз'],['c','цх'],['s','с'],['zh','дж'],['ch','чх'],['sh','ш']];
add(1,'Звуки: инициали',`${hd('声母','shēngmǔ','Звуки: инициали','left')}${CHORAL}
  <div class="c11ini">
   <div class="c11row r1"><div class="c11lab">1 строка</div><div class="c11keys">${INI1.map(([l,r])=>`<div class="c11k"><b>${l}</b><small>${r}</small></div>`).join('')}</div></div>
   <div class="c11row r2"><div class="c11lab">2 строка</div><div class="c11keys">${INI2.map(([l,r])=>`<div class="c11k"><b>${l}</b><small>${r}</small></div>`).join('')}</div></div>
   <div class="c11rule rv"><div class="c11rt"><b>ci</b> = «цы» · <b>chi</b> = «чшы»</div><div class="c11rs">В <b>ci</b> и <b>chi</b> предыхание <b>исчезает</b>! Так же: <b>zi</b> «дзы» · <b>si</b> «сы» · <b>zhi</b> «джы» · <b>shi</b> «шы»</div></div>
  </div>`);
const FIN11=[['ai','ай',['bái','lái']],['ei','эй',['měi','bēi']],['ao','ао',['dào','hǎo']],['ou','оу',['gǒu','tóu']],['an','a + мягкий n',['sān','fàn']],['en','e + мягкий n',['mén','hěn']]];
add(1,'Звуки: финали',`${hd('韵母','yùnmǔ','Звуки: финали','left')}${CHORAL}
  <div class="c11fin">
   <div class="c11row r3"><div class="c11lab">Простые</div><div class="c11keys">${[['a','а'],['o','о'],['u','у'],['i','и'],['e','э']].map(([l,r])=>`<div class="c11k"><b>${l}</b><small>${r}</small></div>`).join('')}</div></div>
   <div class="c11fg">${FIN11.map(([f,r,ex])=>`<div class="nk c11fc rv"><b>${f}</b><small>${r}</small><div class="c11fx">${ex.map(sy).join('')}</div></div>`).join('')}</div>
  </div>
  <div class="hint">Нажми на слог, чтобы послушать</div>`);
add(1,'n в конце — не наш «н»!',`${hd('前鼻韵母','qián bí yùnmǔ','an и en: n в конце — НЕ наш «н»!','left')}
  <div class="u9n">
   <div class="u9ni nk"><img src="img/yazyk.jpg" alt="Рот и язык: спинка языка, нёбо"></div>
   <div class="u9nr">
    <div class="u9nh rv">Как сказать <b>-n</b></div>
    <div class="u9ns rv"><span>1</span><p>Язык <b>мягкий</b>, расслабленный</p></div>
    <div class="u9ns rv"><span>2</span><p><b>Подушечкой</b> языка <b>мягко прижми к нёбу</b></p></div>
    <div class="u9ns rv"><span>3</span><p>И всё! Звук получится <b>сам</b></p></div>
    <div class="u9nw rv">Не жми кончиком языка в зубы, как в нашем «н»</div>
   </div></div>`);
add(1,'an и en',`${hd('前鼻韵母','qián bí yùnmǔ','an и en','left')}
  ${frule('an','en','<b>a</b> + мягкий <b>n</b><small>рот широко, язык мягко к нёбу</small>','<b>e</b> + мягкий <b>n</b><small>e — как в знакомом слоге <b>e</b></small>',{an:['sān','fàn','kàn','shān'],en:['mén','hěn','běn','fēn']})}
  <div class="u8big rv">Ты уже знаешь слог на <b>en</b>: <b class="z" style="font-size:30px">们</b> men!</div>`);
add(1,'Хором: an и en',`${hd('跟我读','gēn wǒ dú','an · en — хором за учителем','left')}${CHORAL}
  ${chorus9('an','en',[['fān','fán','fǎn','fàn'],['tān','tán','tǎn','tàn'],['cān','cán','cǎn','càn'],['fēn','fén','fěn','fèn'],['shēn','shén','shěn','shèn'],['bēn','mén','běn','bèn']],[['gān','gēn'],['shān','shēn'],['pán','pén'],['fán','fén'],['bǎn','běn'],['fǎn','fěn'],['bàn','bèn'],['fàn','fèn']])}`);
const TRI=[[['bān','bāi','bēi'],0],[['méi','mén','mán'],1],[['gǒu','gǎo','gǎn'],2],[['shēn','zhēn','chēn'],1],[['zài','cài','sài'],1],[['láo','lóu','lán'],0],[['kěn','hěn','gěn'],1],[['tóu','tán','táo'],2],[['fàn','fèi','fèn'],2],[['zān','sān','cān'],0]];
const triBox=(t,k)=>{const [o,a]=t;const c=SYL.char(o[a]);return `<div class="nk c10t"><div class="c10tn">${k}</div><button class="btn solid c10ear" data-say="${c}" data-v="${vkey(o[a])}">Слушай</button><div class="c10to">${o.map((s,i)=>`<div class="c10o${i===a?' ok':''}"><span>${i+1}</span><b>${s}</b>${i===a?'<i class="rv">верно</i>':''}</div>`).join('')}</div></div>`;};
for(let i=0;i<TRI.length;i+=2)add(1,`Самостоятельная ${i/2+1}: покажи 1, 2 или 3`,`${hd('','','Открытая самостоятельная: покажи в камеру 1, 2 или 3','left')}<div class="c10tw">${triBox(TRI[i],i+1)}${triBox(TRI[i+1],i+2)}</div>`);

/* ===== 2. диктант на слоги (на листочке, голос диктанта audio/dict) ===== */
// [слог, иероглиф для звука]
const DK11=[['fàn','饭'],['hěn','很'],['dào','到'],['bān','班'],['gǒu','狗'],['mén','门'],['lái','来'],['shān','山'],['měi','美'],['běn','本'],['chī','吃'],['pǔ','普']];
const dcell=(s,c,i,ans)=>`<div class="nk c11dc${ans?' rv':''}"><span class="c11dn">${i+1}</span>${ans?`<b class="c11da">${s}</b>`:'<b class="c11dq">?</b>'}<button class="ear c11de" data-dict="${c}" aria-label="Слог ${i+1}">${EAR}</button></div>`;
add(2,'Диктант на слоги',`${hd('听写','tīngxiě','Самостоятельная: диктант на слоги','left')}<div class="mode ch">✍️ На листочке</div>
  <div class="c11dt">Запиши каждый слог <b>пиньинем</b> и поставь <b>тон</b>. Слушай внимательно конец слога!</div>
  <div class="c11dg">${DK11.map(([s,c],i)=>dcell(s,c,i,false)).join('')}</div>`);
add(2,'Проверяем диктант',`${hd('听写','tīngxiě','Проверяем диктант','left')}
  <div class="c11dt">Сверь со своим листочком. Поставь себе ✓ за каждый верный слог</div>
  <div class="c11dg">${DK11.map(([s,c],i)=>dcell(s,c,i,true)).join('')}</div>`);

/* ===== 3. старые иероглифы ===== */
add(3,'Повторяем иероглифы',`${hd('汉字','hànzì','Повторяем иероглифы: как читается? что значит?','left')}
  <div class="c11hg">${HZ11.map(([z,p,r])=>`<div class="nk c11hc"><button class="syl has z" data-say="${z}">${z}</button><div class="rv"><span class="pyn">${tpy8(p)}</span><b>${r}</b></div></div>`).join('')}</div>`);
add(3,'Задание № 1 — собери комплект карточек',task(1,'','','Собери комплект карточек','Иероглиф + пиньинь + перевод: собери все 9 комплектов'));
add(3,'Задание № 2 — диктант: с русского на китайский',task(2,'','','Диктант: с русского на китайский','Видишь русское слово — напиши иероглиф и подпиши пиньинь'));

/* ===== 4. 吗 是 不 — ещё раз объясняем ===== */
add(4,'吗 — вопрос «да или нет?»',`${hd('吗','ma','Вопросительная частица 吗','left')}
  <div class="c10rule nk">Общий вопрос (на него отвечают <b>«да»</b> или <b>«нет»</b>): просто поставь <b class="z">吗</b> в <b>конец</b> предложения!</div>
  <div class="c10ex"><img src="img/malchik-obychnyj.webp" alt="">
   <div class="c10exs"><div class="nk c10s1"><button class="syl has z" data-say="她是你妈妈。">她是你妈妈。</button><div class="pyn">${tpy8('tā shì nǐ māma.')}</div><small>Она — твоя мама.</small></div>
   <div class="c10q nk rv">Как спросить?</div>
   <div class="nk c10s1 rv"><button class="syl has z" data-say="她是你妈妈吗？">她是你妈妈<em>吗</em>？</button><div class="pyn">${tpy8('tā shì nǐ māma ma?')}</div><small>Она твоя мама?</small></div></div></div>
  <div class="c10hint rv"><b class="z">吗</b> = <b class="z">口</b> «рот» + <b class="z">马</b> «звучит ma» — как в <b class="z">妈</b>!</div>`);
add(4,'是 и 不是 — да и нет',`${hd('是 · 不是','shì · bú shì','Как ответить на вопрос с 吗?','left')}
  <div class="c10yn"><div class="nk"><img src="img/malchik-da.webp" alt=""><div><button class="syl has z c10big" data-say="是">是</button><div class="pyn">${tpy8('shì')}</div><b>да · «является»</b></div></div>
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
add(4,'Задание № 3 — пропись 吗 是 不',task(3,'','','Пропись: 吗 · 是 · 不','Сначала обведи по образцу, потом напиши сам'));

/* ===== 5. ключи и фонетики + открытая самостоятельная ===== */
const KEYS11=[['女','женщина','妈 好 她'],['口','рот','叫 吗'],['亻','человек','你 他 们'],['父','отец','爸'],['氵','вода',''],['木','дерево',''],['日','солнце','是']];
const FON11=[['马','ma','妈 吗'],['巴','ba','爸'],['门','men','们'],['丩','jiu → jiào','叫']];
add(5,'Ключи и фонетики',`${hd('部首','bùshǒu','Ключи и фонетики','left')}
  <div class="c11kr"><span class="c11kk">Ключ</span> подсказывает <b>СМЫСЛ</b><i></i><span class="c11kf">Фонетик</span> подсказывает <b>ЧТЕНИЕ</b></div>
  <div class="c11kw">
   <div class="c11kg k">${KEYS11.map(([z,m,ex])=>`<div class="nk c11kc rv"><span class="z">${z}</span><b>${m}</b>${ex?`<small class="z">${ex}</small>`:''}</div>`).join('')}</div>
   <div class="c11kg f">${FON11.map(([z,m,ex])=>`<div class="nk c11kc rv"><span class="z">${z}</span><b>звучит <span class="pyn">${m}</span></b><small class="z">${ex}</small></div>`).join('')}</div>
  </div>`);
add(5,'Ключи в новых иероглифах',`${hd('吗 · 是','ma · shì','Ключи в новых иероглифах','left')}
  <div class="c11nk">
   <div class="nk c11nc"><button class="syl has" data-say="吗" style="padding:0">${hzSvg('吗',230)}</button><div class="c11eq rv"><b class="z" style="color:#FF5C8A">口</b><small>ключ «рот» — смысл</small><i>+</i><b class="z" style="color:#5B6BD8">马</b><small>звучит ma — чтение</small></div></div>
   <div class="nk c11nc"><button class="syl has" data-say="是" style="padding:0">${hzSvg('是',230)}</button><div class="c11eq rv"><b class="z" style="color:#FF5C8A">日</b><small>сверху «солнце»</small><i>+</i><b style="color:#2B3270;font-size:30px">ноги</b><small>снизу</small></div></div>
  </div>`);
const KQ=[['女',['рот','женщина','вода'],1],['口',['рот','солнце','человек'],0],['亻',['отец','дерево','человек'],2],['马',['звучит ma','звучит ba','звучит men'],0],['巴',['звучит men','звучит ba','звучит jiao'],1],
 ['门',['звучит ma','звучит ba','звучит men'],2],['氵',['женщина','вода','рот'],1],['日',['солнце','дерево','отец'],0],['父',['человек','вода','отец'],2],['木',['рот','дерево','солнце'],1]];
const kqBox=(q,k)=>{const [z,o,a]=q;return `<div class="nk c10t c11kq"><div class="c10tn">${k}</div><div class="c11kz z">${z}</div><div class="c11kt">${/^звучит/.test(o[0])?'Как подсказывает чтение?':'Что значит этот ключ?'}</div><div class="c10to">${o.map((s,i)=>`<div class="c10o${i===a?' ok':''}"><span>${i+1}</span><b class="c11ko">${s}</b>${i===a?'<i class="rv">верно</i>':''}</div>`).join('')}</div></div>`;};
for(let i=0;i<KQ.length;i+=2)add(5,`Ключи: самостоятельная ${i/2+1}`,`${hd('','','Открытая самостоятельная: ключи · покажи 1, 2 или 3','left')}<div class="c10tw">${kqBox(KQ[i],i+1)}${kqBox(KQ[i+1],i+2)}</div>`);

/* ===== 6. диалог за учителем + кабинет 4–6 ===== */
const DLG=[['p','小朋友，你好！','xiǎo péngyou, nǐ hǎo!','Привет, дружок!'],['b','您好！','nín hǎo!','Здравствуйте!'],['p','小朋友，你叫什么名字？','xiǎo péngyou, nǐ jiào shénme míngzi?','Как тебя зовут?'],['b','我叫小明。','wǒ jiào Xiǎo Míng.','Меня зовут Сяо Мин.'],['p','她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?'],['b','不是，不是！她不是我妈妈。','bú shì, bú shì! tā bú shì wǒ māma.','Нет, нет! Она не моя мама.'],['b','她是我妈妈！','tā shì wǒ māma!','Вот моя мама!']];
add(6,'Читаем диалог за учителем',`${hd('对话','duìhuà','Читаем диалог за учителем','left')}${CHORAL}
  <div class="c11dl nk">${DLG.map(([w,z,p,r])=>`<div class="c11ml ${w}"><span class="c10av ${w}"></span><div class="c11mb"><button class="syl has z" data-say="${z}">${hl(z)}</button><div class="c11mp"><span class="pyn">${tpy8(p)}</span><small>${r}</small></div></div></div>`).join('')}</div>
  <div class="c11dp"><img src="img/kadr-4.webp" alt="Полицейский спрашивает мальчика"></div>
  <div class="c11dr"><div><b class="z">吗</b> в конце — вопрос «да или нет?»</div><div><b class="z">是</b> — связка: она <b>—</b> мама</div><div><b class="z">不是</b> <i class="pyn">bú shì</i>: перед 4-м тоном bù → bú</div></div>`);
add(6,'Задания № 4–6 в кабинете',`${hd('','','Работаем в кабинете: задания № 4, 5, 6','left')}
  <div class="c11t3">${[[4,'Верно или неверно?','Правильно ли переведено предложение'],[5,'Собери предложение','Из слов-плиток, по порядку'],[6,'Напиши иероглифами','Короткие предложения пальцем. Можно включить подсказки']].map(([n,t,d])=>`<div class="nk c11ti"><div class="c11tn"><span>Задание</span><b>№ ${n}</b></div><b>${t}</b><small>${d}</small></div>`).join('')}</div>
  <div class="c11tq nk"><div class="qrbox" data-qr="${ZURL}#4" data-size="120" style="width:136px;height:136px;padding:8px"></div><div><b>🎤 Пока ты работаешь</b><span>учитель по очереди спросит у каждого диалог</span></div></div>`);
add(6,'Задание № 7 — мемори',task(7,'','','Мемори','Если осталось время: все наши иероглифы, найди пары'));
add(7,'下课！再见！',`<div class="c11cov"><div class="c11cl"><div class="z" style="font-size:120px;line-height:1.05">下课！<br>再见！</div><div class="pyn" style="font-size:34px;color:#5B6BD8">xià kè! zàijiàn!</div><div class="c11cs">Урок окончен. До встречи!</div><button class="btn solid" data-say="再见" style="justify-self:start;margin-top:8px;font-size:22px">再见！</button></div>
  <div class="c11cg">${HZ11.map(h=>`<div class="nk"><span class="z">${h[0]}</span></div>`).join('')}${NEW11.map(h=>`<div class="nk c11cn"><span class="z">${h[0]}</span></div>`).join('')}</div></div>`);

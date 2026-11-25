# Урок 11: src.html = презентация урока 10 (base10.html) с заменённым блоком слайдов (slides11.js) и стилями s11.css
import os
H=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(H,f),encoding='utf-8').read()
s=r('base10.html')
a=s.index('/* ===================== УРОК 10 · ДЕТЕКТИВНАЯ'); b=s.index('/* ---------- engine ---------- */')
s=s[:a]+r('slides11.js')+'\n\n'+s[b:]
i=s.index('</style>\n\n<div id="stage">'); s=s[:i]+r('s11.css')+s[i:]
s=s.replace('<title>Урок 10 — Детективная история</title>','<title>Урок 11 — Повторяем и пишем</title>')
s=s.replace("'lesson10-slide'","'lesson11-slide'").replace('gruppa-deti-sait/urok-10/','gruppa-deti-sait/urok-11/')
DICT='''/* диктант на слоги: голос диктанта (audio/dict/), если файла нет — обычный голос */
stage.addEventListener('click',e=>{const d=e.target.closest('[data-dict]');if(!d)return;const c=d.dataset.dict;
  try{curA&&curA.pause();}catch(_){}const a=new Audio(AUDIO_BASE+'dict/'+c.codePointAt(0).toString(16)+'.mp3');curA=a;d.classList.add('play');
  const off=()=>d.classList.remove('play');let f=false;const fail=()=>{if(f)return;f=true;off();playMp3(c,1,d,'play',()=>sayTTS(c,d));};
  a.onended=off;a.onerror=fail;a.play().catch(fail);});
'''
k=s.index('/* stroke-order animations'); s=s[:k]+DICT+s[k:]
assert 'lesson10' not in s
open(os.path.join(H,'src.html'),'w',encoding='utf-8').write(s); print('ok',len(s))

#!/usr/bin/env python3
"""Вставляет в кабинет учителя блок «Что звучит в презентации — по слайдам» (Дарья диктует сама, если диктор плох).
python3 zvuk-uchitel.py urok-11/index.html urok-11/uchitel/index.html [доп.json с пиньинем для иероглифов без подписи]
Блок встаёт между <!--ZVUK--> и <!--/ZVUK-->."""
import json,subprocess,sys,html,re
pres,uch=sys.argv[1],sys.argv[2]
PY=json.load(open(sys.argv[3],encoding='utf-8')) if len(sys.argv)>3 else {}
d=json.loads(subprocess.check_output(['node','tests/zvuk-slides.js',pres]))
e=html.escape
def chip(z,p,extra=''):
    return f'<span class="zv"><b class="zh">{e(z)}</b>{f"<i>{e(p)}</i>" if p else ""}{extra}</span>'
rows=[];prev=None
for s in d:
    key=json.dumps(s['items'])
    if key==prev: continue
    prev=key
    its=s['items'];cells=[]
    if all(x['dict'] for x in its):          # диктант на слоги: номер + слог
        for k,x in enumerate(its):cells.append(chip(x['dict'],PY.get(x['dict'],''),f'<small>№ {k+1}</small>'))
    else:
        for k,x in enumerate(its):
            if x['opts']:                      # открытая самостоятельная: что звучит и какой номер верный
                right=next((o for o in x['opts'] if o.endswith('верно')),'')
                n=right[:1];syl=right[1:].replace('верно','')
                vs=' · '.join(o.replace('верно','')[1:] for o in x['opts'])
                cells.append(f'<span class="zv q"><small>задание {len(cells)+1}</small><b>{e(syl)}</b><i>ответ: {e(n)}</i><small>{e(vs)}</small></span>')
            else:
                z=x['say'] or x['txt'];p=x['py'] or PY.get(z,'')
                if not p and x['txt'] and re.search('[a-zāáǎàēéěèīíǐìōóǒòūúǔùü]',x['txt']):p,z=x['txt'],x['say']
                cells.append(chip(z,p))
    rows.append(f'<div class="zvs"><h4>Слайд {s["i"]} · {e(s["t"])}</h4><div class="zvl">{"".join(cells)}</div></div>')
css='<style>.zvs{margin-top:10px;padding:12px 14px;border-radius:14px;background:#fff}.zvs h4{font-size:14px;color:var(--ink);margin-bottom:6px}.zvl{display:flex;flex-wrap:wrap;gap:6px}.zv{display:inline-flex;flex-direction:column;align-items:center;padding:6px 10px;border-radius:10px;background:#F4F6FB;min-width:54px}.zv .zh{font-family:"LXGW WenKai GB","Noto Sans SC","Microsoft YaHei",sans-serif;font-weight:400;font-size:20px;color:var(--ac2)}.zv i{font:800 14px Nunito;font-style:normal;color:var(--ac)}.zv small{font:700 11px Manrope;color:var(--mu)}.zv.q b{font:900 22px Nunito;color:var(--ac2)}.zv.q i{color:#14855E}</style>'
blk=('<!--ZVUK--><div class="box n">'+css+'<h2>🔊 Всё, что звучит в презентации — по слайдам</h2><div class="tip" style="margin-top:0">Если диктор звучит плохо — диктуйте сами по этому списку. В открытых самостоятельных: что прозвучит, какой номер верный и все варианты на экране.</div>'+''.join(rows)+'</div><!--/ZVUK-->')
s=open(uch,encoding='utf-8').read()
if '<!--ZVUK-->' in s: s=re.sub(r'<!--ZVUK-->.*?<!--/ZVUK-->',lambda m:blk,s,flags=re.S)
else:
    i=s.index('<div class="box n">',s.index('<div class="box n">')+1)  # после первого блока «что диктовать»
    s=s[:i]+blk+'\n '+s[i:]
open(uch,'w',encoding='utf-8').write(s);print('слайдов со звуком:',len(d))

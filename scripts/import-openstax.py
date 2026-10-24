"""Import distinct calculus-based textbook exercises for the user's local study app.
Caches original pages in sources/ (not in Git); retains source links and attribution.
"""
import concurrent.futures,subprocess,pathlib,json,re,hashlib
from bs4 import BeautifulSoup
ROOT=pathlib.Path(__file__).resolve().parents[1]
CACHE=ROOT/'sources/openstax';CACHE.mkdir(parents=True,exist_ok=True)
CHAPTERS={1:{3:1,4:1,5:2,6:2,7:3,8:3,9:4,10:5,11:6,12:5,13:2,15:7},2:{5:8,6:8,7:9,8:10,9:11,10:11,11:12,12:12,13:13,14:13}}
SECTIONS=['problems','additional-problems','challenge-problems','answers']
def url(v,ch,section):return f'https://openstax.org/books/university-physics-volume-{v}/pages/{"chapter-"+str(ch) if section=="answers" else str(ch)+"-"+section}'
def download(item):
 v,ch,section=item;path=CACHE/f'v{v}-{ch}-{section}.html'
 if not path.exists():
  p=subprocess.run(['curl','--fail','-L','-sS','--max-time','60',url(v,ch,section)],capture_output=True)
  if p.returncode:return item,None
  path.write_bytes(p.stdout)
 return item,path
items=[(v,ch,s) for v,chs in CHAPTERS.items() for ch in chs for s in SECTIONS]
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  results=list(ex.map(download,items))
 print('Downloaded',sum(p is not None for _,p in results),'of',len(items),'source pages')
 (CACHE/'download-results.json').write_text(json.dumps([{'v':v,'ch':ch,'section':s,'downloaded':p is not None} for (v,ch,s),p in results]))

# Only inert, readable HTML/MathML is retained. No scripts, event attributes,
# publisher UI, or embedded forms are copied into the local app.
ALLOWED=set('p div span em strong b i u sub sup br ul ol li table thead tbody tfoot tr td th caption figure figcaption img a math semantics mrow mi mn mo mtext mspace mfrac msup msub msubsup msqrt mroot munder mover munderover mtable mtr mtd mstyle mpadded mphantom menclose mfenced'.split())
MATH_ATTRS={'display','mathvariant','stretchy','fence','separator','form','accent','accentunder','columnalign','rowalign','columnspan','rowspan','notation','open','close','separators','linethickness','scriptlevel','width','height','depth'}
def clean_html(node,page_url):
 from urllib.parse import urljoin
 soup=BeautifulSoup(str(node),'html.parser')
 for x in soup.select('script,style,iframe,object,embed,form,input,annotation,annotation-xml'):x.decompose()
 for x in list(soup.find_all(True)):
  if x.name not in ALLOWED:x.unwrap();continue
  attrs={}
  if x.name=='img':
   src=urljoin(page_url,x.get('data-original-src') or x.get('src',''))
   if src.startswith('https://openstax.org/'):
    attrs={'src':src,'alt':x.get('alt','Physics diagram'),'loading':'lazy'}
   else:x.decompose();continue
  elif x.name=='a':
   href=urljoin(page_url,x.get('href',''))
   if href.startswith('https://openstax.org/'):
    attrs={'href':href,'target':'_blank','rel':'noopener'}
  else:
   for k,v in x.attrs.items():
    if k in MATH_ATTRS and re.fullmatch(r'[A-Za-z0-9 .,+_()|%\-]*',str(v)):attrs[k]=v
  x.attrs=attrs
 return str(soup)
def normalize(text):
 s=re.sub(r'\d+(?:\.\d+)?',' # ',text.lower());s=re.sub(r'[^a-z#]+',' ',s);return ' '.join(s.split())
def parse_candidates():
 from collections import Counter
 candidates=[];seen_ids=set();seen_norm=set();skips=Counter()
 for v,chapters in CHAPTERS.items():
  for ch,defaultunit in chapters.items():
   for category in SECTIONS[:3]:
    path=CACHE/f'v{v}-{ch}-{category}.html'
    if not path.exists():continue
    soup=BeautifulSoup(path.read_text(),'html.parser')
    for ex in soup.select('[data-type="exercise"]'):
     exid=ex.get('id');number=ex.select_one('.os-number');body=ex.select_one('.os-problem-container')
     if not exid or number is None or body is None:skips['missing markup']+=1;continue
     try:n=int(number.get_text(strip=True))
     except ValueError:continue
     for a in body.select('annotation,annotation-xml'):a.decompose()
     text=body.get_text(' ',strip=True);low=text.lower()
     head=ex.find_previous(['h2','h3','h4']);topic=head.get_text(' ',strip=True) if head else category.replace('-',' ').title()
     sec=re.match(r'\s*\d+\.(\d+)',topic);secnum=int(sec[1]) if sec else None
     # Keep the physics aligned with Mechanics/E&M; omit elasticity, fluids,
     # general relativity, driven/damped systems, and LC/RLC oscillations.
     if (v==1 and ch==12 and (secnum and secnum>2 or re.search(r'young|modulus|strain|shear|elasticity|bulk stress',low))) or (v==1 and ch==13 and (secnum and secnum>5 or re.search(r'black hole|schwarzschild|relativ|tidal',low))) or (v==1 and ch==15 and (secnum and secnum>4 or re.search(r'damp|driven|resonance',low))) or (v==2 and ch==14 and (secnum and secnum>4 or re.search(r'\blc\b|\brlc\b|oscillat|capacitor',low))):skips['outside course']+=1;continue
     if re.search(r'preceding problem|previous problem|preceding exercise|previous exercise|problem above',low):skips['dependent exercise']+=1;continue
     norm=normalize(text)
     if exid in seen_ids or norm in seen_norm:skips['duplicate/number-only variant']+=1;continue
     # Suppress near-duplicate wording after numeric differences have been removed.
     tokens=set(norm.split());near=False
     for prior in candidates:
      if prior['unit']!=defaultunit:continue
      old=prior['_tokens'];union=len(tokens|old)
      if union and len(tokens&old)/union>.92:near=True;break
     if near:skips['near duplicate']+=1;continue
     unit=defaultunit
     if v==1 and ch==13:
      if secnum==3 or 'potential energy' in low:unit=3
      if secnum in [4,5] or re.search(r'circular orbit|orbital period|kepler',low):unit=6
     if v==1 and ch==10 and secnum in [4,8]:unit=6 # rotational energy and work
     page_url=url(v,ch,category);source_url=page_url+'#'+exid
     if category=='challenge-problems':level=2
     elif category=='additional-problems':level=1
     else:
      complex_=bool(re.search(r'derive|differential|integrat|nonuniform|non-uniform|function of|prove|show that',low))
      parts=len(re.findall(r'\([a-f]\)',text))
      level=2 if complex_ and (parts>=3 or len(text)>600) else 1 if complex_ or parts>=2 or len(text)>350 else 0
     title=re.sub(r'^\d+\.\d+\s*','',topic)
     if category!='problems':title={1:{3:'Kinematics',4:'Motion in two dimensions',5:'Newton’s laws',6:'Forces and motion',7:'Work and energy',8:'Potential energy',9:'Momentum and collisions',10:'Rotation',11:'Angular momentum',12:'Static equilibrium',13:'Gravitation and orbits',15:'Oscillations'},2:{5:'Electric charge and fields',6:'Gauss’s law',7:'Electric potential',8:'Capacitance',9:'Current and resistance',10:'DC circuits',11:'Magnetic forces',12:'Sources of magnetic fields',13:'Electromagnetic induction',14:'Inductance'}}[v][ch]
     preview=' '.join(text.split());preview=preview if len(preview)<=190 else preview[:187].rsplit(' ',1)[0]+'…'
     q=dict(id=f'os-v{v}-{exid}',unit=unit,units=[unit],type='FRQ',level=level,imported=True,source='OpenStax',volume=v,chapter=ch,number=n,category=category,topic=title,prompt=preview,previewHTML=clean_html(body.find('p') or body,page_url),statementHTML=clean_html(body,page_url),url=source_url)
     anslink=number if number.name=='a' else number.find('a')
     if anslink is not None:
      fragment=anslink.get('data-page-fragment')
      if fragment:q['solutionUrl']=url(v,ch,'answers')+'#'+fragment;q['_answerFragment']=fragment
     q['_tokens']=tokens;q['_norm']=norm
     seen_norm.add(norm);seen_ids.add(exid);candidates.append(q)
 print('Eligible exercises:',len(candidates),'by unit:',dict(sorted(Counter(q['unit'] for q in candidates).items())),'skipped:',dict(skips))
 return candidates
if __name__=='__main__':
 candidates=parse_candidates()
 # Round-robin selection balances units, difficulty, and problem section.
 byunit={n:[] for n in range(1,14)}
 for q in candidates:byunit[q['unit']].append(q)
 for n,rows in byunit.items():
  buckets={d:[q for q in rows if q['level']==d] for d in range(3)};ordered=[]
  while any(buckets.values()):
   for d in [0,1,2]:
    if buckets[d]:ordered.append(buckets[d].pop(0))
  byunit[n]=ordered
 chosen=[]
 while any(byunit.values()):
  added=False
  for n in range(1,14):
   if byunit[n]:chosen.append(byunit[n].pop(0));added=True
  if not added:raise RuntimeError(f'Only {len(chosen)} distinct eligible exercises found')
 # Import available publisher answers, never inventing missing ones.
 answer_soups={}
 for q in chosen:
  fragment=q.pop('_answerFragment',None)
  if fragment:
   key=(q['volume'],q['chapter']);p=CACHE/f'v{key[0]}-{key[1]}-answers.html'
   if key not in answer_soups:answer_soups[key]=BeautifulSoup(p.read_text(),'html.parser') if p.exists() else None
   s=answer_soups[key]
   a=s.find(id=fragment) if s else None
   if a:
    container=a.select_one('.os-solution-container') or a
    q['solutionHTML']=clean_html(container,q['solutionUrl'])
  q.pop('_tokens');q.pop('_norm')
  q['attributionHTML']=f'OpenStax, <em>University Physics Volume {q["volume"]}</em>, Chapter {q["chapter"]}, Problem {q["number"]}. Authors: William Moebs, Samuel J. Ling, and Jeff Sanny. <a href="{q["url"]}" target="_blank" rel="noopener">Access for free at OpenStax</a>. Content © Rice University, licensed <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>. Formatting adapted for this noncommercial local study app.'
 assert len({q['id'] for q in chosen})==len(chosen)
 (ROOT/'dist/textbook.js').write_text('// Distinct OpenStax source exercises. Source URLs and CC BY-NC-SA attribution are retained per entry.\nconst textbookQuestions='+json.dumps(chosen,ensure_ascii=False,indent=2)+';\nbank.push(...textbookQuestions);\n')
 (CACHE/'selected-index.json').write_text(json.dumps([{k:v for k,v in q.items() if k not in ['statementHTML','solutionHTML','attributionHTML']} for q in chosen],ensure_ascii=False,indent=2))
 from collections import Counter
 print('Imported',len(chosen),'distinct exercises;',sum(bool(q.get('solutionHTML')) for q in chosen),'with published answers; by unit:',dict(sorted(Counter(q['unit'] for q in chosen).items())))

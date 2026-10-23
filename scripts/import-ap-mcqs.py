import json,pathlib,re,importlib.util
from bs4 import BeautifulSoup
ROOT=pathlib.Path(__file__).resolve().parents[1];CACHE=ROOT/'sources/mcq'
spec=importlib.util.spec_from_file_location('source_import',ROOT/'scripts/import-openstax.py');imp=importlib.util.module_from_spec(spec);spec.loader.exec_module(imp)
CH={2:1,3:1,4:2,5:2,6:2,7:3,8:4,9:5,10:5,16:7,18:8,19:9,20:11,21:11,22:12,23:13}
rows=[];seen=set();skip={}
# Do not repackage an already imported free-response exercise as an MCQ.
s=(ROOT/'dist/textbook.js').read_text();old=json.loads(s[s.index('['):s.rindex(']')+1]);oldnorm={imp.normalize(BeautifulSoup(q['statementHTML'],'html.parser').get_text(' ',strip=True)) for q in old}
for ch,defaultunit in CH.items():
 questions=BeautifulSoup((CACHE/f'ap-{ch}-questions.html').read_text(),'html.parser');answers=BeautifulSoup((CACHE/f'ap-{ch}-answers.html').read_text(),'html.parser')
 for e in questions.select('[data-type="exercise"]'):
  body=e.select_one('.os-problem-container');ol=body.find('ol',recursive=False) if body else None
  if not ol:continue
  opts=ol.find_all('li',recursive=False)
  if not 3<=len(opts)<=5:continue
  no=e.select_one('a.os-number');sol=answers.find(id=no.get('data-page-fragment')) if no else None
  if not sol:continue
  answer=sol.select_one('.os-solution-container') or sol;key=re.fullmatch(r'\(?([a-eA-E])\)?\.?',answer.get_text(' ',strip=True))
  if not key:continue
  index=ord(key[1].lower())-97
  if index>=len(opts):continue
  head=e.find_previous(['h2','h3','h4']);topic=head.get_text(' ',strip=True) if head else 'AP-prep MCQ';sec=re.match(r'\s*\d+\.(\d+)',topic);sn=int(sec[1]) if sec else 0
  # Algebra-based questions are useful foundations; omit topics outside Physics C.
  if ch==5 and (sn>2 or re.search('elasticity|modulus|strain',topic,re.I)):continue
  if ch==16 and (sn>3 or re.search('wave|resonan|damp',topic,re.I)):continue
  if ch==23 and re.search('alternating|reactance|rlc|resonan|transmission|safety',topic,re.I):continue
  unit=defaultunit
  if ch==6 and re.search('rotational|angle of rotation',topic,re.I):unit=5
  if ch==10 and sn in [4,5,6,7]:unit=6
  if ch==19 and re.search('capacitan|capacitor|dielectric',topic,re.I):unit=10
  if ch==22 and re.search('magnetic field|amp[eè]re|current loop',topic,re.I):unit=12
  n=int(no.get_text(strip=True));exid=e['id'];url=f'https://openstax.org/books/college-physics-ap-courses-2e/pages/{ch}-test-prep-for-ap-r-courses#{exid}'
  optionhtml=[imp.clean_html(li,url) for li in opts]
  optiontext=[li.get_text(' ',strip=True) for li in opts]
  b=BeautifulSoup(str(body),'html.parser');b.find('ol').decompose()
  for a in b.select('annotation,annotation-xml'):a.decompose()
  text=b.get_text(' ',strip=True);norm=imp.normalize(text)
  if norm in seen or norm in oldnorm:continue
  seen.add(norm)
  if re.search(r'preceding|previous question|previous problem',text,re.I):continue
  title=' '.join(text.split());title=title if len(title)<190 else title[:187].rsplit(' ',1)[0]+'…'
  q=dict(id='os-ap2e-m-'+exid,unit=unit,units=[unit],type='MCQ',level=0 if len(text)<250 else 1,imported=True,source='OpenStax',bookLabel='AP-prep 2e',basis='Algebra-based foundation',chapter=ch,number=n,topic=re.sub(r'^\d+\.\d+\s*','',topic),prompt=title,previewHTML=imp.clean_html(b.find('p') or b,url),statementHTML=imp.clean_html(b,url),options=optiontext,optionsHTML=optionhtml,answer=index,publishedKey=key[1].upper(),solutionHTML=imp.clean_html(answer,url),url=url,solutionUrl=f'https://openstax.org/books/college-physics-ap-courses-2e/pages/chapter-{ch}#{exid}-solution')
  q['attributionHTML']=f'OpenStax, <em>College Physics for AP® Courses 2e</em>, Chapter {ch}, Test Prep Question {n}. Algebra-based foundation practice; not an official AP Physics C question. <a href="{url}" target="_blank" rel="noopener">Access for free at OpenStax</a>. Answer verified against the <a href="{q["solutionUrl"]}" target="_blank" rel="noopener">published key</a>. © Rice University and contributing authors. <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>; adapted formatting for noncommercial study.'
  rows.append(q)
(ROOT/'dist/ap-mcqs.js').write_text('// Genuine source MCQs with verified public publisher answer keys, not converted FRQs.\nconst apMCQs='+json.dumps(rows,ensure_ascii=False,indent=2)+';\nbank.push(...apMCQs);\n')
(CACHE/'imported-ap-index.json').write_text(json.dumps([{k:v for k,v in q.items() if not k.endswith('HTML')} for q in rows],ensure_ascii=False,indent=2))
print('Imported',len(rows),'distinct AP-prep foundation MCQs with public, unambiguous answer keys.')

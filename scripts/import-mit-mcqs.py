import pathlib,json,subprocess,concurrent.futures,re,hashlib
from bs4 import BeautifulSoup
from urllib.parse import urljoin
ROOT=pathlib.Path(__file__).resolve().parents[1];CACHE=ROOT/'sources/mit-mcq';CACHE.mkdir(parents=True,exist_ok=True);OUT=ROOT/'dist/mit-assets';OUT.mkdir(exist_ok=True)
base='https://ocw.mit.edu'
index=CACHE/'class-slides.html'
if not index.exists():
 index.write_bytes(subprocess.check_output(['curl','--fail','-L','-sS',base+'/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/pages/class-slides/']))
soup=BeautifulSoup(index.read_text(),'html.parser')
# Only sessions covering the AP E&M course; skip vector-calculus review, LC/LRC,
# radiation, interference, and exam-review decks that repeat earlier questions.
SESSION={'w01d2':(8,'Charge, electric fields, and dipoles'),'w02d1':(9,'Potential and electric field'),'w02d2':(9,'Electric potential and equipotentials'),'w03d1':(8,'Gauss’s law'),'w03d2':(8,'Gauss’s law and symmetry'),'w04d2':(10,'Conductors and capacitors'),'w05d1':(11,'Current, resistance, and circuits'),'w06d1':(12,'Biot–Savart law'),'w06d2':(12,'Ampère’s law'),'w07d1':(12,'Magnetic forces on charges'),'w09d1':(13,'Inductors, magnetic energy, and RL circuits'),'w10d1':(11,'RC and RL transients'),'w10d2':(13,'RC and RL transients')}
items=[]
for a in soup.find_all('a',href=True):
 m=re.search(r'prs_(w\d+d\d+)_qonly',a['href'])
 if not m or m[1] not in SESSION:continue
 tr=a.find_parent('tr');links=tr.find_all('a',href=True);classlink=next((x['href'] for x in links if 'qonly' not in x['href']),None)
 if classlink:items.append((m[1],urljoin(base,a['href']),urljoin(base,classlink)))
def fetchresource(url,stem):
 html=CACHE/(stem+'.html')
 if not html.exists():html.write_bytes(subprocess.check_output(['curl','--fail','-L','-sS',url]))
 ss=BeautifulSoup(html.read_text(),'html.parser');urls=[urljoin(base,x['href']) for x in ss.find_all('a',href=True) if x['href'].lower().endswith('.pdf')]
 if not urls:raise ValueError('No PDF '+url)
 pdfurl=urls[0];p=OUT/(stem+'.pdf')
 if not p.exists():p.write_bytes(subprocess.check_output(['curl','--fail','-L','-sS',pdfurl]))
 txt=CACHE/(stem+'.txt');subprocess.run(['pdftotext','-layout',str(p),str(txt)],check=True,capture_output=True)
 return pdfurl,txt.read_text().split('\f')
def work(item):
 session,url,cls=item
 qurl,pages=fetchresource(url,session+'-questions');surl,solpages=fetchresource(cls,session+'-slides')
 return session,url,cls,qurl,surl,pages,solpages
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:results=list(ex.map(work,items))
 rows=[];seen=set()
 for session,url,cls,qurl,surl,pages,solpages in results:
  unit,topic=SESSION[session]
  for page,p in enumerate(pages,1):
   clean=re.sub(r'(?m)^\s*PRS\d+\s*$', '',p).strip()
   # A concept-question page must actually contain numbered response choices.
   if not re.search(r'\b1\s*[.)]',clean) or not re.search(r'\b2\s*[.)]',clean):continue
   stem=re.split(r'\b1\s*[.)]',clean)[0].strip();norm=re.sub(r'\d+(?:\.\d+)?','#',re.sub(r'\s+',' ',clean.lower()))
   if norm in seen:continue
   seen.add(norm)
   # Make a short descriptive index entry; retain all figures/formulae in the PDF.
   text=' '.join(stem.split());title=text if len(text)<180 else text[:177].rsplit(' ',1)[0]+'…'
   if len(title)<8:title=topic+' — concept question '+str(page)
   # Link to the first class-slide occurrence of the question, near its explanation.
   words=re.findall('[A-Za-z]{3,}',stem.lower())[:14];best=0;bestscore=0
   for j,sp in enumerate(solpages):
    score=sum(w in sp.lower() for w in words)
    if score>bestscore:bestscore=score;best=j
   rows.append(dict(id=f'mit-802-2007-{session}-p{page}',unit=unit,units=[unit],type='MCQ',level=1,external=True,source='MIT OpenCourseWare',sourceLabel='MIT 8.02 · Concept MCQ',label=f'{session.upper()} · Question {page}',prompt=title,page=page,url=f'mit-assets/{session}-questions.pdf',solutionUrl=f'mit-assets/{session}-slides.pdf#page={best+1}',originalUrl=qurl,sourcePage=url,solutionPage=cls,year=2007,number=page,attributionHTML=f'MIT OpenCourseWare, <em>8.02 Physics II: Electricity and Magnetism</em>, Spring 2007. <a href="{url}" target="_blank" rel="noopener">Original concept-question resource</a>. © Massachusetts Institute of Technology. <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA</a>. Class slides include the source discussion; answers are not auto-graded.'))
 assert rows
 (ROOT/'dist/mit-mcqs.js').write_text('// Distinct MIT 8.02 concept MCQs, linked to locally cached source PDFs and class discussions.\nconst mitMCQs='+json.dumps(rows,ensure_ascii=False,indent=2)+';\nbank.push(...mitMCQs);\n')
 (CACHE/'catalog.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
 print('Indexed',len(rows),'MIT concept MCQs from',len(results),'question sets, with matching class-slide resources.')

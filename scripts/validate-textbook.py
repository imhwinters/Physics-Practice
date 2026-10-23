from pathlib import Path
import json,re
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1];s=(ROOT/'dist/textbook.js').read_text();qs=json.loads(s[s.index('['):s.rindex(']')+1]);cache={};norms=set();imagecount=0
for q in qs:
 key=(q['volume'],q['chapter'],q['category'])
 if key not in cache:cache[key]=BeautifulSoup((ROOT/f'sources/openstax/v{key[0]}-{key[1]}-{key[2]}.html').read_text(),'html.parser')
 exid=q['url'].split('#')[1];ex=cache[key].find(id=exid);assert ex is not None,q['id']
 body=ex.select_one('.os-problem-container');actual=BeautifulSoup(q['statementHTML'],'html.parser')
 assert len(actual.find_all('img'))==len(body.find_all('img')),q['id']+' lost figure'
 assert len(actual.find_all('math'))==len(body.find_all('math')),q['id']+' lost math'
 for a in actual.select('annotation,annotation-xml,script,style,iframe,button'):raise AssertionError(q['id']+' unsafe tag '+a.name)
 text=actual.get_text(' ',strip=True).lower();norm=' '.join(re.sub(r'[^a-z#]+',' ',re.sub(r'\d+(?:\.\d+)?',' # ',text)).split());assert norm not in norms,q['id']+' numeric duplicate';norms.add(norm)
 for field in ['statementHTML','solutionHTML','previewHTML']:
  html=BeautifulSoup(q.get(field,''),'html.parser')
  for x in html.find_all(True):assert not any(a.lower().startswith('on') for a in x.attrs),q['id']
  for im in html.find_all('img'):
   assert im['src'].startswith('textbook-assets/'),im['src'];assert (ROOT/'dist'/im['src']).is_file(),im['src'];imagecount+=1
 assert 'CC BY-NC-SA 4.0' in q['attributionHTML']
print(f'Checked all {len(qs)} source anchors, unique normalized statements, math/diagram preservation, attribution, inert HTML, and {imagecount} local image references.')

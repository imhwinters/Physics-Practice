import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/'sources/mit-801/questions.json').read_text())
assert len(rows)==62
assert len({q['id'] for q in rows})==len(rows)
assert all(q['source']=='MIT OpenCourseWare' and q['type']=='FRQ' and q['external'] for q in rows)
assert all(1<=q['unit']<=7 and q['page']==q['number'] for q in rows)
assert all('MIT8_01F16_pset' in q['url'] and '#page=' not in q['url'] for q in rows)
assert all('CC BY-NC-SA 4.0' in q['attributionHTML'] for q in rows)
js=(ROOT/'dist/mit-801-frqs.js').read_text()
assert js.count('"source": "MIT OpenCourseWare"')==len(rows)
print(f'Checked all {len(rows)} MIT 8.01 problem links, PDF page anchors, unit mappings, and attribution.')

const fs=require('fs'),vm=require('vm'),assert=require('assert');
const files=['bank.js','extra.js','official.js','textbook.js','ap-mcqs.js','mit-mcqs.js'];
const ctx={};vm.createContext(ctx);vm.runInContext(files.map(f=>fs.readFileSync('dist/'+f,'utf8')).join('\n')+'\nthis.questions=bank;',ctx);const qs=ctx.questions;
assert.equal(qs.length,1698);assert.equal(new Set(qs.map(q=>q.id)).size,1698);
assert.equal(qs.filter(q=>q.type==='MCQ').length,346);
assert.equal(qs.filter(q=>q.external&&q.source==='College Board').length,96);
assert.equal(qs.filter(q=>q.imported&&q.type==='FRQ').length,1248);
assert.equal(qs.filter(q=>q.imported&&q.type==='MCQ').length,113);
assert.equal(qs.filter(q=>q.source==='MIT OpenCourseWare').length,85);
for(let n=1;n<=13;n++)for(let d=0;d<3;d++)for(const t of ['MCQ','FRQ'])assert.equal(qs.filter(q=>!q.external&&!q.imported&&q.unit===n&&q.level===d&&q.type===t).length,2);
for(const q of qs){
 assert(q.prompt&&q.unit>=1&&q.unit<=13);assert([0,1,2].includes(q.level));assert(!q.generated&&!q.variant);
 if(q.imported){
  assert(q.statementHTML.length>20);assert(q.attributionHTML.includes('CC BY-NC-SA'));assert(q.url.startsWith('https://openstax.org/'));assert(q.url.includes('#'));assert(!/onerror=|<script|<iframe|javascript:/i.test(q.statementHTML));
  if(q.type==='MCQ'){assert(q.options.length>=3&&q.options.length<=5);assert(q.options[q.answer]);assert.equal(q.answer,'ABCDE'.indexOf(q.publishedKey));assert.equal(q.optionsHTML.length,q.options.length);assert(q.solutionUrl&&q.solutionHTML)}
 }else if(q.external){
  assert(q.page>0);assert(q.solutionUrl);
  if(q.source==='MIT OpenCourseWare'){assert(fs.existsSync('dist/'+q.url));assert(fs.existsSync('dist/'+q.solutionUrl.split('#')[0]));assert(q.attributionHTML)}else assert(q.url.startsWith('https://'));
 }else if(q.type==='MCQ'){assert.equal(q.options.length,4);assert(q.options[q.answer]);assert.equal(new Set(q.options).size,4);assert(q.explanation)}else{assert.equal(q.parts.length,2);assert.equal(q.solutions.length,2)}
}
assert.equal(new Set(qs.filter(q=>q.imported).map(q=>q.url)).size,1361);
console.log('Validated 1,698 unique entries: 346 MCQs, 1,352 FRQs; preserved original IDs, complete unit coverage, valid keys and local MIT sources; no generated variants.');

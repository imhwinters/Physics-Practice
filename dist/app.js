const $=s=>document.querySelector(s),levels=['Easy','Medium','Hard'];
let course='mech',type='All',difficulty='All',unitFilters=[],sourceFilter='All',statusFilter='All',session=null;
const PAGE_SIZE=25,pages={},expandedUnits=new Set([1]);
let drafts={},completed={},storageWarning=false;
try{drafts=JSON.parse(localStorage.getItem('physics-c-drafts'))||{}}catch{}
try{completed=JSON.parse(localStorage.getItem('physics-c-completed-v1'))||{};if(typeof completed!=='object'||Array.isArray(completed))completed={}}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function saveDraft(){try{localStorage.setItem('physics-c-drafts',JSON.stringify(drafts))}catch{}}
function isCompleted(id){return !!completed[id]}
function setCompletion(id,on,extra={}){
 if(on)completed[id]={at:new Date().toISOString(),...extra};else delete completed[id];
 try{localStorage.setItem('physics-c-completed-v1',JSON.stringify(completed));storageWarning=false}catch{storageWarning=true}
 render();
}
function courseMatch(q){return course==='mech'?q.unit<=7:q.unit>=8}
function questionUnits(q){return [...new Set(q.units||[q.unit])].sort((a,b)=>a-b)}
function matchesUnit(q,n){return questionUnits(q).includes(n)}
function matchesUnitSelection(q){return !unitFilters.length||questionUnits(q).every(n=>unitFilters.includes(n))}
function unitFilterLabel(){if(!unitFilters.length)return 'All units';const names=unitFilters.map(n=>`Unit ${n}`);return names.length<=2?names.join(' + '):`${names.length} units selected`}
function multiUnitTag(q){const qs=questionUnits(q);return qs.length>1?`<span class="multi-unit-tag">Multiple units · ${qs.map(n=>`U${n}`).join(' + ')}</span>`:''}
function filtered(){return bank.filter(q=>courseMatch(q)&&(type==='All'||q.type===type)&&(difficulty==='All'||q.level===Number(difficulty))&&matchesUnitSelection(q)&&(sourceFilter==='All'||(sourceFilter==='official'?q.source==='College Board':sourceFilter==='mit'?q.source==='MIT OpenCourseWare':q.imported))&&(statusFilter==='All'||(statusFilter==='done'?isCompleted(q.id):!isCompleted(q.id))))}
function sorted(qs){return [...qs].sort((a,b)=>a.level-b.level||(a.type==='MCQ'?0:1)-(b.type==='MCQ'?0:1)||Number(!!(a.external||a.imported))-Number(!!(b.external||b.imported))||(b.year||0)-(a.year||0)||(a.chapter||0)-(b.chapter||0)||(a.number||0)-(b.number||0)||a.id.localeCompare(b.id))}
function difficultyHTML(q){return `<span class="difficulty level-${q.level}">${levels[q.level]}${q.external||q.imported?'*':''}</span>`}
function sourceHTML(q){return q.imported?`OpenStax · ${q.bookLabel||('Vol. '+q.volume)} · ${q.chapter}.${q.number} <span class="pdf">TEXTBOOK</span>`:q.external?`${q.sourceLabel||'College Board'} · ${q.label} <span class="pdf">PDF</span>`:''}
function groupQuestions(n){return sorted(filtered().filter(q=>matchesUnit(q,n)))}
function renderUnitQuestions(n){
 const qs=groupQuestions(n),max=Math.max(0,Math.ceil(qs.length/PAGE_SIZE)-1);pages[n]=Math.min(pages[n]||0,max);
 const page=pages[n],shown=qs.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
 return `<div class="questions">${shown.map(q=>`<div class="question-row ${isCompleted(q.id)?'is-complete':''}"><label class="completion-cell" title="${isCompleted(q.id)?'Completed — click to undo':'Mark complete'}"><input type="checkbox" data-complete="${q.id}" aria-label="Mark question complete" ${isCompleted(q.id)?'checked':''}></label><span class="kind">${q.type}</span>${difficultyHTML(q)}<div class="question-copy"><div class="question-title ${q.imported?'source-preview':''}">${q.imported?q.previewHTML:content(q,'prompt')}</div><div class="source">${sourceHTML(q)} ${multiUnitTag(q)}${isCompleted(q.id)?' · <span class="done-label">Completed</span>':''}</div></div><button class="text-button" data-question="${q.id}" data-group="${n}" aria-label="${q.external?'Open':'Practice'} ${esc(q.prompt)}">${q.external?'Open':'Practice'}<span>↗</span></button></div>`).join('')}</div>${qs.length>PAGE_SIZE?`<div class="pagination"><span>${page*PAGE_SIZE+1}–${Math.min((page+1)*PAGE_SIZE,qs.length)} of ${qs.length}</span><div><button class="secondary" data-page="${n}" data-step="-1" ${page===0?'disabled':''}>← Previous</button><button class="secondary" data-page="${n}" data-step="1" ${page===max?'disabled':''}>Next →</button></div></div>`:''}`;
}
function render(){
 const visible=filtered(),groups=units.map((u,i)=>({u,n:i+1})).filter(({n})=>(course==='mech'?n<=7:n>=8)&&(!unitFilters.length||unitFilters.includes(n))).filter(({n})=>visible.some(q=>matchesUnit(q,n)));
 const count=visible.length,done=visible.filter(q=>isCompleted(q.id)).length;
 $('#app').innerHTML=`<div class="course-tabs" role="group" aria-label="Course"><button data-course="mech" aria-pressed="${course==='mech'}" class="${course==='mech'?'active':''}">Mechanics</button><button data-course="em" aria-pressed="${course==='em'}" class="${course==='em'?'active':''}">Electricity & Magnetism</button></div><div class="filters"><div class="segmented" role="group" aria-label="Question type">${['All','MCQ','FRQ'].map(t=>`<button data-type="${t}" aria-pressed="${type===t}" class="${type===t?'active':''}">${t==='All'?'All':t+'s'}</button>`).join('')}</div><div class="filter unit-filter"><details class="unit-picker"><summary aria-label="Filter by unit">${unitFilterLabel()}</summary><div class="unit-menu"><label><input type="checkbox" data-unit-select="All" ${unitFilters.length===0?'checked':''}>All units</label>${units.map((u,i)=>({u,n:i+1})).filter(({n})=>course==='mech'?n<=7:n>=8).map(({u,n})=>`<label><input type="checkbox" data-unit-select="${n}" ${unitFilters.includes(n)?'checked':''}>Unit ${n}: ${u[0]}</label>`).join('')}</div></details></div><div class="filter"><select id="difficulty" aria-label="Difficulty"><option value="All">All difficulties</option>${levels.map((l,i)=>`<option value="${i}" ${difficulty===String(i)?'selected':''}>${l}</option>`).join('')}</select></div><div class="filter"><select id="source-filter" aria-label="Source"><option value="All">All sources</option><option value="official" ${sourceFilter==='official'?'selected':''}>College Board · PDF</option><option value="mit" ${sourceFilter==='mit'?'selected':''}>MIT · Concept MCQs</option><option value="textbook" ${sourceFilter==='textbook'?'selected':''}>OpenStax · Textbook</option></select></div><div class="filter"><select id="status-filter" aria-label="Completion"><option value="All">Any completion</option><option value="todo" ${statusFilter==='todo'?'selected':''}>Not completed</option><option value="done" ${statusFilter==='done'?'selected':''}>Completed</option></select></div></div><p class="bank-count">${count} questions <span aria-hidden="true">·</span> ${done} completed</p>${count?groups.map(({u,n})=>{
 const qs=visible.filter(q=>matchesUnit(q,n)),open=expandedUnits.has(n)||unitFilters.includes(n);
 return `<details class="unit-group" data-unit="${n}" ${open?'open':''}><summary><span class="unit-index">Unit ${n}</span><span class="unit-name">${u[0]}</span><span class="unit-count">${qs.filter(q=>isCompleted(q.id)).length}/${qs.length} completed</span></summary><div data-unit-body="${n}">${open?renderUnitQuestions(n):''}</div></details>`;
 }).join(''):'<div class="empty">No questions match these filters.</div>'}<p class="notice">*Source-question difficulty is estimated. Textbook FRQs are free-response exercises, not official AP-format exam questions. Completion is saved in this browser.${storageWarning?' <strong>Browser storage is unavailable; completion cannot persist after closing.</strong>':''}</p>`;
}
function current(){return session.qs[session.index]}
function start(id,n){const qs=groupQuestions(n),index=qs.findIndex(q=>q.id===id);if(index<0)return;session={qs,index,selected:null,revealed:false};$('#practice').showModal();exercise()}
function responseHTML(q,i,label){return `<div class="frq-part"><label for="response-${i}">${label}</label><textarea id="response-${i}" data-part="${i}" placeholder="Working / answer… (LaTeX: \\(x^2\\) or $$…$$)">${esc(drafts[q.id]?.[i]||'')}</textarea><div class="math-preview" data-preview="${i}" aria-label="Math preview">${notesPreview(drafts[q.id]?.[i]||'')}</div></div>`}
function optionHTML(q){return q.options.map((o,i)=>`<button class="option" data-option="${i}"><b>${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]}</b><span class="${q.imported?'source-statement':''}">${q.optionsHTML?q.optionsHTML[i]:content(q,'options',i)}</span></button>`).join('')}
function attribution(q){return `<p class="question-link">${q.attributionHTML||''}</p>`}
function exercise(){
 const q=current(),unitText=(q.units||[q.unit]).map(n=>`Unit ${n}`).join(', ');
 $('#exercise').innerHTML=`<div class="exercise-head"><span>${q.type} · ${session.index+1} / ${session.qs.length}</span><label class="exercise-complete"><input type="checkbox" data-complete="${q.id}" aria-label="Question completed" ${isCompleted(q.id)?'checked':''}>Completed</label><button class="icon-button" id="close" aria-label="Close practice">×</button></div><div class="exercise-body"><div class="question-meta"><span>${unitText}</span>${multiUnitTag(q)}${difficultyHTML(q)}<span>${q.imported?'OPENSTAX':q.source==='MIT OpenCourseWare'?(q.problemSet?'MIT 8.01':'MIT 8.02'):q.external?'COLLEGE BOARD':'SOURCE'}${q.basis?' · FOUNDATION':''}</span></div>${q.imported?`<h2 class="imported-title">${esc(q.topic)} · Problem ${q.chapter}.${q.number}</h2><div class="source-statement">${q.statementHTML}</div><p class="question-link"><a href="${q.url}" target="_blank" rel="noopener">View original exercise ↗</a></p>${q.type==='MCQ'?optionHTML(q):responseHTML(q,0,'Your response')}${attribution(q)}`:`<div class="question">${content(q,'prompt')}</div>${q.external?`<p class="muted">${q.label} · PDF page ${q.page}. The full question and diagrams are in the original document.</p><div class="external-links"><a class="primary" href="${q.url}#page=${q.page}" target="_blank" rel="noopener">Open question PDF ↗</a><a class="secondary" href="${q.solutionUrl}" target="_blank" rel="noopener">${q.source==='MIT OpenCourseWare'?'Class discussion':q.type==='MCQ'?'Answer key':'Scoring guide'} ↗</a></div>${responseHTML(q,0,'Notes / working')}${q.attributionHTML?attribution(q):''}`:q.type==='MCQ'?optionHTML(q):q.parts.map((p,i)=>responseHTML(q,i,`<b>(${'abcdefghijklmnopqrstuvwxyz'[i]})</b> ${content(q,'parts',i)}`)).join('')}`}<div id="feedback" aria-live="polite"></div><div class="actions"><button class="secondary" id="previous" ${session.index===0?'disabled':''}>← Previous</button><button class="primary" id="${q.external?'next':'check'}" ${!q.external&&q.type==='MCQ'?'disabled':''}>${q.external?'Next question →':q.type==='MCQ'?'Check answer':q.imported?'Show available answer':'Show solution & rubric'}</button></div></div>`;
 $('#practice').scrollTop=0;
}
function check(){
 const q=current();if(session.revealed||q.external||q.type==='MCQ'&&session.selected===null)return;session.revealed=true;
 const feedback=$('#feedback');
 if(q.imported&&q.type==='FRQ'){feedback.innerHTML=`<div class="feedback"><h3>${q.solutionHTML?'Published answer':'No published answer supplied'}</h3>${q.solutionHTML?`<div class="source-statement">${q.solutionHTML}</div>`:'<p>The source does not provide an answer for this exercise. Check your reasoning against the chapter material.</p>'}<p><a href="${q.solutionUrl||q.url}" target="_blank" rel="noopener">View source ${q.solutionUrl?'answers':'exercise'} ↗</a></p><p>Use the Completed checkbox when you finish your work.</p></div>`}
 else if(q.type==='MCQ'){
  const correct=session.selected===q.answer;
  document.querySelectorAll('.option').forEach((b,i)=>{b.disabled=true;b.classList.toggle('correct',i===q.answer);b.classList.toggle('wrong',i===session.selected&&!correct)});
  feedback.innerHTML=`<div class="feedback"><h3>${correct?'Correct':'Incorrect'} · Answer ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[q.answer]}</h3>${q.imported?`<p>Published answer key: ${q.publishedKey}.</p><div class="source-statement">${q.solutionHTML}</div><p><a href="${q.solutionUrl}" target="_blank" rel="noopener">View published key ↗</a></p>`:`<p>${content(q,'explanation')}</p>`}</div>`;
  setCompletion(q.id,true,{correct});document.querySelector('#practice [data-complete]').checked=true;
 }else{feedback.innerHTML=`<div class="feedback"><h3>Solution & self-scoring rubric</h3><p>Each part is worth 2 points. Check the criteria your answer meets. Mark Completed when you finish.</p>${q.solutions.map((s,i)=>`<p><b>(${'abcdefghijklmnopqrstuvwxyz'[i]})</b> ${content(q,'solutions',i)}</p><label class="rubric"><input type="checkbox" data-point="${i*2}">Correct principle or starting equation (1 pt)</label><label class="rubric"><input type="checkbox" data-point="${i*2+1}">Correct result, reasoning, and units (1 pt)</label>`).join('')}<b id="frq-score">0 / ${q.parts.length*2} points</b></div>`}
 const button=$('#check');button.textContent='Next question →';button.id='next';feedback.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function advance(delta){session.index+=delta;session.selected=null;session.revealed=false;if(session.index>=session.qs.length){$('#exercise').innerHTML=`<div class="exercise-head"><span>Complete</span><button class="icon-button" id="close" aria-label="Close practice">×</button></div><div class="completed"><h2>End of this set</h2><button class="primary" id="close-set">Back to questions</button></div>`;return}exercise()}
function resetPages(){Object.keys(pages).forEach(k=>delete pages[k])}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.course){course=b.dataset.course;unitFilters=[];expandedUnits.add(course==='mech'?1:8);resetPages();render();return}
 if(b.dataset.type){type=b.dataset.type;resetPages();render();return}
 if(b.dataset.page){const n=Number(b.dataset.page);pages[n]=(pages[n]||0)+Number(b.dataset.step);document.querySelector(`[data-unit-body="${n}"]`).innerHTML=renderUnitQuestions(n);document.querySelector(`[data-unit="${n}"]`).scrollIntoView({block:'start'});return}
 if(b.dataset.question){start(b.dataset.question,Number(b.dataset.group));return}
 if(b.id==='close'||b.id==='close-set'){$('#practice').close();render();return}
 if(b.id==='previous'){advance(-1);return}
 if(b.dataset.option!==undefined&&!session.revealed){session.selected=Number(b.dataset.option);document.querySelectorAll('.option').forEach((el,i)=>el.classList.toggle('selected',i===session.selected));$('#check').disabled=false;return}
 if(b.id==='check'){check();return}if(b.id==='next')advance(1);
});
document.addEventListener('change',e=>{
 if(e.target.dataset.complete){setCompletion(e.target.dataset.complete,e.target.checked);return}
 if(e.target.dataset.unitSelect!==undefined){const selected=e.target.dataset.unitSelect;if(selected==='All'){unitFilters=[]}else{const n=Number(selected);if(e.target.checked){unitFilters=[...new Set([...unitFilters,n])].sort((a,b)=>a-b)}else{unitFilters=unitFilters.filter(x=>x!==n)}}resetPages();render();return}
 const filters={'difficulty':v=>difficulty=v,'source-filter':v=>sourceFilter=v,'status-filter':v=>statusFilter=v};
 if(filters[e.target.id]){filters[e.target.id](e.target.value);resetPages();render()}
 if(e.target.dataset.point!==undefined)$('#frq-score').textContent=document.querySelectorAll('[data-point]:checked').length+' / '+(current().parts.length*2)+' points';
});
document.addEventListener('toggle',e=>{const n=Number(e.target.dataset?.unit);if(!n)return;if(e.target.open){expandedUnits.add(n);const body=e.target.querySelector('[data-unit-body]');if(!body.innerHTML)body.innerHTML=renderUnitQuestions(n)}else expandedUnits.delete(n)},true);
document.addEventListener('input',e=>{if(e.target.dataset.part!==undefined){const id=current().id;drafts[id]??={};drafts[id][e.target.dataset.part]=e.target.value;saveDraft();const preview=document.querySelector('[data-preview="'+e.target.dataset.part+'"]');if(preview)preview.innerHTML=notesPreview(e.target.value)}});
window.addEventListener('storage',e=>{if(e.key==='physics-c-completed-v1'){try{completed=JSON.parse(e.newValue)||{}}catch{completed={}}render()}});
render();

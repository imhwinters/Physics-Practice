const fs=require('fs'),vm=require('vm'),assert=require('assert'),katex=require('./dist/vendor/katex/katex.min.js');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={katex,esc};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/math-bank.js','utf8')+'\n'+fs.readFileSync('dist/math.js','utf8')+'\nthis.data=mathBank;this.format=mathHTML;this.preview=notesPreview;',ctx);
let count=0;
for(const [id,fields] of Object.entries(ctx.data))for(const [field,value] of Object.entries(fields))for(const s of Array.isArray(value)?value:[value]){
 for(const m of s.matchAll(/\\\(([\s\S]*?)\\\)/g)){katex.renderToString(m[1],{throwOnError:true,strict:'error',trust:false});count++}
 assert(!ctx.format(s).includes('class="math-error"'),id+' '+field);
}
for(const text of [String.raw`\(\frac{1}{2}mv^2\)`,String.raw`\[\int_0^T F(t)\,dt\]`,'$x_0^2$','$$E=mc^2$$'])assert(ctx.format(text).includes('class="katex"'));
assert(ctx.format(String.raw`\(\frac{\)`).includes('math-error'));
assert(ctx.format('<img src=x onerror=alert(1)>').includes('&lt;img'));
assert(!ctx.format(String.raw`\(\href{javascript:alert(1)}{click}\)`).includes('href="javascript:'));
assert.equal(ctx.preview('plain notes'),'');
assert(ctx.data['4-f-1'].solutions[0].includes(String.raw`\int_0^T \frac{F_{0}t}{T}\, dt`));
assert(!ctx.data['9-f-extra-1'].solutions[0].includes(String.raw`\sqrt{[}`));
assert(ctx.data['7-f-2'].solutions[0].includes(String.raw`I\ddot{\theta}`));
assert(ctx.data['8-f-extra-1'].solutions[1].includes(String.raw`\frac{2kQy}{|y|^{3}}`));
console.log(`Validated ${count} existing TeX expressions, all delimiter formats, invalid-input fallback, HTML escaping, and untrusted-TeX handling.`);

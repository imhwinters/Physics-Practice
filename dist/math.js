// KaTeX is bundled locally. All prose is escaped; TeX cannot enable trusted HTML.
function mathHTML(value,large=false){
 const text=String(value),pattern=/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(?<!\\)\$([^$\n]+?)\$/g;
 let result='',last=0;
 for(const match of text.matchAll(pattern)){
  result+=esc(text.slice(last,match.index));
  const display=match[1]!==undefined||match[2]!==undefined,tex=match[1]??match[2]??match[3]??match[4];
  try{
   result+=`<span class="${display?'math-display':'math-inline'}">${katex.renderToString((large?'\\displaystyle ':'')+tex,{displayMode:display,throwOnError:true,trust:false,strict:'error',output:'htmlAndMathml',maxExpand:1000,maxSize:20})}</span>`;
  }catch{
   result+=`<span class="math-error" title="Could not render this expression">${esc(match[0])}</span>`;
  }
  last=match.index+match[0].length;
 }
 return result+esc(text.slice(last));
}
function content(q,key,index){
 const field=q[key];
 return mathHTML(index===undefined?field:field[index],['options','solutions','explanation'].includes(key));
}
function notesPreview(value){
 return /\\\(|\\\[|\$/.test(value)?mathHTML(value):'';
}

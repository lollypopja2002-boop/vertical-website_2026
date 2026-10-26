/* 본문 영문을 정방향 세로 조판으로 통일합니다. */
(() => {
 const excluded='script,style,svg,textarea,input,select,option,pre,code,h1,.body-latin,.body-token,.body-phrase,.latin-upright,.toc-number';
 function wrap(root){
  if(root.nodeType===Node.ELEMENT_NODE && root.closest(excluded))return;
  const nodes=[];
  if(root.nodeType===Node.TEXT_NODE)nodes.push(root);
  else {
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   while(walker.nextNode())nodes.push(walker.currentNode);
  }
  nodes.forEach(node=>{
   if(!node.parentElement || node.parentElement.closest(excluded) )return;
   const pattern=/[가-힣]+(?: [가-힣]+)? (?:수 (?:있다|없다)|있다|없다|것이다|아니다|한다|하다|된다)(?:[。.!?]|$)|[A-Za-z][A-Za-z0-9_-]*[가-힣]*/g;
   const matches=[...node.data.matchAll(pattern)];
   if(!matches.length)return;
   const fragment=document.createDocumentFragment();
   let offset=0;
   matches.forEach(result=>{
    fragment.append(document.createTextNode(node.data.slice(offset,result.index)));
    const part=result[0];
    if(/^[A-Za-z]/.test(part)){
     const match=part.match(/^([A-Za-z][A-Za-z0-9_-]*)([가-힣]*)$/);
     const span=document.createElement('span');span.className='body-latin';span.textContent=match[1];
     if(match[2]){const token=document.createElement('span');token.className='body-token';token.append(span,document.createTextNode(match[2]));fragment.append(token);}
     else fragment.append(span);
    }else{const phrase=document.createElement('span');phrase.className='body-phrase';phrase.textContent=part;fragment.append(phrase);}
    offset=result.index+part.length;
   });
   fragment.append(document.createTextNode(node.data.slice(offset)));
   node.replaceWith(fragment);
  });
 }
 const roots=[...document.querySelectorAll('.page__content')];
 roots.forEach(root=>{
  wrap(root);
  const observer=new MutationObserver(records=>{
   observer.disconnect();
   records.forEach(record=>{
    if(record.type==='characterData')wrap(record.target);
    else record.addedNodes.forEach(node=>wrap(node));
   });
   observer.observe(root,{childList:true,subtree:true,characterData:true});
  });
  observer.observe(root,{childList:true,subtree:true,characterData:true});
 });
})();

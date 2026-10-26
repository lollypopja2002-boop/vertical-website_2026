(() => {
 const viewport=document.querySelector('.css-guide__viewport');
 document.querySelectorAll('.css-guide__toc a').forEach(link=>link.addEventListener('click',event=>{
  const target=document.getElementById(link.hash.slice(1));
  if(!target)return;
  event.preventDefault();
  const offset=target.getBoundingClientRect().right-viewport.getBoundingClientRect().right;
  viewport.scrollBy({left:offset,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  target.focus({preventScroll:true});
 }));
})();

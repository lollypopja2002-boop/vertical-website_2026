/* 왼쪽 정책 링크와 저작권 표기를 한 그룹으로 묶어 세로 중앙에 정렬합니다. */
(() => {
 const ns='http://www.w3.org/2000/svg';
 const ids=new Set(['about','jobs','partnership','terms','privacy','youth','policy','help']);
 function centerFooter(){
  const expanded=document.querySelector('.naver-frame-toggle').getAttribute('aria-expanded')==='true';
  const frame=document.querySelector(`[data-frame="${expanded?'expanded':'compact'}"]`);
  let group=frame.querySelector('.naver-footer-column');
  if(!group){
   const canvas=frame.getBoundingClientRect();
   const scale=canvas.width/1920;
   if(!scale)return;
   const parent=frame.children[0];
   const nodes=Array.from(parent.children).filter(node=>{
    if(!['path','use','rect'].includes(node.tagName))return false;
    const box=node.getBoundingClientRect();
    const x=(box.left-canvas.left)/scale;
    const y=(box.top-canvas.top)/scale;
    const right=(box.right-canvas.left)/scale;
    return x>=30&&right<=65&&y>=100;
   });
   if(!nodes.length)return;
   const boxes=nodes.map(node=>node.getBoundingClientRect());
   const top=(Math.min(...boxes.map(box=>box.top))-canvas.top)/scale;
   const bottom=(Math.max(...boxes.map(box=>box.bottom))-canvas.top)/scale;
   const shift=(1080-top-bottom)/2;
   group=document.createElementNS(ns,'g');
   group.classList.add('naver-footer-column');
   group.dataset.shift=shift;
   group.setAttribute('transform',`translate(0 ${shift})`);
   parent.append(group);nodes.forEach(node=>group.append(node));
  }
  document.querySelectorAll('.naver__links a[href*="detail.html?item="]').forEach(link=>{
   const id=new URL(link.getAttribute('href'),location.href).searchParams.get('item');
   if(ids.has(id))link.setAttribute('transform',`translate(0 ${group.dataset.shift})`);
  });
 }
 document.querySelector('.naver-frame-toggle').addEventListener('click',centerFooter);
 centerFooter();
})();

/* 로그인 글자와 서비스 글자, 로그인 버튼과 서비스 아이콘의 중심축을 맞춥니다. */
(() => {
 const ns='http://www.w3.org/2000/svg';
 function alignAuth(){
  const expanded=document.querySelector('.naver-frame-toggle').getAttribute('aria-expanded')==='true';
  const frame=document.querySelector(`[data-frame="${expanded?'expanded':'compact'}"]`);
  if(frame.dataset.authAligned)return;
  const canvas=frame.getBoundingClientRect();const scale=canvas.width/1920;if(!scale)return;
  const parent=frame.children[0];
  const regions=expanded?[{left:1610,right:1650,top:40,bottom:375,shift:19.18},{left:1650,right:1705,top:40,bottom:375,shift:14.51}]:[{left:1720,right:1760,top:60,bottom:405,shift:16},{left:1760,right:1820,top:60,bottom:405,shift:11.97}];
  regions.forEach(region=>{
   const selected=Array.from(parent.children).filter(node=>{
    if(!['path','rect','use'].includes(node.tagName))return false;
    const box=node.getBoundingClientRect();
    return (box.left-canvas.left)/scale>=region.left&&(box.right-canvas.left)/scale<=region.right&&(box.top-canvas.top)/scale>=region.top&&(box.bottom-canvas.top)/scale<=region.bottom;
   });
   const group=document.createElementNS(ns,'g');group.setAttribute('transform',`translate(${region.shift} 0)`);group.classList.add('naver-auth-aligned');parent.append(group);selected.forEach(node=>group.append(node));
  });
  frame.dataset.authAligned='true';
 }
 document.querySelector('.naver-frame-toggle').addEventListener('click',alignAuth);alignAuth();
})();

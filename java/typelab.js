(() => {
 const form=document.querySelector('#type-form');
 const text=document.querySelector('#lab-text');
 const length=document.querySelector('#lab-length');
 const gap=document.querySelector('#lab-gap');
 const font=document.querySelector('#lab-font');
 const preview=document.querySelector('#lab-preview');
 const compare=document.querySelector('#lab-compare');
 let horizontal=false;
 const families={kangsan:'"OnulKangsan", serif',serif:'"Eulyoo1945-Regular.woff", serif',sans:'system-ui, sans-serif'};
 function render(){
  preview.textContent=text.value.replaceAll(',', '、').replaceAll('.', '。');
  preview.style.fontFamily=families[font.value];
  preview.style.lineHeight=gap.value;
  preview.style.writingMode=horizontal?'horizontal-tb':'vertical-rl';
  preview.style.height=horizontal?'auto':`${length.value}em`;
  preview.style.width=horizontal?`${length.value}em`:'max-content';
  document.querySelector('#length-value').textContent=`${length.value}자`;
  document.querySelector('#gap-value').textContent=`${gap.value}배`;
  compare.textContent=horizontal?'세로쓰기로 돌아가기 ↕':'가로쓰기로 비교 ↔';
  compare.setAttribute('aria-pressed',String(horizontal));
 }
 form.addEventListener('input',render);
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('reset',()=>{horizontal=false;setTimeout(render,0);});
 compare.addEventListener('click',()=>{horizontal=!horizontal;render();});
 document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
  const type=button.dataset.mode==='type';
  document.querySelector('#type-panel').hidden=!type;
  document.querySelector('#unfold-panel').hidden=type;
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
 const range=document.querySelector('#unfold-range');
 range.addEventListener('input',()=>{
  const panel=document.querySelector('#unfold-window');
  panel.style.width=`${range.value}%`;
  document.querySelector('#unfold-value').textContent=`${range.value}%`;
  panel.scrollLeft=0;
 });
 render();
})();

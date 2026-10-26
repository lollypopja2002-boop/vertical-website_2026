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
 function numberOutput(selector,value,suffix){
  const digit=document.createElement('span');digit.className='body-digit';digit.textContent=value;
  document.querySelector(selector).replaceChildren(digit,document.createTextNode(suffix));
 }
 function render(){
  const value=text.value.replaceAll(',', '、').replaceAll('.', '。');
  preview.replaceChildren();
  value.split(/([0-9]+)/g).forEach((part,i)=>{
   if(i%2){const digit=document.createElement('span');digit.className='body-digit';digit.textContent=part;preview.append(digit);}
   else preview.append(document.createTextNode(part));
  });
  preview.style.fontFamily=families[font.value];
  preview.style.lineHeight=gap.value;
  preview.style.writingMode=horizontal?'horizontal-tb':'vertical-rl';
  preview.style.height=horizontal?'auto':`${length.value}em`;
  preview.style.width=horizontal?`${length.value}em`:'max-content';
  numberOutput('#length-value',length.value,'자');
  numberOutput('#gap-value',gap.value,'배');
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
 function unfold(){
  const panel=document.querySelector('#unfold-window');
  const progress=(Number(range.value)-Number(range.min))/(Number(range.max)-Number(range.min));
  panel.style.width=`${range.value}%`;
  numberOutput('#unfold-value',range.value,'%');
  panel.scrollLeft=-Math.max(0,panel.scrollWidth-panel.clientWidth)*progress;
 }
 range.addEventListener('input',unfold);
 document.querySelector('[data-mode="unfold"]').addEventListener('click',()=>requestAnimationFrame(unfold));
 window.addEventListener('resize',()=>{if(!document.querySelector('#unfold-panel').hidden)unfold();});
 render();
})();

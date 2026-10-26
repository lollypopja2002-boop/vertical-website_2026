/* 고정 작업판을 실제 화면 크기에 맞춰 비율 그대로 표시합니다. */
(() => {
 const page=document.querySelector('.page--07');
 const stage=page.querySelector('.page__content');
 const fitSpace=page.querySelector('.naver-fit-space');
 let narrowMode=false;
 let zoom=1;
 const fit=()=>{
  const bounds=page.getBoundingClientRect();
  const designWidth=stage.offsetWidth;
  const designHeight=stage.offsetHeight;
  const rootSize=parseFloat(getComputedStyle(document.documentElement).fontSize);
  const narrow=matchMedia('(max-width:60rem), (max-height:35rem)').matches;
  const viewportWidth=narrow?Math.max(bounds.width,75*rootSize):bounds.width;
  const scale=narrow?viewportWidth/designWidth:Math.min(bounds.width/designWidth,bounds.height/designHeight);
  const viewportHeight=Math.max(bounds.height,designHeight*scale);
  fitSpace.style.width=`${viewportWidth/rootSize}rem`;
  fitSpace.style.height=`${viewportHeight/rootSize}rem`;
  const offsetX=(viewportWidth-designWidth*scale)/2;
  const offsetY=(viewportHeight-designHeight*scale)/2;
  stage.style.setProperty('--naver-scale',String(scale));
  stage.style.setProperty('--naver-zoom',String(zoom));
  stage.style.setProperty('--naver-offset-x',`${offsetX/rootSize}rem`);
  stage.style.setProperty('--naver-offset-y',`${offsetY/rootSize}rem`);
  stage.style.setProperty('--naver-bar-top',`${-offsetY/scale/rootSize}rem`);
  stage.style.setProperty('--naver-bar-right',`${-offsetX/scale/rootSize}rem`);
  stage.style.setProperty('--naver-viewport-height',`${viewportHeight/scale/rootSize}rem`);
  if(narrow&&!narrowMode) page.scrollLeft=viewportWidth-bounds.width;
  narrowMode=narrow;
 };

 new ResizeObserver(fit).observe(page);fit();
 const bar=document.querySelector('.naver-browserbar');
 const panel=bar.querySelector('.browserbar-panel');
 const status=bar.querySelector('.browserbar-status');let timer;
 function inform(message){status.textContent=message;status.classList.add('is-visible');clearTimeout(timer);timer=setTimeout(()=>status.classList.remove('is-visible'),2400);}
 function togglePanel(){panel.hidden=!panel.hidden;}
 bar.addEventListener('click',async event=>{
  const button=event.target.closest('[data-browser-action]');if(!button)return;
  switch(button.dataset.browserAction){
   case 'contents':location.href='index.html';break;
   case 'compact':if(document.querySelector('.naver-frame-toggle').getAttribute('aria-expanded')==='true')document.querySelector('.naver-frame-toggle').click();else inform('현재 간편형입니다。');break;
   case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else if(page.requestFullscreen)await page.requestFullscreen();else inform('이 브라우저는 전체 화면을 지원하지 않습니다。');}catch{inform('전체 화면으로 전환할 수 없습니다。');}break;
   case 'panel':case 'menu':case 'tabs':togglePanel();break;
   case 'forward':history.forward();break;
   case 'back':if(history.length>1)history.back();else location.href='index.html';break;
   case 'reload':location.reload();break;
   case 'share':try{await navigator.clipboard.writeText(location.href);inform('현재 페이지 링크를 복사했습니다。');}catch{inform('주소창에서 현재 주소를 복사해 주세요。');}break;
   case 'new':window.open('07.html?screen=tools2','_blank','noopener');break;
   case 'zoom-in':zoom=Math.min(1.5,zoom+.1);fit();inform(`${Math.round(zoom*100)}% 확대`);break;
   case 'zoom-out':zoom=Math.max(.6,zoom-.1);fit();inform(`${Math.round(zoom*100)}% 축소`);break;
   case 'zoom-reset':zoom=1;fit();inform('1920 × 1080 비율로 맞췄습니다。');break;
  }
 });
 document.querySelector('#browserbar-address').addEventListener('submit',event=>{
  event.preventDefault();const value=document.querySelector('#browserbar-url').value.trim();if(!value)return;
  if(/^(https?:\/\/)?(www\.)?naver\.com\/?$/i.test(value)){location.href='07.html?screen=tools2';return;}
  // 외부 주소는 http(s)만 허용하고, 일반 단어는 기존 검색 화면에 전달합니다.
  if(/^https?:\/\//i.test(value)){location.href=new URL(value).href;return;}
  const local=['127.0.0.1','localhost'].includes(location.hostname);
  const url=local?new URL('http://127.0.0.1:8008/naver/search.html'):new URL('naver/search.html',location.href);
  url.searchParams.set('q',value);location.href=url.href;
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape')panel.hidden=true;});
})();

/* 첨부 디자인을 재현하는 로컬 예시 메일입니다. 외부로 메일을 보내지 않습니다. */
const messages = [
 ['X','X 인증 코드: 4h0nt2yJLlhff','10 / 18','23:17','SNS'],
 ['Adobe','Your payment has been declined — Update Now','10 / 17','09:00','청구·결제'],
 ['Kling','Kling 4.0 Now Available','10 / 17','04:45','프로모션'],
 ['OpenAI','새 보안키가 계정에 추가되었습니다','10 / 16','17:06','SNS'],
 ['ChatGPT','다시 ChatGPT를 쓰고 봐도','10 / 16','17:05','프로모션'],
 ['Google','lollypop.no2002@gmail.com 보안 알림','10 / 16','14:22','SNS'],
 ['넷플릭스','특별한 이용권이 도착했어요','10 / 16','09:24','프로모션'],
 ['Adobe Creative Cloud','Creative Cloud 진정한 가치를 경험하세요','10 / 16','09:27','프로모션']
].map(([sender,subject,date,time,category],id)=>({id,sender,subject,date,time,category,read:false,star:false,folder:'받은메일함'}));
const list=document.querySelector('#mail-list');
const preview=document.querySelector('#mail-preview');
const emptyPreview=preview.innerHTML;
const selected=new Set();
let folder='받은메일함', category='받는메일함', ascending=false;
const svg=name=>`<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
function element(tag,className,text){const node=document.createElement(tag);node.className=className;if(text!==undefined){if(className==='mail-sender'||className==='mail-subject'){for(const part of text.split(/([0-9])/)){if(/^[0-9]$/.test(part)){const digit=document.createElement('span');digit.className='mail-digit';digit.textContent=part;node.append(digit);}else node.append(document.createTextNode(part));}}else node.textContent=text;}return node;}
function visibleMessages(){const query=document.querySelector('#mail-search').value.trim().toLowerCase();return messages.filter(m=>(folder==='전체메일'||m.folder===folder)&&(category==='받는메일함'||m.category===category)&&`${m.sender} ${m.subject}`.toLowerCase().includes(query)).sort((a,b)=>ascending?b.id-a.id:a.id-b.id);}
function render(){
 list.replaceChildren();
 const rows=visibleMessages();
 rows.forEach(m=>{
  const row=element('article',`mail-row ${m.read?'is-read':''} ${selected.has(m.id)?'is-selected':''}`);
  const check=document.createElement('input');check.type='checkbox';check.checked=selected.has(m.id);check.setAttribute('aria-label',`${m.sender} 메일 선택`);check.addEventListener('change',()=>{check.checked?selected.add(m.id):selected.delete(m.id);render();});
  const star=element('button',`star ${m.star?'is-starred':''}`);star.innerHTML=svg('star');star.setAttribute('aria-label',`${m.sender} 중요 메일`);star.setAttribute('aria-pressed',m.star);star.addEventListener('click',()=>{m.star=!m.star;render();});
  const open=element('button','mail-open');open.setAttribute('aria-label',`${m.sender}: ${m.subject}`);open.append(element('span','mail-sender',m.sender),element('span','mail-subject',m.subject));
  const attachments=element('span','mail-attachments');attachments.innerHTML=svg('clip')+svg('link');open.append(attachments);open.addEventListener('click',()=>showMessage(m));
  const date=element('time','mail-date');m.date.split(' / ').forEach(s=>date.append(element('span','',s)));date.append(element('span','',m.time));
  row.append(check,star,element('span','unread-dot'),open,date);list.append(row);
 });
 if(!rows.length)list.append(element('p','mail-empty','표시할 메일이 없습니다。'));
 const selectAll=document.querySelector('#select-all');selectAll.checked=rows.length>0&&rows.every(m=>selected.has(m.id));selectAll.indeterminate=rows.some(m=>selected.has(m.id))&&!selectAll.checked;
}
function showMessage(m){
 m.read=true;render();preview.replaceChildren();preview.classList.add('has-selection');
 const content=element('article','preview-content');const header=element('header','');const close=element('button','', '← 목록');close.addEventListener('click',resetPreview);
 header.append(close,element('h1','',m.subject),element('p','',`${m.sender} · ${m.date} ${m.time}`));
 const body=element('div','preview-body');body.append(element('p','',`${m.sender}에서 온 메일입니다。`),element('p','',m.subject),element('p','','이 메일은 세로형 메일 화면을 확인하기 위한 예시입니다。 실제 메일 계정에 연결되어 있지 않습니다。'));
 content.append(header,body);preview.append(content);
}
function resetPreview(){preview.innerHTML=emptyPreview;preview.classList.remove('has-selection');}
let toastTimer;function toast(message){const node=document.querySelector('#mail-toast');node.textContent=message;node.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('is-visible'),2600);}
function setFolder(name){folder=name;category='받는메일함';selected.clear();document.querySelectorAll('[data-folder]').forEach(b=>b.classList.toggle('is-active',b.dataset.folder===name));document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('is-active',b.dataset.category===category));resetPreview();render();}
document.querySelector('#mail-search').addEventListener('input',()=>{resetPreview();render();});
document.querySelector('#select-all').addEventListener('change',e=>{visibleMessages().forEach(m=>e.target.checked?selected.add(m.id):selected.delete(m.id));render();});
document.querySelectorAll('[data-folder]').forEach(b=>b.addEventListener('click',()=>{if(['프로모션','청구·결제','SNS','카페'].includes(b.dataset.folder)){setFolder('받은메일함');category=b.dataset.folder;document.querySelectorAll('[data-category]').forEach(c=>c.classList.toggle('is-active',c.dataset.category===category));render();}else setFolder(b.dataset.folder);}));
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{setFolder('받은메일함');category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(c=>c.classList.toggle('is-active',c===b));render();}));
document.querySelector('[data-action=folder]').addEventListener('click',()=>setFolder('전체메일'));
['trash','archive','alert','mail'].forEach(action=>document.querySelector(`[data-action=${action}]`).addEventListener('click',()=>{if(!selected.size){toast('먼저 메일을 선택해 주세요。');return;}messages.filter(m=>selected.has(m.id)).forEach(m=>{if(action==='mail')m.read=true;else m.folder=action==='trash'?'휴지통':action==='alert'?'스팸메일함':'내 메일함';});selected.clear();resetPreview();render();toast(action==='mail'?'읽음으로 표시했습니다。':'선택한 메일을 이동했습니다。');}));
document.querySelector('#sort-button').addEventListener('click',e=>{ascending=!ascending;e.currentTarget.textContent=ascending?'오래된순⌄':'최신순⌄';render();});
document.querySelector('#more-button').addEventListener('click',()=>toast('체크박스로 선택한 후 삭제·보관·읽음 버튼을 사용하세요。'));
document.querySelector('.notification').addEventListener('click',()=>toast('새로운 알림이 없습니다。'));
document.querySelector('[aria-label="내 정보"]').addEventListener('click',()=>toast('세로형 네이버 메일 예시 화면입니다。'));
document.querySelector('.category-add').addEventListener('click',()=>{setFolder('전체메일');toast('모든 분류의 메일을 표시합니다。');});
document.querySelectorAll('[data-compose]').forEach(b=>b.addEventListener('click',()=>{const dialog=document.querySelector('#compose-dialog');dialog.querySelector('h2').textContent=b.dataset.compose;dialog.showModal();}));
document.querySelector('#compose-dialog').addEventListener('close',e=>{if(e.target.returnValue==='save'){const form=e.target.querySelector('form');messages.push({id:Date.now(),sender:'나',subject:form.elements.subject.value||'제목 없음',date:'10 / 19',time:'지금',category:'받는메일함',read:true,star:false,folder:'임시보관함'});form.reset();toast('임시보관함에 저장했습니다。');render();}});
/* 예시 데이터는 한 페이지 분량이므로 빈 페이지로 이동하지 않습니다. */
document.querySelectorAll('.mail-pagination button:not(.is-active):not(:disabled)').forEach(b=>b.addEventListener('click',()=>toast('현재 예시 메일은 1페이지에 모두 표시됩니다。')));
render();

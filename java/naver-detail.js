/* URL의 항목 ID로 로컬 예시 상세 내용을 표시합니다. */
(() => {
 const catalog=window.naverCatalog;
 const id=document.body.dataset.item||new URLSearchParams(location.search).get('item')||'services';
 const item=catalog[id]||catalog.services;
 document.title=`${item.title} — 세로형 네이버`;
 document.querySelector('#detail-title').textContent=item.title;
 document.querySelector('#detail-category').textContent=item.category;
 document.querySelector('#detail-body').textContent=item.body;
 const art=document.querySelector('#detail-art');
 if(item.art)art.innerHTML=item.art;else art.hidden=true;
 const related=document.querySelector('#detail-related');
 const hub=['서비스','네이버 서비스'].includes(item.category);
 let keys=Object.keys(catalog).filter(key=>key!==id&&(hub?catalog[key].art:catalog[key].category===item.category));
 if(!keys.length)keys=Object.keys(catalog).filter(key=>catalog[key].art);
 const limits=hub?12:5;
 keys.slice(0,limits).forEach(key=>{const a=document.createElement('a');a.href=`detail.html?item=${encodeURIComponent(key)}`;a.textContent=catalog[key].title;related.append(a);});
 if(id==='services'||id==='all-services'){
  Object.entries({mail:'메일',cafe:'카페',blog:'블로그',store:'스토어',news:'뉴스',stocks:'증권',home:'부동산',map:'지도',webtoon:'웹툰',chzzk:'치지직'}).forEach(([file,title])=>{const a=document.createElement('a');a.href=`${file}.html`;a.textContent=title;related.prepend(a);});
 }
 document.querySelector('#detail-back').addEventListener('click',()=>{if(history.length>1)history.back();else location.href='../07.html';});
})();

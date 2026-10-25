/* 화면의 링크 좌표는 1920×1080 프레임을 기준으로 함께 축소됩니다. */
(() => {
 const svg=document.querySelector('.naver__links');
 const ns='http://www.w3.org/2000/svg';
 const group=document.createElementNS(ns,'g');group.setAttribute('aria-label','콘텐츠와 추가 메뉴');svg.append(group);
 const expandedGroup=document.createElementNS(ns,'g');group.append(expandedGroup);
 function link(parent,id,x,y,width,height){
  const item=window.naverCatalog[id];if(!item)return;
  const a=document.createElementNS(ns,'a');a.setAttribute('href',`naver/detail.html?item=${encodeURIComponent(id)}`);a.setAttribute('aria-label',item.title);
  const title=document.createElementNS(ns,'title');title.textContent=item.title;
  const rect=document.createElementNS(ns,'rect');Object.entries({x,y,width,height,rx:3}).forEach(([key,value])=>rect.setAttribute(key,value));a.append(title,rect);parent.append(a);
 }
 // 두 모드에서 같은 자리에 있는 왼쪽 도구막대입니다.
 [['services',82],['notifications',133],['pay',184],['shopping-bag',235]].forEach(([id,y])=>link(group,id,240,y,55,49));
 const footer=[['about',35,120,25,75],['jobs',35,200,25,75],['partnership',35,280,25,70],['terms',35,360,25,70],['privacy',35,440,25,125],['youth',35,580,25,110],['policy',35,705,25,80],['help',35,805,25,70],['developers',93,44,28,130],['partners',131,44,28,108],['notice',186,44,28,80],['developer-center',93,182,28,125],['impact',131,182,28,95],['open-api',93,329,28,80],['business',131,328,28,140],['open-source',93,492,28,70],['ads',131,492,28,110],['d2sf',93,636,28,110],['new-store',131,636,28,80],['labs',93,765,28,80],['local-business',131,765,28,95],['expert',131,900,28,94],['all-services',186,904,30,130]];
 footer.forEach(([id,x,y,w,h])=>link(group,id,x,y,w,h));
 // 확장형에서만 보이는 카드와 분류 메뉴입니다.
 link(expandedGroup,'weather',375,60,152,220);
 ['coffee','beauty-purple','breakfast','shirt','dress'].forEach((id,i)=>link(expandedGroup,id,620,77+i*126.3,151,123));
 ['bracelet','daily-dress','beauty-pink','blue-shirt','linen-dress'].forEach((id,i)=>link(expandedGroup,id,778,77+i*126.3,160,123));
 ['shopping','men','brand','deals','my-shopping','shopping-live'].forEach((id,i)=>link(expandedGroup,id,947,78+i*96,42,92));
 [['console',100,115],['controller',216,115],['game',338,176],['creator',515,180]].forEach(([id,y,h])=>link(expandedGroup,id,1075,y,183,h));
 ['newsstand','entertainment','sports','games','economy','today'].forEach((id,i)=>link(expandedGroup,id,1290,77+i*98,40,94));
 link(expandedGroup,'game-lounge',1257,80,30,615);
 ['food-0','food-1','food-2','food-3','food-4'].forEach((id,i)=>link(expandedGroup,id,638+i*136,750,132,230));
 ['recipe','living','webtoon','feed'].forEach((id,i)=>link(expandedGroup,id,1313,750+i*55,40,53));
 link(expandedGroup,'headphones',1390.72,51.16,155.08,983.78);
 link(expandedGroup,'games',1010,188,48,75);link(expandedGroup,'games',1010,474,48,90);
 const update=()=>{const expanded=document.querySelector('.naver-frame-toggle').getAttribute('aria-expanded')==='true';expandedGroup.style.display=expanded?'':'none';};
 document.querySelector('.naver-frame-toggle').addEventListener('click',update);update();
})();

/* 화면만 전환하므로 입력한 검색어와 기존 링크 기능은 유지됩니다. */
const frameToggle=document.querySelector('.naver-frame-toggle');
const frameImage=document.querySelector('#naver-frame');
const layer=document.querySelector('.naver__expanded');
let expanded=true;
function position(node,values){Object.entries(values).forEach(([key,value])=>node.setAttribute(key,value));}
function applyFrame(){
 frameImage.querySelectorAll('[data-frame]').forEach(art=>art.toggleAttribute('hidden', art.dataset.frame !== (expanded?'expanded':'compact')));
 document.querySelector('.naver-ad-art').style.display=expanded?'':'none';
 frameImage.setAttribute('aria-label',expanded?'세로형 네이버 확장형 화면':'세로형 네이버 간편형 화면');
 const label=expanded?'간편형으로 전환':'확장형으로 전환';
 frameToggle.setAttribute('aria-label',label);frameToggle.title=`현재 ${expanded?'확장형':'간편형'} · ${label}`;frameToggle.setAttribute('aria-expanded',String(expanded));
 position(layer.querySelector('.naver-logo'),expanded?{x:1738,y:39,width:77,height:282}:{x:925,y:65,width:75,height:280});
 position(layer.querySelector('.logo-mask'),expanded?{x:1734,y:40,width:87,height:285}:{x:918,y:60,width:90,height:295});
 position(layer.querySelector('foreignObject'),expanded?{x:1741,y:334,width:65,height:714}:{x:930,y:379,width:60,height:652});
 const links=layer.querySelectorAll('a');
 const coords=expanded?[[1738,47,77,270],[1666.51,52,48,316],[1629.18,50,35,85],[1629.18,140,35,110],[1629.18,252,35,90]]:[[925,65,75,280],[1778.97,77,45,321],[1741,80,35,90],[1741,175,35,120],[1741,300,35,95]];
 links.forEach((link,i)=>{const c=i<5?coords[i]:expanded?[1615,414+(i-5)*56.1,108,52]:[1724,443+(i-5)*56.1,108,52];position(link.querySelector('rect'),{x:c[0],y:c[1],width:c[2],height:c[3]});});
 layer.querySelectorAll('.service-mask').forEach((mask,i)=>position(mask,{x:expanded?1651:1762,y:(expanded?413:442)+i*56.1,width:75}));
 layer.querySelectorAll(':scope > use').forEach((icon,i)=>position(icon,{x:expanded?1665:1776,y:(expanded?414:443)+i*56.1}));
}
frameToggle.addEventListener('click',()=>{expanded=!expanded;applyFrame();});
applyFrame();

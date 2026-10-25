/* 작품용 로그인 상태: 표시할 아이디만 보관하며 비밀번호는 저장하지 않습니다. */
(() => {
 const user=sessionStorage.getItem('naver-demo-user');
 if(!user)return;
 const svg=document.querySelector('.naver__links');
 const panel=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
 panel.classList.add('naver-account-layer');
 panel.innerHTML=`<section xmlns="http://www.w3.org/1999/xhtml" class="naver-account" aria-label="로그인 완료"><div class="account-avatar"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#eee" stroke="#ddd"/><circle cx="32" cy="24" r="12" fill="white"/><path d="M10 55c0-25 44-25 44 0" fill="white"/></svg><a href="naver/detail.html?item=help" aria-label="프로필 설정">⚙</a></div><div class="account-columns"><button class="account-logout" type="button">로그아웃 <span aria-hidden="true">⇥</span></button><div class="account-identity"><span class="account-id-label">네이버 ID <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10h14v12H5z M8 10V6a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="2"/></svg></span><strong class="account-name"></strong></div><div class="account-extras"><a href="naver/detail.html?item=pay"><b>N</b><b>＋</b>멤버십</a><a href="naver/mail.html">쪽지 <em>0</em></a><a href="naver/detail.html?item=help">해피빈</a></div></div></section>`;
 panel.querySelector('.account-name').textContent=user;
 panel.querySelector('.account-logout').addEventListener('click',()=>{sessionStorage.removeItem('naver-demo-user');location.reload();});
 const mask=document.createElementNS('http://www.w3.org/2000/svg','rect');
 mask.setAttribute('fill','white');
 svg.append(mask,panel);
 function position(){
  const expanded=document.querySelector('.naver-frame-toggle').getAttribute('aria-expanded')==='true';
  const values=expanded?{x:1608,y:40,width:120,height:345}:{x:1725,y:65,width:115,height:345};
  const cover=expanded?{x:1608,y:40,width:120,height:345}:{x:1725,y:65,width:115,height:345};
  Object.entries(cover).forEach(([key,value])=>mask.setAttribute(key,value));
  Object.entries(values).forEach(([key,value])=>panel.setAttribute(key,value));
 }
 document.querySelector('.naver-frame-toggle').addEventListener('click',position);
 position();
})();

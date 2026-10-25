/* 로그인 UI 예시입니다. 아이디와 비밀번호를 전송하거나 저장하지 않습니다. */
(() => {
 const page=document.querySelector('.page--naver-login');
 const layout=document.querySelector('.login-layout');
 const fit=()=>{
  const inset=parseFloat(getComputedStyle(page).paddingLeft)*2;
  const scale=Math.min(1,(page.clientWidth-inset)/layout.offsetWidth,(page.clientHeight-inset)/layout.offsetHeight);
  layout.style.setProperty('--login-fit',Math.max(.1,scale));
 };
 new ResizeObserver(fit).observe(page);
 new ResizeObserver(fit).observe(layout);
 document.fonts.ready.then(fit);
 fit();
 const form=document.querySelector('#login-form');
 const id=document.querySelector('#login-id');
 const password=document.querySelector('#login-password');
 const feedback=document.querySelector('#login-feedback');
 const dialog=document.querySelector('#login-dialog');
 const title=document.querySelector('#login-dialog-title');
 const description=document.querySelector('#login-dialog-description');
 const otp=document.querySelector('#otp-form');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!id.value.trim()){id.setCustomValidity('아이디 또는 전화번호를 입력해 주세요。');id.reportValidity();return;}
  id.setCustomValidity('');
  if(!password.value){password.reportValidity();return;}
  sessionStorage.setItem('naver-demo-user',id.value.trim());
  password.value='';
  location.href='../08.html';
 });
 id.addEventListener('input',()=>{id.setCustomValidity('');feedback.textContent='';});
 password.addEventListener('input',()=>{feedback.textContent='';});
 const visibility=document.querySelector('.password-visibility');
 visibility.addEventListener('click',()=>{
  const show=password.type==='password';password.type=show?'text':'password';
  visibility.setAttribute('aria-label',show?'비밀번호 숨기기':'비밀번호 표시');
  visibility.setAttribute('aria-pressed',String(show));
 });
 const options={
  passkey:['패스키 로그인','이 작품 화면에는 실제 계정 인증 서버가 연결되어 있지 않아 패스키 인증을 사용할 수 없습니다。'],
  qr:['QR코드 로그인','QR코드 인증은 아직 연결되지 않았습니다。 아이디 입력 화면으로 돌아가거나 네이버 홈으로 이동할 수 있습니다。'],
  otp:['일회용 번호 로그인','8자리 일회용 번호 입력 화면입니다。 실제 네이버 인증은 연결되어 있지 않습니다。']
 };
 document.querySelectorAll('[data-login-dialog]').forEach(button=>button.addEventListener('click',()=>{
  const mode=button.dataset.loginDialog;[title.textContent,description.textContent]=options[mode];otp.hidden=mode!=='otp';dialog.showModal();
 }));
 document.querySelector('#login-dialog-close').addEventListener('click',()=>dialog.close());
 otp.addEventListener('submit',event=>{event.preventDefault();description.textContent='입력 화면을 확인했습니다。 실제 번호 검증은 연결되어 있지 않습니다。';otp.reset();});
 document.querySelector('.login-language select').addEventListener('change',event=>{
  const language=event.target.value;
  event.target.style.setProperty('--login-language-height',`${event.target.selectedOptions[0].textContent.length+.5}em`);
  const labels={ko:['아이디 또는 전화번호','비밀번호','패스키','로그인','로그인','상태유지','IP','보안'],en:['ID or phone number','Password','Passkey','Sign in','Stay','signed in','IP','security'],ja:['IDまたは電話番号','パスワード','パスキー','ログイン','ログイン','状態を維持','IP','セキュリティ']}[language];
  document.documentElement.lang=language;id.placeholder=labels[0];password.placeholder=labels[1];
  document.querySelector('.login-passkey>span').textContent=labels[2];document.querySelector('.login-submit>span').textContent=labels[3];
  document.querySelector('.login-remember>span:last-child').replaceChildren(document.createTextNode(labels[4]),document.createElement('br'),document.createTextNode(labels[5]));
  document.querySelector('.login-ip>span:first-child').replaceChildren(document.createTextNode(labels[6]),document.createElement('br'),document.createTextNode(labels[7]));
 });
})();

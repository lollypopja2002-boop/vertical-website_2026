(() => {
 const entries=[
 ['읽기의 시작','눈의 움직임 도판 01\n세로쓰기·읽기 순서','시선은 오른쪽 위의 첫 글자에서 출발한다。 한 줄을 위에서 아래로 읽고、 왼쪽에 놓인 다음 줄의 맨 위로 옮겨 간다。 글자가 놓이는 방향과 줄이 이어지는 순서를 함께 살펴보는 도판이다。','img/eye_follow_1.svg','04.html'],
 ['시선의 이동','눈의 움직임 도판 02\n문자 인식·짧은 시선 이동','글자는 위에서 아래로 이어지지만、 눈은 일정한 속도로 움직이지만은 않는다。 짧은 이동과 멈춤을 반복하며 글자를 인식하는 과정을 세로줄과 점으로 나타냈다。','img/eye_follow_2.svg','04.html'],
 ['되돌아보기','눈의 움직임 도판 03\n문장·재확인','읽는 눈은 언제나 앞으로만 가지 않는다。 앞서 읽은 문장을 다시 확인하는 움직임을 아래로 향하는 화살표와 되돌아오는 곡선으로 함께 보여 준다。','img/eye_follow_3.svg','04.html'],
 ['다음 글줄','눈의 움직임 도판 04\n글줄·이동 경로','한 줄을 읽은 뒤、 시선은 왼쪽 다음 줄의 위로 이동한다。 줄의 끝에서 다음 시작점으로 이어지는 경로를 따라 세로쓰기의 읽기 구조를 살펴본다。','img/eye_follow_4.svg','04.html'],
 ['버티컬 네이버','화면에서 쓰기\n웹·인터페이스','익숙한 웹 화면을 세로쓰기의 방향으로 다시 구성했다。 검색과 메뉴、 콘텐츠의 배치를 통해 읽는 방향이 화면을 탐색하는 순서에 어떤 변화를 만드는지 살펴본다。','img/vertical-naver.svg','08.html']
 ];
 const buttons=[...document.querySelectorAll('[data-entry]')];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const i=Number(button.dataset.entry),entry=entries[i];
  document.querySelector('#archive-title').textContent=entry[0];
  document.querySelector('#archive-meta').textContent=entry[1];
  document.querySelector('#archive-description').textContent=entry[2];
  const image=document.querySelector('#archive-image');image.src=entry[3];image.alt=entry[0]+' 자료';
  document.querySelector('#archive-link').href=entry[4];
  document.querySelector('#archive-caption').textContent=`0${i+1} / 05`;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
})();

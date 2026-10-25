// 새 탭에서 처음 접속하면 소개부터 시작합니다.
// 같은 탭에서 인트로를 완료한 기록이 없으면 첫 인트로로 보냅니다.
if (sessionStorage.getItem("introCompleted") !== "true") {
  // 현재 기록을 인트로로 교체하여 뒤로 가기 시 반복 이동을 방지합니다.
  window.location.replace("intro.html");
}

// 인트로에서 넘어온 경우에만 목차 등장 효과를 켭니다.
if (sessionStorage.getItem("fadeInContents") === "true") {
  // html 요소에 페이드인 CSS를 실행할 클래스를 붙입니다.
  document.documentElement.classList.add("contents-enter");
  // 효과 예약을 지워 새로고침 때 다시 실행되지 않게 합니다.
  sessionStorage.removeItem("fadeInContents");
}

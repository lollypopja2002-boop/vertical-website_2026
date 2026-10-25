// 클릭을 받을 인트로 그래픽 요소를 찾습니다.
const introGraphic = document.querySelector(".intro__graphic");

// 두 번째 인트로 페이지로 이동하는 함수입니다.
function openIntroTwo() {
  // 클릭하면 전환 효과 없이 바로 두 번째 인트로로 이동합니다.
  window.location.href = "intro.2.html";
}

// 그래픽을 클릭하면 이동 함수를 실행합니다.
introGraphic.addEventListener("click", openIntroTwo);
// 키보드로 그래픽을 조작할 수 있도록 키 입력을 받습니다.
introGraphic.addEventListener("keydown", (event) => {
  // Enter 또는 스페이스 키를 눌렀는지 확인합니다.
  if (event.key === "Enter" || event.key === " ") {
    // 스페이스 키의 기본 동작인 화면 스크롤을 막습니다.
    event.preventDefault();
    // 두 번째 인트로로 이동합니다.
    openIntroTwo();
  }
});

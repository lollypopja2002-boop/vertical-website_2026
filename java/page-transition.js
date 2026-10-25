// 중복 클릭에 의한 이동을 방지하고 현재 애니메이션을 보관합니다.
let pageIsLeaving = false;
let pageExitAnimation;

// 화면 전체가 사라진 뒤 다음 페이지로 이동합니다. 기본 전환은 0.6초입니다.
async function fadeToPage(url, replaceHistory = false, duration = 600) {
  if (pageIsLeaving) return;
  pageIsLeaving = true;
  // 동작 줄이기 설정을 사용하면 애니메이션 없이 이동합니다.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  pageExitAnimation = document.body.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: reduceMotion ? 0 : duration, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "forwards" }
  );
  // 화면이 완전히 사라질 때까지 기다립니다.
  await pageExitAnimation.finished;
  if (replaceHistory) {
    // 대기 페이지를 방문 기록에서 목차로 교체합니다.
    window.location.replace(url);
  } else {
    window.location.href = url;
  }
}

// 뒤로 가기로 돌아온 화면이 투명하게 남지 않도록 복원합니다.
window.addEventListener("pageshow", () => {
  if (pageExitAnimation) pageExitAnimation.cancel();
  pageIsLeaving = false;
});

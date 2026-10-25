const introTwoPage = document.querySelector(".page--intro-two");
const introTwoImage = document.querySelector(".intro-two__graphic");
const reduceIntroMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function finishIntroTwo() {
  sessionStorage.setItem("introCompleted", "true");
  sessionStorage.setItem("fadeInContents", "true");
  fadeToPage("index.html", true, 1000);
}

async function typeIntroTwo() {
  try {
    const response = await fetch(introTwoImage.getAttribute("src"));
    if (!response.ok) throw new Error("인트로 SVG를 불러오지 못했습니다.");

    const markup = await response.text();
    const svg = new DOMParser().parseFromString(markup, "image/svg+xml").documentElement;
    if (svg.localName !== "svg") throw new Error("인트로 SVG 형식이 올바르지 않습니다.");

    svg.classList.add("intro-two__graphic");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", introTwoImage.alt);
    const paths = [...svg.querySelectorAll("path")];

    // 오른쪽 위 글자부터 아래로、 다음 열은 왼쪽으로 이동하며 찍는다.
    const typingOrder = paths.map((_, index) => index);
    if (paths.length !== typingOrder.length) throw new Error("인트로 글자 수가 변경되었습니다.");

    paths.forEach(path => { path.style.visibility = "hidden"; });
    introTwoImage.replaceWith(svg);
    introTwoPage.classList.remove("is-typing");

    if (reduceIntroMotion) {
      paths.forEach(path => { path.style.visibility = "visible"; });
      window.setTimeout(finishIntroTwo, 800);
      return;
    }

    const letterDelay = 200;
    typingOrder.forEach((index, position) => {
      window.setTimeout(() => {
        paths[index].style.visibility = "visible";
      }, position * letterDelay);
    });
    window.setTimeout(finishIntroTwo, typingOrder.length * letterDelay + 650);
  } catch (error) {
    // SVG를 직접 읽을 수 없는 환경에서는 기존 이미지를 보여 주고 다음 화면으로 이동한다.
    introTwoPage.classList.remove("is-typing");
    window.setTimeout(finishIntroTwo, 800);
  }
}

typeIntroTwo();

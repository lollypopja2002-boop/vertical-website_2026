// 검색창의 아이콘이나 빈 영역을 눌러도 입력 커서가 나타납니다.
const searchBox = document.querySelector(".naver-search");
const searchInput = document.querySelector(".naver-search__input");
searchBox.addEventListener("click", () => searchInput.focus());
// 안내 문구의 표시·숨김은 textarea의 기본 placeholder 기능으로 처리합니다.

// 한글 조합 중 Enter는 검색으로 처리하지 않습니다.
let searchIsComposing = false;
searchInput.addEventListener("compositionstart", () => { searchIsComposing = true; });
searchInput.addEventListener("compositionend", () => { searchIsComposing = false; });
searchInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing || searchIsComposing || event.keyCode === 229) return;
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  // 특수문자가 포함된 검색어도 안전하게 전달합니다.
  // 이미지 파일 저장에 따른 Live Server 새로고침을 피합니다.
  const localHost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const resultsUrl = localHost
    ? new URL("http://127.0.0.1:8008/naver/search.html")
    : new URL("naver/search.html", window.location.href);
  resultsUrl.searchParams.set("q", query);
  window.location.href = resultsUrl.href;
});

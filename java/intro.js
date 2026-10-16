const introGraphic = document.querySelector(".intro__graphic");

function openIntroTwo() {
  window.location.href = "intro.2.html";
}

introGraphic.addEventListener("click", openIntroTwo);
introGraphic.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openIntroTwo();
  }
});

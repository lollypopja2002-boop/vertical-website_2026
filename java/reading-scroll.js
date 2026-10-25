const readingViewport = document.querySelector('.reading__viewport');

if (readingViewport) {
  readingViewport.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const previous = readingViewport.scrollLeft;
    readingViewport.scrollLeft -= event.deltaY;
    if (readingViewport.scrollLeft !== previous) event.preventDefault();
  }, { passive: false });
}

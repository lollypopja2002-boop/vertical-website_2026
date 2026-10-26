(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const points = Array.from({ length: 9 }, (_, i) => {
    const element = document.createElement('span');
    element.className = 'cursor-dot';
    element.setAttribute('aria-hidden', 'true');
    element.style.setProperty('--cursor-size', `${1.5 * (i === 0 ? .625 : Math.max(.125, .3 - i * .021))}rem`);
    document.body.append(element);
    return { element, x: 0, y: 0 };
  });
  let x = 0, y = 0, visible = false, frame = 0;
  const hide = () => {
    visible = false;
    points.forEach(p => p.element.style.opacity = '0');
    cancelAnimationFrame(frame);
    frame = 0;
  };
  function draw() {
    points.forEach((point, i) => {
      const target = i ? points[i - 1] : { x, y };
      const ease = i ? .27 : 1;
      point.x += (target.x - point.x) * ease;
      point.y += (target.y - point.y) * ease;
      const distance = Math.hypot(point.x - x, point.y - y);
      point.element.style.opacity = !visible || (i && (reduced.matches || distance < 2)) ? '0' : String(i ? .75 - i * .06 : 1);
      point.element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
    });
    frame = visible ? requestAnimationFrame(draw) : 0;
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    x = event.clientX; y = event.clientY;
    if (!visible) points.forEach(p => { p.x = x; p.y = y; });
    visible = true;
    if (!frame) frame = requestAnimationFrame(draw);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.documentElement.classList.add('has-dot-cursor');
})();

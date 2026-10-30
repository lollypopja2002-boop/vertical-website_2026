(() => {
  'use strict';
  const key = 'vertical-guestbook-seals-v1';
  const form = document.querySelector('#seal-form');
  const input = document.querySelector('#seal-name');
  const message = document.querySelector('#seal-message');
  const preview = document.querySelector('#seal-preview');
  const board = document.querySelector('#seal-board');
  const canvas = document.querySelector('#seal-canvas');
  const empty = document.querySelector('#seal-empty');
  const status = document.querySelector('#seal-status');
  const undo = document.querySelector('#seal-undo');
  const storageNote = document.querySelector('#seal-storage');
  const dialog = document.querySelector('#seal-dialog');
  const openButton = document.querySelector('#seal-open');
  const useButton = document.querySelector('#seal-use');
  openButton.addEventListener('click', () => { dialog.showModal(); input.focus(); });
  document.querySelector('#seal-close').addEventListener('click', () => dialog.close());
  useButton.addEventListener('click', () => {
    if (!activeName) return;
    dialog.close();
    board.focus({ preventScroll: true });
  });
  let activeName = '';
  let stamps = [];
  let cloud = null;
  let syncing = false;
  let resync = false;
  let cloudQueue = Promise.resolve();
  function enqueueCloud(task) {
    const result = cloudQueue.then(task);
    cloudQueue = result.catch(() => {});
    return result;
  }
  const validStamp = item => item && validName(item.name) && Number.isFinite(item.x) && item.x >= 0 && item.x < 100000 && Number.isFinite(item.y) && item.y >= 0 && item.y <= 1 && Number.isFinite(item.angle) && Math.abs(item.angle) <= 10;
  function cache(){
    try { localStorage.setItem(key, JSON.stringify(stamps)); localStorage.setItem(`${key}-pages`, String(pages)); } catch {}
  }
  async function synchronize(){
    if(!cloud)return;
    if(syncing){resync=true;return;}
    syncing=true;
    return enqueueCloud(async () => {
    try {
      await cloud.upload(stamps);
      const remote=(await cloud.read()).filter(validStamp);
      const byId=new Map(stamps.filter(stamp=>!stamp.cloudSaved).map(stamp=>[stamp.id,stamp]));
      remote.forEach(stamp=>byId.set(stamp.id,stamp));
      stamps=[...byId.values()];
      cache();render();
      storageNote.textContent='다른 기기의 방문 기록과 함께 저장되어요。';
    } catch { storageNote.textContent='공용 저장소 연결을 확인해 주세요。도장은 이 브라우저에 보관 중이며 연결되면 다시 전송해요。'; }
    finally { syncing=false;if(resync){resync=false;synchronize();} }
    });
  }
  let ghost = null;
  let nextAngle = Math.random() * 12 - 6;
  let nextScale = .8 + Math.random() * .4;
  let pages = 5;
  let currentPage = 0;
  const pageDots = document.querySelector('#seal-page-dots');
  function selectPage(page) {
    currentPage = Math.max(0, Math.min(pages - 1, page));
    hideGhost();
    render();
  }
  document.querySelector('#seal-page-add').addEventListener('click', () => {
    pages++;
    selectPage(pages - 1);
    save();
  });
  const examples = [];
  const normalize = value => value.normalize('NFC').trim().replace(/\s+/gu, '');
  const validName = value => typeof value === 'string' && /^[\p{L}\p{N}]{1,12}$/u.test(value);
  function seal(name) {
    const element = document.createElement('span');
    element.className = 'guestbook__seal';
    element.setAttribute('aria-label', `${name} 인장`);
    const letters = Array.from(name);
    const ns = 'http://www.w3.org/2000/svg';
    const svg = (tag, attributes = {}) => {
      const node = document.createElementNS(ns, tag);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };
    const artwork = svg('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true', focusable: 'false' });
    const ink = svg('g', { filter: 'url(#seal-ink)' });
    // A slightly uneven carved frame, rather than a mechanically perfect box.
    ink.append(svg('path', { d: 'M4 5 L95 3 L97 96 L5 97 Z', fill: 'none', stroke: 'currentColor', 'stroke-width': '4' }));
    const columns = letters.length <= 2 ? 1 : letters.length <= 8 ? 2 : 3;
    const rows = Math.ceil(letters.length / columns);
    const width = 84 / columns;
    let index = 0;
    for (let column = 0; column < columns; column++) {
      const count = Math.min(rows, letters.length - index);
      const height = 84 / count;
      for (let row = 0; row < count; row++) {
        const cell = svg('svg', { x: 8 + (columns - column - 1) * width, y: 8 + row * height, width, height, viewBox: '0 0 100 100', preserveAspectRatio: 'none', overflow: 'visible' });
        const text = svg('text', { x: 50, y: 81, 'text-anchor': 'middle', textLength: 86, lengthAdjust: 'spacingAndGlyphs' });
        text.textContent = letters[index++];
        cell.append(text);
        ink.append(cell);
      }
    }
    artwork.append(ink);
    element.append(artwork);
    return element;
  }
  function sealSize() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return matchMedia('(max-width: 60rem)').matches ? 6 * rem : Math.min(9 * rem, Math.max(5 * rem, innerWidth * .075));
  }
  function bounds(angle, scale = 1) {
    const radians = angle * Math.PI / 180;
    const radius = sealSize() * scale * (Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians))) / 2 + 2;
    return { x: Math.min(.49, radius / board.clientWidth), y: Math.min(.49, radius / board.clientHeight) };
  }
  function clampPoint(x, y, angle, scale) {
    const margin = bounds(angle, scale);
    return { x: Math.max(currentPage + margin.x, Math.min(currentPage + 1 - margin.x, x)), y: Math.max(margin.y, Math.min(1 - margin.y, y)) };
  }
  function positionSeal(element, x, y, angle, scale = 1) {
    scale = Number.isFinite(scale) && scale >= .8 && scale <= 1.2 ? scale : 1;
    const point = clampPoint(x, y, angle, scale);
    element.style.left = `${(point.x - currentPage) * 100}%`;
    element.style.top = `${point.y * 100}%`;
    element.style.setProperty('--seal-angle', `${angle}deg`);
    element.style.setProperty('--seal-scale', scale);
  }
  function pointerPoint(event) {
    const rect = board.getBoundingClientRect();
    return { x: currentPage + (event.clientX - rect.left) / board.clientWidth, y: (event.clientY - rect.top) / board.clientHeight };
  }
  function hideGhost() {
    if (ghost) ghost.hidden = true;
  }
  function moveGhost(event) {
    if (event.target?.closest('.guestbook__seal--placed:not(.guestbook__seal--logo)')) { hideGhost(); return; }
    if (!activeName || dialog.open || event.pointerType === 'touch') { hideGhost(); return; }
    if (!ghost) {
      ghost = seal(activeName);
      ghost.classList.add('guestbook__seal--ghost');
      ghost.setAttribute('aria-hidden', 'true');
      canvas.append(ghost);
    }
    const point = pointerPoint(event);
    positionSeal(ghost, point.x, point.y, nextAngle, nextScale);
    ghost.hidden = false;
  }
  board.addEventListener('pointermove', moveGhost);
  board.addEventListener('pointerleave', hideGhost);
  board.addEventListener('pointercancel', hideGhost);
  board.addEventListener('blur', hideGhost);
  dialog.addEventListener('close', hideGhost);
  openButton.addEventListener('click', hideGhost);
  function render(animateNewest = false) {
    board.querySelectorAll('.guestbook__seal:not(.guestbook__seal--ghost)').forEach(element => element.remove());
    pages = Math.max(pages, Math.floor(Math.max(0, ...stamps.map(s => s.x))) + 1);
    canvas.style.width = '100%';
    renderPagination();
    // The supplied logo is decorative artwork, separate from visitor records.
    [...examples, ...stamps].filter(stamp => Math.floor(stamp.x) === currentPage).forEach(stamp => {
      let element;
      if (stamp.logo) {
        element = document.createElement('img');
        element.src = 'img/%E1%84%8C%E1%85%A1%E1%84%89%E1%85%A1%E1%86%AB%2012logo_stamp.svg';
        element.alt = '';
        element.className = 'guestbook__seal guestbook__seal--logo';
      } else {
        element = seal(stamp.name);
        const note = typeof stamp.message === 'string' ? stamp.message.slice(0, 200) : '';
        const caption = document.createElement('span');
        caption.className = 'guestbook__seal-message';
        caption.textContent = note || stamp.name;
        element.append(caption);
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-label', `${stamp.name} 인장、${note || '남긴 문구 없음'}`);
      }
      element.classList.add('guestbook__seal--placed');
      if (animateNewest && !stamp.logo && stamp === stamps[stamps.length - 1]) {
        element.classList.add('guestbook__seal--press');
      }
      // Keep the whole seal inside the paper, including on smaller screens.
      positionSeal(element, stamp.x, stamp.y, stamp.angle, stamp.scale);
      if (stamp.logo) element.setAttribute('aria-hidden', 'true');
      canvas.append(element);
    });
    empty.hidden = Boolean(activeName) || stamps.some(stamp => Math.floor(stamp.x) === currentPage);
    undo.disabled = !stamps.some(stamp=>!cloud || !stamp.ownerId || stamp.ownerId===cloud.ownerId);
    board.setAttribute('aria-label', `방명록 ${currentPage + 1}장에 도장 찍기`);
  }
  function renderPagination() {
    // Keep the focused control stable when another stamp is placed.
    if (pageDots.children.length !== pages) {
      pageDots.replaceChildren();
      for (let page = 0; page < pages; page++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `${page + 1}장`);
        button.setAttribute('aria-controls', 'seal-board');
        button.addEventListener('click', () => selectPage(page));
        pageDots.append(button);
      }
    }
    Array.from(pageDots.children).forEach((button, page) => {
      if (page === currentPage) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(stamps)); localStorage.setItem(`${key}-pages`, String(pages)); }
    catch { storageNote.textContent = '브라우저 저장을 사용할 수 없어、이 창을 닫으면 새 도장이 사라질 수 있어요。'; }
    synchronize();
  }
  try {
    const savedPages = Number(localStorage.getItem(`${key}-pages`));
    if (Number.isInteger(savedPages) && savedPages > 0 && savedPages <= 100000) pages = Math.max(5, savedPages);
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) stamps = saved.filter(item => item && validName(item.name) && Number.isFinite(item.x) && item.x >= 0 && item.x < 100000 && Number.isFinite(item.y) && item.y >= 0 && item.y <= 1 && Number.isFinite(item.angle) && Math.abs(item.angle) <= 10);
  } catch { storageNote.textContent = '저장된 도장을 불러올 수 없어요。새 인장을 만들어 찍을 수 있어요。'; }
  stamps.forEach(stamp => { stamp.id ||= crypto.randomUUID(); stamp.scale ||= 1; });
  cache();
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = normalize(input.value);
    if (!validName(name)) {
      status.textContent = '한글、영문、숫자로 이름을 한 자부터 열두 자까지 입력해 주세요。';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    if (ghost) { ghost.remove(); ghost = null; }
    activeName = name;
    empty.hidden = true;
    useButton.disabled = false;
    input.removeAttribute('aria-invalid');
    preview.replaceChildren(seal(name));
    board.setAttribute('aria-disabled', 'false');
    status.textContent = `${name} 인장이 준비됐어요。이 인장으로 찍기를 눌러 주세요。`;
  });
  input.addEventListener('input', () => {
    if (ghost) { ghost.remove(); ghost = null; }
    activeName = '';
    empty.hidden = stamps.some(stamp => Math.floor(stamp.x) === currentPage);
    useButton.disabled = true;
    preview.replaceChildren();
    board.setAttribute('aria-disabled', 'true');
    input.removeAttribute('aria-invalid');
    status.textContent = '이름을 입력한 뒤 인장 만들기를 눌러 주세요。';
  });
  function place(x, y) {
    if (!activeName) { dialog.showModal(); input.focus(); return; }
    const point = clampPoint(x, y, nextAngle, nextScale);
    stamps.push({ id:crypto.randomUUID(), ownerId:cloud?.ownerId, name: activeName, message: message.value.trim().slice(0, 200), x: point.x, y: point.y, angle: nextAngle, scale: nextScale });
    nextAngle = Math.random() * 12 - 6;
    nextScale = .8 + Math.random() * .4;
    if (ghost) ghost.style.setProperty('--seal-scale', nextScale);
    if (ghost) ghost.style.setProperty('--seal-angle', `${nextAngle}deg`);
    hideGhost();
    render(true);
    save();
    status.textContent = `${activeName} 인장을 찍었어요。`;
  }
  board.addEventListener('click', event => {
    const point = pointerPoint(event);
    place(point.x, point.y);
  });
  board.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); place(currentPage + .5, .5); }
  });
  undo.addEventListener('click', async () => {
    const index=stamps.findLastIndex(stamp=>!cloud || !stamp.ownerId || stamp.ownerId===cloud.ownerId);
    if(index<0)return;
    const stamp=stamps[index];
    undo.disabled=true;
    await enqueueCloud(async () => {
    try {
      if(cloud)await cloud.remove(stamp.id);
      stamps=stamps.filter(item=>item.id!==stamp.id);render();save();
      status.textContent='마지막 도장을 취소했어요。';
    }catch{status.textContent='도장을 취소하지 못했어요。연결을 확인하고 다시 시도해 주세요。';render();}
    });
  });
  window.addEventListener('online',synchronize);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)synchronize();});
  window.createGuestbookCloud().then(connection=>{
    cloud=connection;
    if(cloud){synchronize();setInterval(()=>{if(!document.hidden)synchronize();},15000);}
  }).catch(()=>{storageNote.textContent='공용 저장소 연결에 실패했어요。현재는 이 브라우저에만 저장되어요。';});
  new ResizeObserver(() => { hideGhost(); render(); }).observe(board);
  render();
})();

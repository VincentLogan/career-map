import { ROOT, BRANCHES, ALL_NODES } from './data.js';
import { BOUNDS, renderMap, exportMarkup } from './map.js';
import { MATCH_LEVELS } from './profiles.js';

const svg = document.querySelector('#career-map');
const container = document.querySelector('#map-container');
const panel = document.querySelector('#detail-panel');
const level = document.querySelector('#zoom-level');
renderMap(svg);
svg.setAttribute('role', 'group');
let camera, baseCamera, selectedId = null, toastTimer;
const pointers = new Map();
let gesture = null, didDrag = false;

function fittedCamera() {
  const aspect = container.clientWidth / container.clientHeight;
  const width = Math.max(BOUNDS.width, BOUNDS.height * aspect);
  const height = width / aspect;
  return { x: 1100 - width / 2, y: 620 - height / 2, width, height };
}
function drawCamera() {
  svg.setAttribute('viewBox', `${camera.x} ${camera.y} ${camera.width} ${camera.height}`);
  level.value = `${Math.round(baseCamera.width / camera.width * 100)}%`;
}
function fit() { baseCamera = fittedCamera(); camera = { ...baseCamera }; drawCamera(); }
function zoom(factor, clientX, clientY) {
  const rect = container.getBoundingClientRect();
  const ax = clientX == null ? .5 : (clientX - rect.left) / rect.width;
  const ay = clientY == null ? .5 : (clientY - rect.top) / rect.height;
  const width = Math.min(baseCamera.width * 1.7, Math.max(baseCamera.width / 4, camera.width / factor));
  const height = width * camera.height / camera.width;
  camera = { x: camera.x + ax * (camera.width - width), y: camera.y + ay * (camera.height - height), width, height };
  drawCamera();
}
function focusBranch(id) {
  const branch = BRANCHES.find(b => b.id === id);
  const nodes = [branch, ...branch.children];
  const minX = Math.min(...nodes.map(n => n.x)) - 145, maxX = Math.max(...nodes.map(n => n.x)) + 145;
  const minY = Math.min(...nodes.map(n => n.y)) - 90, maxY = Math.max(...nodes.map(n => n.y)) + 120;
  const aspect = container.clientWidth / container.clientHeight;
  const width = Math.max(maxX - minX, (maxY - minY) * aspect, baseCamera.width / 3);
  const height = width / aspect;
  camera = { x: (minX + maxX - width) / 2, y: (minY + maxY - height) / 2, width, height };
  closePanel(false); drawCamera();
  announce(`已定位：${branch.label}`);
}
function announce(message) {
  const toast = document.querySelector('#toast');
  clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}
function closePanel(restore = true) {
  panel.hidden = true;
  if (selectedId) {
    const old = svg.querySelector(`[data-node="${selectedId}"]`);
    old?.classList.remove('is-selected'); old?.setAttribute('aria-expanded', 'false');
    if (restore) old?.focus({ preventScroll: true });
  }
  selectedId = null;
}
function openPanel(id) {
  if (selectedId === id && !panel.hidden) { closePanel(); return; }
  closePanel(false);
  const node = ALL_NODES.find(n => n.id === id);
  const branch = node.branchId ? BRANCHES.find(b => b.id === node.branchId) : BRANCHES.find(b => b.id === id);
  const root = id === ROOT.id;
  const leaf = Boolean(node.branchId);
  const color = node.color || '#c2b3f0';
  selectedId = id;
  const group = svg.querySelector(`[data-node="${id}"]`);
  group.classList.add('is-selected'); group.setAttribute('aria-expanded', 'true');
  panel.style.setProperty('--detail-color', color);
  panel.classList.toggle('is-leaf', leaf);
  const abilities = leaf ? `<section class="abilities-section" aria-label="所需能力"><h3>所需能力</h3><ul class="ability-list">${node.abilities.map(([name, detail]) => `<li><strong>${name}</strong><span>${detail}</span></li>`).join('')}</ul></section>` : '';
  const match = leaf ? `<section class="match-section" style="--match-color:${MATCH_LEVELS[node.match.level].color}" aria-label="个人匹配度"><div class="match-heading"><h3>个人匹配度</h3><span class="match-label">${node.match.level}</span></div><div class="match-meter" role="meter" aria-label="个人匹配度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${node.match.value}" aria-valuetext="${node.match.level}"><span style="width:${node.match.value}%"></span></div><div class="match-scale" aria-hidden="true"><span>低</span><span>高</span></div></section>` : '';
  panel.innerHTML = `<div class="detail-top"><span class="detail-category"><i></i>${root ? '每条路，都是可能' : branch?.label || '方向概览'}</span><button class="close-button" aria-label="关闭详情">×</button></div><div class="detail-content"><div class="detail-orbit" aria-hidden="true"><span>${root ? '↗' : branch?.icon === 'code' ? '⌘' : '✧'}</span></div><h2>${node.fullLabel || node.label}</h2><p class="detail-note">${node.note}</p><div class="detail-rule"></div><p class="detail-copy">${root ? '这是一棵以计算机专业为起点的毕业出路树。六个方向并不互斥：可以继续深造后就业，也可以在工作中转向交叉领域。先探索，再慢慢找到自己的答案。' : node.description}</p>${abilities}${root ? `<div class="detail-tags">${BRANCHES.map(b => `<span>${b.label}</span>`).join('')}</div>` : `<h3>${node.children ? '可以继续探索' : '关注与准备'}</h3><div class="detail-tags">${(node.children ? node.children.map(n => n.label) : node.skills).map(s => `<span>${s}</span>`).join('')}</div>`}</div>${match}`;
  panel.hidden = false;
  panel.querySelector('.close-button').addEventListener('click', () => closePanel());
  panel.querySelector('.close-button').focus({ preventScroll: true });
}

document.querySelector('#branch-nav').innerHTML = BRANCHES.map((b, i) => `<button style="--branch-color:${b.color}" data-branch="${b.id}" title="定位${b.label}"><span class="branch-number">0${i + 1}</span><i></i><span>${b.label}</span></button>`).join('');
document.querySelector('#branch-nav').addEventListener('click', e => { const button = e.target.closest('[data-branch]'); if (button) focusBranch(button.dataset.branch); });
svg.addEventListener('click', e => { const node = e.target.closest('[data-node]'); if (!didDrag && node) openPanel(node.dataset.node); });
svg.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-node]')) { e.preventDefault(); e.stopPropagation(); openPanel(e.target.closest('[data-node]').dataset.node); } });
container.addEventListener('wheel', e => { e.preventDefault(); zoom(Math.exp(-e.deltaY * .0015), e.clientX, e.clientY); }, { passive: false });
container.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  didDrag = false;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const points = [...pointers.values()];
  gesture = { camera: { ...camera }, start: points[0], distance: points.length > 1 ? Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) : null };
  container.setPointerCapture(e.pointerId);
  container.classList.add('is-dragging');
});
container.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId) || !gesture) return;
  const prior = pointers.get(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const points = [...pointers.values()];
  if (points.length > 1 && gesture.distance) {
    const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
    zoom(distance / gesture.distance, (points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2);
    gesture.distance = distance; didDrag = true;
  } else {
    if (!didDrag && Math.hypot(e.clientX - gesture.start.x, e.clientY - gesture.start.y) > 5) didDrag = true;
    if (didDrag) {
      camera.x -= (e.clientX - prior.x) / container.clientWidth * camera.width;
      camera.y -= (e.clientY - prior.y) / container.clientHeight * camera.height;
      drawCamera();
    }
  }
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size) { const point = [...pointers.values()][0]; gesture = { camera: { ...camera }, start: point, distance: null }; }
  else { gesture = null; container.classList.remove('is-dragging'); }
}
container.addEventListener('pointerup', endPointer);
container.addEventListener('pointercancel', endPointer);
// Pointer capture retargets clicks to the container; resolve the release point back to a node.
container.addEventListener('pointerup', e => {
  if (!didDrag && e.pointerType !== '' && pointers.size === 0) {
    const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-node]');
    if (hit && container.hasPointerCapture(e.pointerId)) { openPanel(hit.dataset.node); didDrag = true; }
  }
});
container.addEventListener('keydown', e => {
  const move = camera.width * .045;
  const actions = { ArrowLeft: () => { camera.x -= move; }, ArrowRight: () => { camera.x += move; }, ArrowUp: () => { camera.y -= move; }, ArrowDown: () => { camera.y += move; }, '+': () => zoom(1.2), '=': () => zoom(1.2), '-': () => zoom(1 / 1.2), '0': fit };
  if (actions[e.key]) { e.preventDefault(); actions[e.key](); drawCamera(); }
});
document.querySelector('#zoom-in').addEventListener('click', () => zoom(1.2));
document.querySelector('#zoom-out').addEventListener('click', () => zoom(1 / 1.2));
document.querySelector('#fit-map').addEventListener('click', fit);
document.querySelector('#help-button').addEventListener('click', e => { const help = document.querySelector('#help-panel'); help.hidden = !help.hidden; e.currentTarget.setAttribute('aria-expanded', String(!help.hidden)); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePanel(); document.querySelector('#help-panel').hidden = true; document.querySelector('#help-button').setAttribute('aria-expanded', 'false'); } });

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
document.querySelector('#export-button').addEventListener('click', async () => {
  const button = document.querySelector('#export-button');
  button.disabled = true; button.querySelector('span').textContent = '生成中…';
  let url;
  try {
    await document.fonts.ready;
    const markup = exportMarkup(svg);
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    url = URL.createObjectURL(blob);
    const img = new Image(); img.src = url; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = 4520; canvas.height = 3000;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(img, 0, 0);
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('PNG unavailable');
    download(png, '向上生长-毕业出路地图.png');
    announce('完整地图已导出 · 4520 × 3000 PNG');
  } catch (error) {
    console.warn('PNG export failed; falling back to SVG.', error);
    download(new Blob([exportMarkup(svg)], { type: 'image/svg+xml;charset=utf-8' }), '向上生长-毕业出路地图.svg');
    announce('已导出可缩放的 SVG 完整地图');
  } finally {
    if (url) URL.revokeObjectURL(url);
    button.disabled = false; button.querySelector('span').textContent = '导出地图';
  }
});

let previousSize;
new ResizeObserver(() => {
  const nextBase = fittedCamera();
  if (!camera || !previousSize) fit();
  else {
    const ratio = baseCamera.width / camera.width;
    const cx = camera.x + camera.width / 2, cy = camera.y + camera.height / 2;
    baseCamera = nextBase;
    const width = baseCamera.width / ratio, height = width * container.clientHeight / container.clientWidth;
    camera = { x: cx - width / 2, y: cy - height / 2, width, height }; drawCamera();
  }
  previousSize = [container.clientWidth, container.clientHeight];
}).observe(container);
fit();

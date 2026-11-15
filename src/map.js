import { ROOT, BRANCHES } from './data.js';
import { LEAF_PROFILES } from './profiles.js';

export const BOUNDS = { x: -30, y: -30, width: 2260, height: 1360 };
const icons = {
  book: '<path d="M-13-10q7-3 13 1 6-4 13-1v20q-7-3-13 1-6-4-13-1Z M0-9v20"/>',
  code: '<path d="m-6-9-9 9 9 9m12-18 9 9-9 9M3-13l-6 26"/>',
  brain: '<path d="M-3-12c-6-6-13 0-10 6-7 4-5 12 1 13-1 7 8 9 12 4V-9m3-3c6-6 13 0 10 6 7 4 5 12-1 13 1 7-8 9-12 4V-9M-12-4l6 3m-5 7 5-2m18-8-6 3m5 7-5-2"/>',
  cross: '<rect x="-13" y="-13" width="18" height="18" rx="4"/><rect x="-5" y="-5" width="18" height="18" rx="4"/>',
  building: '<path d="m-14-5 14-9L14-5Z M-11-1v12m7-12v12m8-12v12m7-12v12M-15 15h30"/>',
  spark: '<path d="m0-15 4 11 11 4L4 4 0 15-4 4-15 0l11-4Z"/>',
};
const svgStyles = `
  .map-node { cursor: pointer; outline: none; }
  .node-label { fill: #e1e6f0; font-family: 'Noto Sans CJK SC','Microsoft YaHei','PingFang SC',sans-serif; font-size: 27px; font-weight: 500; text-anchor: middle; letter-spacing: 1px; }
  .node-note { fill: #8490a4; font-family: 'Noto Sans CJK SC','Microsoft YaHei','PingFang SC',sans-serif; font-size: 19px; text-anchor: middle; letter-spacing: 1px; }
  .branch-label { font-size: 30px; font-weight: 600; }
  .branch-note { font-size: 19px; }
  .node-label, .node-note { paint-order: stroke; stroke: #090d16; stroke-width: 6px; stroke-linejoin: round; }
  .node-core { fill: #0b111d; stroke-width: 1.8; }
  .node-ring { fill: none; stroke-width: 1; opacity: .27; }
  .node-halo { fill: none; stroke-width: 7; opacity: .035; }
  .node-icon { fill: none; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
  .node-hit { fill: transparent; stroke: none; }
  .focus-ring { fill: none; stroke: #eef2ff; stroke-width: 2; opacity: 0; }
  /* 亮度只表达已有匹配等级，保留六个分支原有的色相。 */
  .leaf-node[data-match-level="低"] { --mark-opacity: .68; --label-opacity: .82; --note-opacity: .78; --ring-opacity: .15; --halo-opacity: .02; }
  .leaf-node[data-match-level="较低"] { --mark-opacity: .78; --label-opacity: .88; --note-opacity: .84; --ring-opacity: .20; --halo-opacity: .025; }
  .leaf-node[data-match-level="中等"] { --mark-opacity: .87; --label-opacity: .93; --note-opacity: .90; --ring-opacity: .25; --halo-opacity: .035; }
  .leaf-node[data-match-level="较高"] { --mark-opacity: .96; --label-opacity: .98; --note-opacity: .96; --ring-opacity: .30; --halo-opacity: .05; }
  .leaf-node[data-match-level="高"] { --mark-opacity: 1; --label-opacity: 1; --note-opacity: 1; --ring-opacity: .52; --halo-opacity: .14; }
  .leaf-node .node-core { stroke-opacity: var(--mark-opacity); }
  .leaf-node .node-icon { opacity: var(--mark-opacity); }
  .leaf-node .node-label { opacity: var(--label-opacity); }
  .leaf-node .node-note { opacity: var(--note-opacity); }
  .leaf-node .node-ring { opacity: var(--ring-opacity); }
  .leaf-node .node-halo { opacity: var(--halo-opacity); }
  .leaf-node[data-match-level="高"] .node-core { stroke-width: 2.3; }
  .leaf-node[data-match-level="高"] .node-label { fill: #f0f3fc; font-weight: 600; }
  .match-glow { opacity: .12; pointer-events: none; }
  .map-node:hover .node-core, .map-node:focus .node-core, .map-node.is-selected .node-core { fill: #1a2436; stroke-width: 2.7; }
  .map-node:hover .node-ring, .map-node:focus .node-ring, .map-node.is-selected .node-ring { opacity: .7; }
  .map-node:focus-visible .focus-ring { opacity: .8; }
  .map-node:hover .node-label, .map-node.is-selected .node-label { fill: white; }
  .leaf-node:hover .node-core, .leaf-node:focus .node-core, .leaf-node.is-selected .node-core { stroke-opacity: 1; }
  .leaf-node:hover .node-icon, .leaf-node:focus .node-icon, .leaf-node.is-selected .node-icon,
  .leaf-node:hover .node-label, .leaf-node:focus .node-label, .leaf-node.is-selected .node-label,
  .leaf-node:hover .node-note, .leaf-node:focus .node-note, .leaf-node.is-selected .node-note { opacity: 1; }
`;

function curve(from, to, kind) {
  if (kind === 'trunk') return `M${from.x},${from.y} C${from.x + (to.x - from.x) * .13},${from.y - 210} ${to.x},${to.y + 170} ${to.x},${to.y}`;
  if (to.y >= from.y - 40) return `M${from.x},${from.y} C${from.x + (to.x - from.x) * .4},${from.y - 30} ${to.x},${to.y - 55} ${to.x},${to.y}`;
  const bend = Math.min(100, (from.y - to.y) * .5);
  return `M${from.x},${from.y} C${from.x},${from.y - bend} ${to.x},${to.y + bend} ${to.x},${to.y}`;
}

function nodeMarkup(node, branch = false) {
  const radius = branch ? 29 : 22;
  const match = branch ? null : LEAF_PROFILES[node.id]?.match;
  return `<g class="map-node${match ? ' leaf-node' : ''}" data-node="${node.id}"${match ? ` data-match-level="${match.level}"` : ''} transform="translate(${node.x} ${node.y})" tabindex="0" role="button" aria-label="${node.fullLabel || node.label}，${node.note}${match ? `，个人匹配度${match.level}` : ''}，查看详情" aria-expanded="false">
    <circle class="node-hit" r="49"/>
    ${match?.level === '高' ? `<circle class="match-glow" r="32" fill="${node.color}" filter="url(#match-glow)" aria-hidden="true"/>` : ''}
    <circle class="node-halo" r="${radius + 7}" stroke="${node.color}"/>
    <circle class="node-ring" r="${radius + 13}" stroke="${node.color}" ${branch ? 'stroke-dasharray="4 5"' : ''}/>
    <circle class="node-ring" r="${radius + 6}" stroke="${node.color}"/>
    <circle class="node-core" r="${radius}" stroke="${node.color}"/>
    <circle class="focus-ring" r="${radius + 18}"/>
    <g class="node-icon" stroke="${node.color}">${branch ? icons[node.icon] : '<path d="M-9 0h6m6 0h6"/><circle r="3"/>'}</g>
    <text class="node-label ${branch ? 'branch-label' : ''}" y="${radius + 31}">${node.label}</text>
    <text class="node-note ${branch ? 'branch-note' : ''}" y="${radius + 56}">${node.note}</text>
  </g>`;
}

export function renderMap(svg) {
  svg.innerHTML = `<title id="map-title">个人毕业出路树</title><desc id="map-description">六个方向，三十一条可能。各方向可以交叉发展。点击节点查看简要说明。</desc>
    <defs><style>${svgStyles}</style><filter id="match-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter><pattern id="dot-grid" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.3" fill="#6d7f9f" opacity=".16"/></pattern>
    ${BRANCHES.map(b => `<linearGradient id="trunk-${b.id}" x1="0" y1="1" x2="0" y2="0"><stop stop-color="${b.color}" stop-opacity=".38"/><stop offset="1" stop-color="${b.color}" stop-opacity=".9"/></linearGradient>`).join('')}</defs>
    <g class="map-edges" fill="none" aria-hidden="true">${BRANCHES.map(b => {
      const d = curve(ROOT, b, 'trunk');
      return `<path d="${d}" stroke="${b.color}" stroke-width="12" opacity=".035"/><path d="${d}" stroke="${b.color}" stroke-width="5" opacity=".12"/><path d="${d}" stroke="url(#trunk-${b.id})" stroke-width="2.3"/>${b.children.map(n => `<path d="${curve(b, n)}" stroke="${b.color}" stroke-width="6" opacity=".055"/><path d="${curve(b, n)}" stroke="${b.color}" stroke-width="1.7" opacity=".65"/>`).join('')}`;
    }).join('')}</g>
    <g class="map-nodes">${BRANCHES.map(b => b.children.map(n => nodeMarkup({ ...n, color: b.color })).join('') + nodeMarkup(b, true)).join('')}
    <g class="map-node root-node" data-node="me" transform="translate(${ROOT.x} ${ROOT.y})" tabindex="0" role="button" aria-label="${ROOT.label}，查看地图说明" aria-expanded="false"><circle class="node-hit" r="60"/><circle r="56" fill="none" stroke="#b9bdd9" opacity=".1"/><circle r="46" fill="none" stroke="#b9bdd9" opacity=".22"/><circle class="node-core" r="35" stroke="#d9dced"/><circle class="focus-ring" r="53"/><g fill="none" stroke="#e0e3f1" stroke-width="2.1" stroke-linecap="round"><circle cy="-8" r="7"/><path d="M-12 15v-4a12 12 0 0 1 24 0v4"/></g><text class="node-label branch-label" y="78">${ROOT.label}</text><text class="node-note" y="106">${ROOT.note}</text></g></g>`;
}

export function exportMarkup(svg) {
  const copy = svg.cloneNode(true);
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copy.setAttribute('viewBox', '-30 -110 2260 1500');
  copy.setAttribute('width', '4520');
  copy.setAttribute('height', '3000');
  copy.removeAttribute('style');
  copy.querySelectorAll('[tabindex]').forEach(el => { el.removeAttribute('tabindex'); el.classList.remove('is-selected'); el.setAttribute('aria-expanded', 'false'); });
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  bg.innerHTML = '<rect x="-30" y="-110" width="2260" height="1500" fill="#090d16"/><rect x="-30" y="-110" width="2260" height="1500" fill="url(#dot-grid)"/>';
  copy.insertBefore(bg, copy.querySelector('.map-edges'));
  const caption = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  caption.innerHTML = `<text x="50" y="-25" fill="#eef0f8" font-size="38" font-weight="600" font-family="sans-serif">向上生长 · 我的毕业出路地图</text><text x="2180" y="-25" text-anchor="end" fill="#8a96ac" font-size="20" font-family="sans-serif">6 个方向 · 由你继续书写</text>${BRANCHES.map((b, i) => `<circle cx="${150 + i * 345}" cy="1350" r="5" fill="${b.color}"/><text x="${166 + i * 345}" y="1357" fill="#aab4c7" font-size="19" font-family="sans-serif">${b.label}</text>`).join('')}`;
  copy.appendChild(caption);
  return new XMLSerializer().serializeToString(copy);
}

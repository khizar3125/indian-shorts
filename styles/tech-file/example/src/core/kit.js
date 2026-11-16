// Tech File component zoo: flat "control room / documentary b-roll" pieces drawn with the shared ctx.
// Rules (STYLE.md): flat fills only, one darker shade per colour, ink outlines only on UI chrome,
// green = systems working, red = danger, cyan = data, yellow = the highlighted keyword.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eob, rnd, rr, circle, ell, line, fillAll, bigText } from './lib.js';

// ---------- shared chrome ----------
export function panel(x, y, w, h, r = 22, fill = C.panel, edge = C.panelEdge) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = edge; ctx.stroke();
}
/** title bar of a window/panel: three dots + optional title text */
export function titleBar(x, y, w, title) {
  ctx.beginPath(); ctx.roundRect(x, y, w, 54, [22, 22, 0, 0]); ctx.fillStyle = C.panelEdge; ctx.fill();
  for (let i = 0; i < 3; i++) circle(x + 44 + i * 44, y + 27, 12, [C.red, C.yellow, C.green][i]);
  if (title) { ctx.font = '700 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = C.gray; ctx.fillText(title, x + w - ctx.measureText(title).width - 30, y + 28); }
}
/** a dark "screen" area inside chrome, with a subtle flat border */
export function screen(x, y, w, h) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fillStyle = C.screen; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = C.well; ctx.stroke();
}
export function monotype(text, x, y, size, col, align = 'left') {
  ctx.font = `600 ${size}px Inter`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.fillStyle = col; ctx.fillText(text, x, y);
}
/** label pill (white text on coloured rounded pill) */
export function pill(text, x, y, size, bg = C.ink, fg = C.white, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + size * 0.9, h = size * 1.7;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(text, 0, size * 0.06); ctx.restore();
  return { w: w * sc, h: h * sc };
}
/** callout tag: label pill that slides from (x,y) to point at (tx,ty) with a leader line */
export function tag(text, x, y, tx, ty, size = 60, sc = 1) {
  const p = sc < 1 ? 1 : 1; // tag always fully drawn; sc is the pop scale handled by the caller
  if (sc > 0.01) {
    line([[tx, ty], [x, y]], C.gray, 6);
    pill(text, x, y, size, C.ink, C.white, sc);
  }
}
export function redX(x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(0.04);
  ctx.lineCap = 'round'; ctx.lineWidth = 54 * s; ctx.strokeStyle = C.red;
  line([[-140 * s, -140 * s], [140 * s, 140 * s]], C.red, 54 * s);
  line([[140 * s, -140 * s], [-140 * s, 140 * s]], C.red, 54 * s);
  ctx.restore();
}
export function arrow(x, y, len, angle = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(angle);
  line([[-len / 2, 0], [len / 2, 0]], C.white, 14); line([[len / 2, 0], [len / 2 - 44, -30]], C.white, 14);
  line([[len / 2, 0], [len / 2 - 44, 30]], C.white, 14); ctx.restore();
}
export function warning(x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.beginPath(); ctx.moveTo(0, -110 * s); ctx.lineTo(120 * s, 90 * s); ctx.lineTo(-120 * s, 90 * s); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.font = `900 ${150 * s}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = C.ink; ctx.fillText('!', 0, 20 * s); ctx.restore();
}
/** impact burst around (x,y) */
export function burst(x, y, s, a) {
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 12; i++) { const an = i / 12 * TAU, r1 = 70 * s, r2 = (140 + rnd(i) * 80) * s;
    line([[x + Math.cos(an) * r1, y + Math.sin(an) * r1], [x + Math.cos(an) * r2, y + Math.sin(an) * r2]], C.yellow, 16 * s); }
  ctx.restore();
}
export function shockLines(x, y, r, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 9; i++) { const an = (i / 9) * TAU + 0.3;
    line([[x + Math.cos(an) * r, y + Math.sin(an) * r], [x + Math.cos(an) * (r + 56), y + Math.sin(an) * (r + 56)]], C.white, 12); }
  ctx.restore();
}

// ---------- people ----------
/** flat figure; `hood` gives the anonymous kid look. origin = chest centre, ~1000 px tall at s:1. */
export function person({ x, y, s = 1, hood = false, skin = C.skin, eyes = 'n', mouth = 'flat', arm = 'down',
  look = 0, shirt = C.hoodie, pants = C.hoodieShade } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // legs
  ctx.fillStyle = pants;
  ctx.beginPath(); ctx.roundRect(-95, 130, 78, 400, 30); ctx.fill();
  ctx.beginPath(); ctx.roundRect(17, 130, 78, 400, 30); ctx.fill();
  ctx.fillStyle = '#161A22'; // shoes
  ctx.beginPath(); ctx.roundRect(-115, 500, 110, 56, 24); ctx.fill();
  ctx.beginPath(); ctx.roundRect(5, 500, 110, 56, 24); ctx.fill();
  // torso
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(-135, -60, 270, 330, 60); ctx.fill();
  ctx.fillStyle = C.hoodieShade; ctx.fillRect(-135, 190, 270, 44); // hem shade
  // arms
  const aA = { down: 0.7, up: -1.0, phone: -1.15 }[arm] ?? 0.7;
  const armX = arm === 'phone' ? 1 : -1;
  ctx.save(); ctx.translate(armX * 135, 30); ctx.rotate(armX * aA);
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(0, -34, 240, 68, 34); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(-armX * 135, 30); ctx.rotate(-armX * 0.7);
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(0, -34, 230, 68, 34); ctx.fill(); ctx.restore();
  // head
  const hy = -170, lr = clamp(look, -1, 1) * 12;
  ctx.fillStyle = hood ? shirt : skin;
  ctx.beginPath(); ctx.arc(0, hy, 108, 0, TAU); ctx.fill();
  if (hood) { // hood opening: dark face inside
    ctx.fillStyle = C.well; ctx.beginPath(); ctx.arc(0, hy, 86, 0, TAU); ctx.fill();
    ctx.fillStyle = shirt; // hood rim
    ctx.beginPath(); ctx.arc(0, hy, 96, 0, TAU); ctx.arc(0, hy, 86, 0, TAU, true); ctx.fill();
  }
  // face (dot eyes with highlight; hooded faces get dim white eyes)
  const ec = hood ? '#E8ECF4' : C.ink, eh = hood ? C.white : C.white;
  for (const ex of [-38, 38]) {
    circle(ex + lr, hy - 8, 13, ec);
    circle(ex + lr + 4, hy - 12, 4, eh);
  }
  // mouth
  ctx.strokeStyle = ec; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath();
  if (mouth === 'smile') ctx.arc(lr, hy + 34, 26, 0.15 * Math.PI, 0.85 * Math.PI);
  else if (mouth === 'smirk') ctx.arc(lr, hy + 30, 22, 0.2 * Math.PI, 0.7 * Math.PI);
  else if (mouth === 'o') { ctx.fillStyle = ec; ctx.beginPath(); ctx.arc(lr, hy + 40, 15, 0, TAU); ctx.fill(); }
  else if (mouth === 'grin') { ctx.fillStyle = ec; ctx.beginPath(); ctx.roundRect(lr - 30, hy + 28, 60, 18, 9); ctx.fill(); }
  else line([[lr - 22, hy + 42], [lr + 22, hy + 42]], ec, 10);
  ctx.restore();
}
/** hand holding a phone from below (the "he picked up the phone" shot) */
export function handPhone(x, y, s, { angle = 0, ring = false, lt = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
  // forearm rising from the bottom
  ctx.fillStyle = C.hoodie; ctx.beginPath(); ctx.roundRect(-110, 280, 220, 240, 70); ctx.fill();
  // phone
  const wob = ring ? Math.sin(lt * 40) * 5 : 0;
  ctx.save(); ctx.translate(wob, 0);
  ctx.fillStyle = C.steelDark; ctx.beginPath(); ctx.roundRect(-150, -290, 300, 580, 40); ctx.fill();
  ctx.fillStyle = C.screen; ctx.beginPath(); ctx.roundRect(-126, -260, 252, 522, 24); ctx.fill();
  if (ring) { ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(-126, -130, 252, 74, 37); ctx.fill();
    ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = C.ink; ctx.fillText('ANSWER', 0, -92);
    monotype('INCOMING CALL', 0, -190, 26, C.gray, 'center'); }
  ctx.restore();
  // palm gripping the bottom edge, thumb hooked on the side
  ctx.fillStyle = C.skin; ctx.beginPath(); ctx.roundRect(-140, 200, 280, 130, 56); ctx.fill();
  ctx.fillStyle = C.skinShade; ctx.beginPath(); ctx.roundRect(-140, 280, 280, 50, 25); ctx.fill();
  ctx.fillStyle = C.skin; ctx.beginPath(); ctx.ellipse(-160, 250, 38, 72, 0.35, 0, TAU); ctx.fill();
  ctx.restore();
  if (ring) { ctx.save(); ctx.globalAlpha = clamp(1 - ((lt * 2) % 1) * 0.5);
    circle(x - 210, y - 260, 10 + ((lt * 2) % 1) * 22, C.green); circle(x + 210, y - 300, 10 + ((lt * 2) % 1) * 22, C.green);
    ctx.restore(); }
}

// ---------- social media ----------
/** verified badge */
export function badge(x, y, r) {
  circle(x, y, r, C.blue); ctx.strokeStyle = C.white; ctx.lineWidth = r * 0.28; ctx.lineCap = 'round';
  line([[x - r * 0.45, y + r * 0.05], [x - r * 0.1, y + r * 0.4], [x + r * 0.5, y - r * 0.35]], C.white, r * 0.24);
}
/** flat profile avatar: circle bg + shoulders + head */
export function avatar(x, y, r, col = C.grayDark, init = '') {
  circle(x, y, r, col);
  ctx.fillStyle = C.white; ctx.globalAlpha = 0.85;
  circle(x, y - r * 0.15, r * 0.34, C.white);
  ctx.beginPath(); ctx.arc(x, y + r * 0.75, r * 0.52, Math.PI, 0); ctx.fill();
  ctx.globalAlpha = 1;
  if (init) { ctx.font = `900 ${r * 0.9}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = C.white; ctx.fillText(init, x, y + r * 0.06); }
}
/** a social post card (~390x250 at s:1). text can be ['line1','line2'] */
export function post(x, y, s, { name = 'ACCOUNT', text = ['GIVE ME MONEY,', 'GET DOUBLE BACK'], hi = -1, dark = false } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  panel(-195, -125, 390, 250, 24, dark ? C.well : C.panel);
  avatar(-130, -62, 34, C.grayDark);
  ctx.font = '800 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.white;
  ctx.fillText(name, -84, -66); badge(-84 + ctx.measureText(name).width + 22, -66, 16);
  monotype('@' + name.toLowerCase().replace(/[^a-z]/g, ''), -84, -30, 24, C.gray);
  text.forEach((t, i) => { ctx.font = `900 33px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = i === hi ? C.yellow : C.white;
    ctx.fillText(t, 0, 34 + i * 44); });
  ctx.restore();
}
/** scrolling wall of identical posts (the scam spreading) */
export function feed(x, y, t, { rows = 5, cols = 2, s = 0.62, dark = false } = {}) {
  const w = 390 * s, h = 250 * s, gx = w + 26, gy = h + 26;
  const off = (t * 90) % gy;
  ctx.save(); ctx.beginPath(); ctx.rect(x - (cols * gx) / 2 - 10, y - (rows * gy) / 2 - 10, cols * gx + 20, rows * gy + 20); ctx.clip();
  for (let r = -1; r < rows + 1; r++) for (let c = 0; c < cols; c++) {
    const px = x - (cols * gx - gx) / 2 + c * gx, py = y - (rows * gy - gy) / 2 + r * gy + off;
    post(px, py, s, { name: ['OBAMA', 'ELON', 'APPLE', 'GATES', 'KANYE', 'MRBEAST', 'BIDEN', 'AMAZON'][(r + 9) % 8], text: ['SEND 1K, GET 2K'], dark });
  }
  ctx.restore();
}

// ---------- devices & UI ----------
/** smartphone with a drawable screen: drawScreen(sx, sy, sw, sh, lt) receives the screen rect */
export function phone(x, y, s, drawScreen, lt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.steelDark; ctx.beginPath(); ctx.roundRect(-175, -350, 350, 700, 52); ctx.fill();
  ctx.fillStyle = C.screen; ctx.beginPath(); ctx.roundRect(-150, -318, 300, 636, 30); ctx.fill();
  ctx.fillStyle = C.panelEdge; ctx.beginPath(); ctx.roundRect(-52, -334, 104, 26, 13); ctx.fill(); // notch
  if (drawScreen) { ctx.save(); ctx.beginPath(); ctx.roundRect(-150, -318, 300, 636, 30); ctx.clip();
    drawScreen(-150, -318, 300, 636, lt); ctx.restore(); }
  ctx.restore();
}
/** incoming-call UI inside a phone screen: name + answer/decline buttons */
export function callUI(sx, sy, sw, sh, lt, { name = 'IT DEPARTMENT', answered = false } = {}) {
  const cx = sx + sw / 2;
  monotype('INCOMING CALL', cx, sy + 90, 26, C.gray, 'center');
  monotype(name, cx, sy + 160, 40, C.white, 'center');
  avatar(cx, sy + 300, 70, C.grayDark);
  if (answered) { circle(cx, sy + sh - 90, 44, C.green); // single end button
    ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = C.white; ctx.fillText('LIVE', cx, sy + sh - 90 + 2);
  } else {
    circle(cx - 90, sy + sh - 90, 44, C.red); circle(cx + 90, sy + sh - 90, 44, C.green);
    const pu = 1 + 0.08 * Math.sin(lt * 8);
    ctx.save(); ctx.translate(cx + 90, sy + sh - 90); ctx.scale(pu, pu);
    circle(0, 0, 44, C.green); ctx.restore();
  }
}
/** credentials prompt inside a phone/terminal screen: USER + PASSWORD fields */
export function credUI(sx, sy, sw, sh, { typed = 0, field = 0 } = {}) {
  const cx = sx + sw / 2;
  monotype('COMPANY VPN', cx, sy + 70, 30, C.gray, 'center');
  ['USERNAME', 'PASSWORD'].forEach((lab, i) => {
    const fy = sy + 160 + i * 150;
    panel(sx + 30, fy - 40, sw - 60, 92, 14, C.well, C.panelEdge);
    monotype(lab, sx + 52, fy + 8, 26, C.gray);
    if (i === 0) monotype('r.trav', sx + 52 + 170, fy + 8, 28, C.green);
    else { const n = Math.round(typed * 9);
      for (let k = 0; k < n; k++) circle(sx + 250 + k * 30, fy + 8, 7, C.white); }
    if (i === field && typed < 1) { ctx.strokeStyle = C.cyan; ctx.lineWidth = 6; ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(lt0(sy) * 4));
      ctx.beginPath(); ctx.roundRect(sx + 30, fy - 40, sw - 60, 92, 14); ctx.stroke(); ctx.globalAlpha = 1; }
  });
  monotype('SIGN IN ›', cx, sy + 470, 32, C.green, 'center');
}
function lt0(seed) { return seed % 10; }
/** terminal window with typed lines. lines: [{txt, col}] shown one after another by `prog` (0..lines.length) */
export function terminal(x, y, w, h, lt, lines, prog = lines.length) {
  panel(x, y, w, h, 20); titleBar(x, y, w, 'TERMINAL');
  screen(x + 20, y + 70, w - 40, h - 90);
  const lh = 46; let shown = 0;
  for (let i = 0; i < lines.length && i < Math.ceil(prog) + 1; i++) {
    const frac = clamp(prog - i, 0, 1), txt = lines[i].txt.slice(0, Math.round(lines[i].txt.length * frac));
    monotype(txt, x + 50, y + 120 + i * lh, 34, lines[i].col || C.green);
    shown = i;
    if (frac < 1 && Math.sin(lt * 20) > 0) { // cursor block on the typing line
      ctx.fillStyle = C.green; ctx.fillRect(x + 52 + ctx.measureText(txt).width, y + 108 + i * lh, 20, 34); }
  }
  return shown;
}
/** admin dashboard panel: rows of accounts, one highlighted for takeover */
export function adminPanel(x, y, w, h, lt, { rows = 6, pick = 2, granted = false } = {}) {
  panel(x, y, w, h, 20); titleBar(x, y, w, 'INTERNAL TOOLS');
  screen(x + 20, y + 70, w - 40, h - 90);
  const gy = (h - 130) / rows;
  for (let i = 0; i < rows; i++) {
    const ry = y + 95 + i * gy;
    const sel = i === pick;
    panel(x + 36, ry, w - 72, gy - 14, 10, sel ? C.redDark : C.well, sel ? C.red : C.panelEdge);
    avatar(x + 78, ry + gy / 2 - 10, 20, C.grayDark);
    monotype(['@obama', '@elonmusk', '@apple', '@BillGates', '@kanyewest', '@CocaCola'][i % 6], x + 120, ry + gy / 2 - 10, 30, C.white);
    if (sel) { monotype(granted ? 'TAKEOVER ✓' : 'SELECT', x + w - 70, ry + gy / 2 - 10, 28, granted ? C.red : C.yellow, 'right');
      if (!granted) { const b = 1 + 0.12 * Math.sin(lt * 9); ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(lt * 9));
        ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(x + 36 / b, ry, w - 72, gy - 14, 10 / b); ctx.stroke(); ctx.restore(); } }
  }
}
/** brick firewall wall (optional crack + opened lock) */
export function firewall(x, y, w, h, { crack = 0, open = false } = {}) {
  panel(x, y, w, h, 18, C.panelEdge, C.grayDark);
  const bh = 74, bw = 118;
  for (let r = 0; r * bh < h - 24; r++) for (let c = 0; c * bw < w - 24; c++) {
    const bx = x + 12 + c * bw + (r % 2 ? bw / 2 : 0), by = y + 12 + r * bh;
    if (bx + bw > x + w - 6) continue;
    ctx.fillStyle = (r + c) % 2 ? C.steel : C.steelDark;
    ctx.beginPath(); ctx.roundRect(bx + 4, by + 4, bw - 12, bh - 12, 8); ctx.fill();
  }
  if (crack > 0) { // glowing crack running down the middle
    ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.globalAlpha = clamp(crack * 2);
    const pts = [[x + w / 2, y - 10], [x + w / 2 - 40, y + h * 0.3], [x + w / 2 + 30, y + h * 0.55], [x + w / 2 - 20, y + h * 0.8], [x + w / 2 + 10, y + h + 10]];
    line(pts.slice(0, 1 + Math.round(crack * (pts.length - 1))), C.red, 14); ctx.globalAlpha = 1;
  }
  // padlock on top
  const px = x + w / 2, py = y - 34;
  ctx.strokeStyle = open ? C.red : C.yellow; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(px, py - 18, 40, Math.PI, 0); ctx.stroke();
  panel(px - 62, py - 18, 124, 96, 16, open ? C.red : C.gold, open ? C.redDark : C.goldDark);
  circle(px, py + 30, 14, C.ink);
}

// ---------- props ----------
/** world network: globe + nodes + arcs (the "internet" b-roll) */
export function globe(x, y, r, t, { nodes = 5, pulse = true } = {}) {
  circle(x, y, r, C.well); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 6; ctx.stroke();
  for (const [f, lw] of [[0.25, 4], [0.55, 4], [0.85, 4]]) {
    ctx.beginPath(); ctx.ellipse(x, y, r * f, r, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, r, r * f, 0, 0, TAU); ctx.stroke();
  }
  const pts = [];
  for (let i = 0; i < nodes; i++) { const an = (i / nodes) * TAU + t * 0.35;
    pts.push([x + Math.cos(an) * r * (0.4 + 0.55 * Math.abs(Math.sin(i * 2.3))), y + Math.sin(an * 1.3) * r * 0.8]); }
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length];
    ctx.globalAlpha = 0.6; line([a, [(a[0] + b[0]) / 2 + Math.sin(i * 3 + t) * 40, (a[1] + b[1]) / 2 - 40], b], C.cyan, 4); ctx.globalAlpha = 1; }
  for (const p of pts) { circle(p[0], p[1], 10, C.cyan);
    if (pulse) { const k = (t * 1.4 + p[0]) % 1; circle(p[0], p[1], 10 + k * 26, C.cyan); ctx.globalAlpha = (1 - k) * 0.5; circle(p[0], p[1], 10 + k * 26, C.cyan); ctx.globalAlpha = 1; } }
}
/** dollar stack: cash bundles + coins, grows with `n` */
export function cash(x, y, s, n = 3, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const bills = [];
  for (let i = 0; i < n; i++) { const bob = Math.sin(t * 3 + i) * 5, by = -20 - i * 40 + bob;
    panel(-130 + i * 10, by, 260, 60, 10, i % 2 ? C.goldDark : C.gold, C.goldDark);
    bills.push([i * 10, by]); }
  ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.ink;
  for (const [bx, by] of bills) ctx.fillText('$100', bx, by + 32); // text after all bills, never covered
  for (let i = 0; i < 3; i++) { circle(-40 + i * 45, 64, 27, C.goldDark); circle(-40 + i * 45, 60, 22, C.gold); }
  ctx.restore();
}
/** money counter bar */
export function counter(x, y, val, lt, w = 560) {
  panel(x - w / 2, y - 52, w, 104, 20, C.well, C.green);
  monotype('$' + Math.round(val).toLocaleString('en-US'), x, y, 62, C.green, 'center');
  if (Math.sin(lt * 30) > 0) ctx.fillStyle = C.green; // blinking caret
}
/** police cuffs (arrest) */
export function cuffs(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 26; ctx.strokeStyle = C.steel;
  ctx.beginPath(); ctx.arc(-110, 0, 80, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(110, 0, 80, 0, TAU); ctx.stroke();
  line([[-30, 10], [30, 10]], C.steel, 18); circle(-110, 0, 34, C.panelEdge); circle(110, 0, 34, C.panelEdge);
  ctx.restore();
}
/** case-file card (name, photo, charge) */
export function caseCard(x, y, s, { name = 'GRAHAM CLARK', age = 'AGE 17', city = 'TAMPA, FLORIDA' } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.02); ctx.scale(s, s);
  panel(-260, -300, 520, 600, 24, C.panel, C.panelEdge);
  ctx.fillStyle = C.well; ctx.beginPath(); ctx.roundRect(-210, -250, 420, 320, 16); ctx.fill();
  person({ x: 0, y: 60, s: 0.62, hood: true, mouth: 'smirk' });
  pill(name, 0, 170, 44, C.red, C.white);
  pill(age, -120, 240, 30, C.panelEdge, C.gray); pill(city, 110, 240, 30, C.panelEdge, C.gray);
  ctx.restore();
}
/** breaking-news bar above the caption zone */
export function newsBar(y, lt, text = 'WORLD\'S BIGGEST ACCOUNTS HIJACKED') {
  const w = W + 40, slide = lerp(w, 0, eo(clamp(lt / 0.45)));
  ctx.save(); ctx.translate(-slide, 0);
  ctx.fillStyle = C.red; ctx.fillRect(-20, y, w, 110);
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.roundRect(30, y + 26, 200, 58, 12); ctx.fill();
  ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = C.red; ctx.fillText('BREAKING', 130, y + 56);
  ctx.fillStyle = C.white; ctx.textAlign = 'left'; ctx.font = '900 34px Inter';
  ctx.fillText(text, 260, y + 56); ctx.restore();
}
/** location pin dropping onto a map card */
export function pin(x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, -70, 70, Math.PI * 0.78, Math.PI * 0.22); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
  circle(0, -74, 26, C.white); ctx.restore();
}
/** a small dotted map card (USA-ish blob) */
export function mapCard(x, y, w, h, t, pins = []) {
  panel(x, y, w, h, 20, C.panel, C.panelEdge);
  ctx.fillStyle = C.panelEdge;
  for (let i = 0; i < 220; i++) { const px = x + 30 + rnd(i) * (w - 60), py = y + 30 + rnd(i + 500) * (h - 60);
    if (Math.hypot((px - x - w / 2) / (w / 2.4), (py - y - h / 2) / (h / 2.6)) < 1) circle(px, py, 5, C.grayDark); }
  for (const p of pins) pin(p[0], p[1], 1.1, 1);
}
/** big red scanner sweep over a screen (used on dashboards) */
export function sweep(x, y, w, h, t) {
  const yy = y + ((t * 130) % (h + 80)) - 40;
  ctx.fillStyle = C.cyan; ctx.globalAlpha = 0.10; ctx.fillRect(x, yy - 26, w, 52);
  ctx.globalAlpha = 0.55; ctx.fillRect(x, yy - 2, w, 4); ctx.globalAlpha = 1;
}

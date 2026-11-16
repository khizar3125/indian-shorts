// Desi Skit engine: canvas, palette, math and drawing primitives.
// Every drawing function in the kit uses the shared `ctx` exported here (set once by main.js).
export const W = 1080, H = 1920, FPS = 30;
export let ctx = null;
export function setCtx(c) { ctx = c; }

// The style sheet palette. Only these (plus the derived shades) appear on screen.
// Desi Skit: bright, sunny, warm — a gully/school/home comedy world. One accent per meaning:
// red = anger/danger · green = money/OK · yellow = the caption keyword + comedy bursts · blue = uniform/chat.
export const C = {
  bg: '#FFE9BC', bgDusk: '#F7D08A', panel: '#FFF6E3', panelEdge: '#C98A4B', screen: '#FFF9EC', well: '#F2DCB1',
  red: '#E63946', redDark: '#B3202C', green: '#2E9E5B', greenDark: '#1F7A43', cyan: '#3FB8C4', cyanDark: '#2A8A94',
  yellow: '#FFC93C', yellowDark: '#D19A00', blue: '#2D6CDF', blueDark: '#1E4FA8', orange: '#FF8A3D', orangeDark: '#D2691E',
  ink: '#3A2415', white: '#FFFFFF', gray: '#8A6F5A', grayDark: '#6B5443',
  skin: '#E8B486', skinShade: '#C98F63', hair: '#241A12', shirt: '#FFFFFF', pants: '#1E3A5F',
  steel: '#9AA0A6', steelDark: '#6E747A', gold: '#F5C542', goldDark: '#C79A25', chalk: '#FFFDF5',
  maroon: '#8E2F3C', teal: '#2A9D8F',
};

// The DESI font (Baloo 2 covers Devanagari + Latin, bold rounded comedy look). Captions and big text use it.
export const FONT = 'Baloo2';

// ---------- math ----------
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const TAU = Math.PI * 2;

// ---------- primitives ----------
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function ell(x, y, rx, ry, fill, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function line(pts, color, w) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
export function fillAll(color) { ctx.fillStyle = color; ctx.fillRect(-300, -300, W + 600, H + 600); }
/** outlined bold text (the caption look), centred at x, y */
export function bigText(text, x, y, size, fill = C.white, rot = 0, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = C.ink; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}

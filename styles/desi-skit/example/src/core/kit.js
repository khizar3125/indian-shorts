// Desi Skit component zoo: flat "gully / school / ghar" comedy pieces drawn with the shared ctx.
// Rules (STYLE.md): flat fills only, warm sunny palette, thick ink outlines on chrome only,
// red = anger/danger · green = money/OK · yellow = caption keyword + comedy bursts · blue = uniform/chat.
import { ctx, C, W, H, FONT, TAU, clamp, lerp, seg, eo, eob, rnd, circle, ell, line, fillAll, bigText } from './lib.js';

// ---------- shared chrome ----------
export function panel(x, y, w, h, r = 22, fill = C.panel, edge = C.panelEdge) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = edge; ctx.stroke();
}
/** rounded label pill (character name tags, HA HA, labels) */
export function pill(text, x, y, size, bg = C.ink, fg = C.white, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `800 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + size * 0.9, h = size * 1.7;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.lineWidth = size * 0.08; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = fg; ctx.fillText(text, 0, size * 0.08); ctx.restore();
  return { w: w * sc, h: h * sc };
}
/** character name tag: "PAPA", "SHARMA JI" — pops with sc */
export function nameTag(text, x, y, col = C.ink, sc = 1) { return pill(text, x, y, 40, col, C.white, sc); }
/** plain bold text helper */
export function text(str, x, y, size, col = C.ink, align = 'left', wgt = 800) {
  ctx.font = `${wgt} ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.fillStyle = col; ctx.fillText(str, x, y);
}

// ---------- worlds (backdrops) ----------
/** sunny gully: sky, sun, flat buildings, chai tapri awning, ground */
export function street(t = 0) {
  fillAll('#BEE3F0');                                   // sky
  circle(880, 220, 95, C.gold);                          // sun
  ctx.globalAlpha = 0.35; circle(880, 220, 130, C.gold); ctx.globalAlpha = 1;
  for (let i = 0; i < 3; i++) {                          // puffy clouds
    const cx = 150 + i * 340 + Math.sin(t * 0.2 + i) * 12;
    circle(cx, 150 + (i % 2) * 60, 42, C.white); circle(cx + 40, 165 + (i % 2) * 60, 32, C.white); circle(cx - 40, 165 + (i % 2) * 60, 30, C.white);
  }
  // buildings row
  for (const [bx, bw, bh, col] of [[-40, 300, 620, '#F2B26B'], [280, 240, 520, '#E88F5A'], [540, 300, 660, '#F2C078'], [860, 260, 560, '#E8A26B']]) {
    ctx.fillStyle = col; ctx.fillRect(bx, 940 - bh, bw, bh);
    ctx.fillStyle = C.well;                             // windows
    for (let r = 0; r < 3; r++) for (let c = 0; c < Math.floor(bw / 130); c++)
      ctx.fillRect(bx + 34 + c * 130, 940 - bh + 60 + r * 150, 62, 84);
  }
  // chai tapri awning (striped)
  ctx.fillStyle = C.red; ctx.fillRect(700, 760, 380, 26);
  for (let i = 0; i < 6; i += 2) { ctx.fillStyle = C.white; ctx.fillRect(700 + i * 63, 760, 63, 26); }
  // ground
  ctx.fillStyle = C.bgDusk; ctx.fillRect(-300, 940, W + 600, H);
  ctx.fillStyle = C.panelEdge; ctx.globalAlpha = 0.35;
  for (let x = -300; x < W + 300; x += 90) ctx.fillRect(x, 940, 46, 8); ctx.globalAlpha = 1;
}
/** living room: warm wall, window, wall clock, framed family photo */
export function home(lt = 0) {
  fillAll('#F2C078');
  ctx.fillStyle = '#E8A85E'; ctx.fillRect(-300, 1250, W + 600, H);          // floor
  panel(80, 260, 400, 340, 20, '#9ED8F0', C.panelEdge);                     // window
  line([[280, 260], [280, 600]], C.panelEdge, 10); line([[80, 430], [480, 430]], C.panelEdge, 10);
  const sun = circle; sun(400, 330, 34, C.gold);                            // sun in window
  // wall clock (hands move a little with lt)
  circle(760, 340, 84, C.white); circle(760, 340, 84, C.white); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(760, 340, 84, 0, TAU); ctx.stroke();
  line([[760, 340], [760, 290]], C.ink, 10); line([[760, 340], [795, 360]], C.ink, 8);
  // framed family photo
  panel(560, 620, 240, 300, 12, C.goldDark, C.ink);
  ctx.fillStyle = C.panel; ctx.fillRect(585, 645, 190, 220);
  circle(640, 730, 26, C.skin); circle(710, 730, 26, C.skin);
  ctx.beginPath(); ctx.arc(675, 830, 40, Math.PI, 0); ctx.fillStyle = C.maroon; ctx.fill();
}
/** classroom: wall, blackboard with chalk text, notice board strip */
export function classroom(board = []) {
  fillAll('#C9E4D0');
  ctx.fillStyle = '#B7D8BE'; ctx.fillRect(-300, 1300, W + 600, H);          // floor
  panel(90, 240, 900, 560, 18, '#2E5D3A', '#7A4A22');                       // blackboard with wooden frame
  ctx.fillStyle = '#274F31'; ctx.fillRect(120, 270, 840, 500);
  board.forEach((l, i) => text(l, 540, 380 + i * 110, 74, C.chalk, 'center', 700));
  // chalk ledge
  ctx.fillStyle = '#7A4A22'; ctx.fillRect(110, 800, 860, 26);
  ctx.fillStyle = C.white; ctx.fillRect(160, 788, 90, 14);
}

// ---------- people ----------
/**
 * The one desi flat figure. origin = chest centre, ~1000 px tall at s:1.
 * role presets: papa · teacher · student · mom · sharma · aunty · kid (or pass raw opts)
 * moods: flat smile smirk grin o sad shock angry wink cry
 * arms: down up phone point fold hip raise
 */
export function guy({ x, y, s = 1, role = 'papa', mood = 'flat', look = 0, arm = 'down', flip = 1, t = 0, talk = false } = {}) {
  const P = {
    // core cast
    papa:   { shirt: '#C9A227', pants: '#5A4632', kurta: true, mustache: true, hair: C.hair },
    sharma: { shirt: '#8E9BD6', pants: '#4A4237', kurta: true, mustache: true, glasses: true, hair: C.hair },
    teacher:{ shirt: C.teal, pants: '#4A4237', kurta: true, glasses: true, mustache: false, hair: C.hair },
    student:{ shirt: C.white, pants: '#1E3A5F', kurta: false, mustache: false, hair: C.hair, bag: true, cap: true },
    mom:    { saree: true, hair: C.hair },
    aunty:  { saree: true, hair: C.hair, glasses: true },
    kid:    { shirt: C.orange, pants: '#4A4237', kurta: false, mustache: false, hair: C.hair },
    // the full family (the asset-pack cast) — pick these for family skits
    dada:   { shirt: C.white, pants: '#5A4632', kurta: true, beardFull: true, glasses: true, hair: '#B9B3A8', cane: true },
    dadi:   { saree: true, hair: '#B9B3A8', glasses: true, sareeCol: '#9B6BA8' },
    ammi:   { saree: true, hair: C.hair, sareeCol: '#2A9D8F', glasses: false },
    tau:    { shirt: '#8E2F3C', pants: '#4A4237', kurta: true, mustache: true, turban: '#D2691E', hair: C.hair },
    chacha: { shirt: '#2E9E5B', pants: '#4A4237', kurta: true, mustache: true, hair: C.hair },
    bhaiya: { shirt: C.blue, pants: '#33413F', kurta: false, mustache: false, hair: C.hair },
    bhabhi: { saree: true, hair: C.hair, sareeCol: '#E63946' },
    khizar: { shirt: C.yellow, pants: '#4A4237', kurta: false, mustache: false, hair: C.hair, bag: true },
    behan:  { shirt: '#E884B8', pants: '#8E2F3C', kurta: false, mustache: false, hair: C.hair, pig: true },
    chhotu: { shirt: C.orange, pants: '#4A4237', kurta: false, mustache: false, hair: C.hair, pig: false },
  }[role] || {};
  const shirt = P.shirt || C.orange, pants = P.pants || '#4A4237', kurta = P.kurta;
  // THE LIFE: breathing bob + a blink cycle + talking mouth flaps (all from film time t — deterministic)
  const bob = Math.sin(t * 2.2 + x * 0.013) * 5;
  const blink = ((t * 0.37 + rnd(Math.floor(x) * 3.7)) % 1) < 0.055;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(s * flip, s);
  // ground shadow (drawn first, static — the body breathes above it)
  ell(0, 620, 155, 30, 'rgba(58,36,21,0.16)');
  // legs (saree = one drape panel instead)
  const sc = P.sareeCol || (role === 'mom' ? C.maroon : C.teal);
  if (P.saree) {
    ctx.fillStyle = sc;
    ctx.beginPath(); ctx.roundRect(-110, 60, 220, 520, 40); ctx.fill();
    ctx.fillStyle = C.goldDark; ctx.fillRect(-110, 380, 220, 26);          // border
  } else {
    ctx.fillStyle = pants;
    ctx.beginPath(); ctx.roundRect(-95, 130, 78, 400, 30); ctx.fill();
    ctx.beginPath(); ctx.roundRect(17, 130, 78, 400, 30); ctx.fill();
    ctx.fillStyle = '#3B2A1E';
    ctx.beginPath(); ctx.roundRect(-115, 500, 110, 56, 24); ctx.fill();    // shoes
    ctx.beginPath(); ctx.roundRect(5, 500, 110, 56, 24); ctx.fill();
  }
  // torso (kurta = longer, with a placket line)
  const th = kurta || P.saree ? 400 : 330;
  if (P.saree) {
    ctx.fillStyle = sc;
    ctx.beginPath(); ctx.roundRect(-125, -60, 250, 300, 60); ctx.fill();
    ctx.fillStyle = P.pallu || C.gold;                                     // pallu across
    ctx.beginPath(); ctx.moveTo(30, -60); ctx.lineTo(130, 240); ctx.lineTo(40, 240); ctx.lineTo(-40, -60); ctx.fill();
  } else {
    ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(-135, -60, 270, th, 60); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-135, th - 60, 270, 44);
    line([[0, -40], [0, 120]], 'rgba(0,0,0,0.25)', 6);                     // placket
  }
  // ink outlines (storybook rule: clothes get a warm dark contour)
  ctx.lineWidth = 7; ctx.strokeStyle = C.ink;
  if (P.saree) { ctx.beginPath(); ctx.roundRect(-125, -60, 250, 640, 40); ctx.stroke(); }
  else { ctx.beginPath(); ctx.roundRect(-135, -60, 270, th, 60); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-95, 130, 78, 400, 30); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(17, 130, 78, 400, 30); ctx.stroke(); }
  if (P.cane) { // dada ji's walking stick, in the far hand
    line([[150, 110], [172, 520]], '#8A5A2B', 14); ctx.beginPath(); ctx.arc(172, 528, 10, 0, TAU); ctx.fillStyle = '#8A5A2B'; ctx.fill();
  }
  // arms
  const arms = { down: [0.7, 0.7], up: [-1.2, -1.2], phone: [-1.15, 0.7], point: [-1.35, 0.7], fold: [2.5, -2.5], hip: [0.5, -1.4], raise: [2.6, 2.6] }[arm] || [0.7, 0.7];
  [[1, arms[0]], [-1, arms[1]]].forEach(([ax, aA]) => {
    ctx.save(); ctx.translate(ax * 135, 30); ctx.rotate(ax * aA);
    ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(-34, -34, 240, 68, 34); ctx.fill();
    circle(206, 0, 30, C.skin);                                            // hand
    ctx.restore();
  });
  if (arm === 'fold') { // forearms crossed in front
    ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(-150, 90, 300, 62, 30); ctx.fill();
    circle(-120, 121, 28, C.skin); circle(120, 121, 28, C.skin);
  }
  // head (storybook look: bigger head, thick ink outline, soft gloss)
  const hy = -180, lr = clamp(look, -1, 1) * 12;
  circle(0, hy, 126, C.skin);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, hy, 126, 0, TAU); ctx.stroke();
  ctx.globalAlpha = 0.18; ell(-40, hy - 70, 58, 32, C.white); ctx.globalAlpha = 1;   // top-left gloss
  // hair
  if (P.saree) { ctx.beginPath(); ctx.arc(0, hy - 10, 130, Math.PI * 0.86, Math.PI * 2.14); ctx.fillStyle = C.hair; ctx.fill();
    circle(88, hy - 66, 48, C.hair); }                                     // bun
  else { ctx.beginPath(); ctx.arc(0, hy - 14, 128, Math.PI * 0.95, Math.PI * 2.05); ctx.fillStyle = P.hair || C.hair; ctx.fill(); }
  if (P.pig) { circle(-112, hy + 14, 34, C.hair); circle(112, hy + 14, 34, C.hair); }   // pigtails
  if (P.cap) { // school cap
    ctx.fillStyle = C.blueDark; ctx.beginPath(); ctx.arc(0, hy - 66, 112, Math.PI, 0); ctx.fill();
    ctx.fillRect(-112, hy - 76, 224, 22); ctx.fillStyle = C.gold; circle(0, hy - 120, 15, C.gold);
  }
  if (P.turban) { ctx.fillStyle = P.turban === true ? C.orange : P.turban; ctx.beginPath(); ctx.arc(0, hy - 44, 128, Math.PI, 0); ctx.fill(); ctx.fillRect(-128, hy - 54, 256, 32); }
  if (P.beardFull) { // the grandpa: full white beard under the mouth
    ctx.beginPath(); ctx.moveTo(-92, hy + 26); ctx.quadraticCurveTo(0, hy + 210, 92, hy + 26);
    ctx.quadraticCurveTo(0, hy + 96, -92, hy + 26); ctx.fillStyle = '#E8E4DC'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  }
  // face — glossy storybook eyes (sclera + iris + pupil + two sparkles), blink-aware
  const ec = C.ink;
  if (P.glasses) { ctx.strokeStyle = ec; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(-48 + lr, hy - 12, 34, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(48 + lr, hy - 12, 34, 0, TAU); ctx.stroke(); line([[lr - 14, hy - 12], [lr + 14, hy - 12]], ec, 7); }
  // eyebrows (the mood lives here)
  ctx.strokeStyle = ec; ctx.lineWidth = 12; ctx.lineCap = 'round';
  const brow = { angry: 26, shock: -18, sad: -14, smirk: 8, wink: 0, cry: -10 }[mood] ?? 0;
  if (mood === 'angry') { line([[lr - 66, hy - 56], [lr - 20, hy - 40]], ec, 12); line([[lr + 66, hy - 56], [lr + 20, hy - 40]], ec, 12); }
  else if (mood === 'shock') { line([[lr - 62, hy - 60], [lr - 22, hy - 66]], ec, 12); line([[lr + 22, hy - 66], [lr + 62, hy - 60]], ec, 12); }
  else { line([[lr - 60, hy - 52 - brow / 2], [lr - 22, hy - 52 + brow / 2]], ec, 12); line([[lr + 22, hy - 52 + brow / 2], [lr + 60, hy - 52 - brow / 2]], ec, 12); }
  const eye = (ex) => {
    if (blink && mood !== 'wink' && mood !== 'cry') { line([[ex + lr - 20, hy - 10], [ex + lr + 20, hy - 10]], ec, 9); return; }
    if (mood === 'wink' && ex > 0) { line([[ex + lr - 20, hy - 10], [ex + lr + 20, hy - 10]], ec, 10); return; }
    circle(ex + lr, hy - 10, 21, C.white);
    ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(ex + lr, hy - 10, 21, 0, TAU); ctx.stroke();
    circle(ex + lr, hy - 8, 13, '#6B4A2E'); circle(ex + lr, hy - 6, 7, C.ink);
    circle(ex + lr - 5, hy - 14, 4.5, C.white); circle(ex + lr + 6, hy - 2, 2.5, C.white);   // sparkles
  };
  eye(-48); eye(48);
  // blush cheeks
  ell(-80 + lr, hy + 38, 17, 11, 'rgba(226,110,110,0.30)'); ell(80 + lr, hy + 38, 17, 11, 'rgba(226,110,110,0.30)');
  // mustache / beard
  if (P.mustache) { ctx.beginPath(); ctx.ellipse(lr, hy + 30, 46, 15, 0, 0, TAU); ctx.fillStyle = P.hair || C.hair; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
  if (P.beard) { ctx.beginPath(); ctx.ellipse(lr, hy + 54, 66, 42, 0, 0, Math.PI); ctx.fillStyle = P.hair || C.hair; ctx.fill(); }
  // mouth (when the character speaks, the mouth flaps at ~8 Hz on top of the mood)
  const flap = talk && Math.sin(t * 16 + x * 0.021) > 0;
  ctx.lineWidth = 10;
  if (mood === 'smile') { ctx.beginPath(); ctx.arc(lr, hy + 34, 26, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  else if (mood === 'smirk') { ctx.beginPath(); ctx.arc(lr - 6, hy + 30, 24, 0.1 * Math.PI, 0.75 * Math.PI); ctx.stroke(); }
  else if (mood === 'grin') { ctx.fillStyle = ec; ctx.beginPath(); ctx.roundRect(lr - 34, hy + 26, 68, flap ? 30 : 22, 11); ctx.fill(); }
  else if (flap || mood === 'o' || mood === 'shock') { ctx.fillStyle = ec; ctx.beginPath(); ctx.ellipse(lr, hy + 42, flap ? 15 : 18, flap ? 20 : 26, 0, 0, TAU); ctx.fill(); }
  else if (mood === 'sad' || mood === 'cry') { ctx.beginPath(); ctx.arc(lr, hy + 58, 26, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
  else if (mood === 'angry') { line([[lr - 24, hy + 52], [lr + 24, hy + 44]], ec, 10); }
  else line([[lr - 22, hy + 42], [lr + 22, hy + 42]], ec, 10);
  ctx.restore();
}

// ---------- props ----------
/** school desk with bench */
export function desk(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#8A5A2B'; ctx.beginPath(); ctx.roundRect(-190, -40, 380, 36, 10); ctx.fill();
  ctx.fillStyle = '#6E441F'; ctx.fillRect(-170, 0, 26, 200); ctx.fillRect(144, 0, 26, 200);
  ctx.beginPath(); ctx.roundRect(-150, 90, 300, 30, 8); ctx.fill();       // bench seat
  ctx.restore();
}
/** exam / report paper with wobble */
export function paper(x, y, s, { lines = 3, wobble = 0, red = false } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(wobble * 0.05); ctx.scale(s, s);
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.roundRect(-150, -200, 300, 400, 14); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = red ? C.red : C.panelEdge; ctx.stroke();
  for (let i = 0; i < lines; i++) line([[-110, -120 + i * 70], [110 - (i % 2) * 40, -120 + i * 70]], C.grayDark, 10);
  ctx.restore();
}
/** cutting chai glass with steam */
export function chai(x, y, s, { steam = false, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-70, -120); ctx.lineTo(70, -120); ctx.lineTo(52, 120); ctx.lineTo(-52, 120); ctx.closePath();
  ctx.fillStyle = '#E8F4F8'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.panelEdge; ctx.stroke();
  ctx.fillStyle = '#B9722E';                                              // chai
  ctx.beginPath(); ctx.moveTo(-64, -60); ctx.lineTo(64, -60); ctx.lineTo(52, 116); ctx.lineTo(-52, 116); ctx.closePath(); ctx.fill();
  if (steam) for (let i = 0; i < 3; i++) { const k = ((t * 0.9 + i / 3) % 1);
    ctx.globalAlpha = 0.5 * (1 - k); circle(-20 + i * 20 + Math.sin(k * 6 + i) * 8, -150 - k * 80, 12 + k * 14, C.white); ctx.globalAlpha = 1; }
  ctx.restore();
}
/** tawa with roti (burnt = the wife comedy) */
export function tawa(x, y, s, { burn = false, smoke = 0, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 0, 190, 60, C.steelDark); ell(0, -10, 170, 46, C.steel);         // tawa
  circle(0, -22, 74, burn ? '#4A3325' : '#E8C88F');                       // roti
  if (burn) { circle(-24, -34, 12, '#2A1D12'); circle(20, -12, 15, '#2A1D12'); circle(-4, 4, 9, '#2A1D12'); }
  else for (let i = 0; i < 5; i++) circle(-40 + i * 20 + (i % 2) * 10, -30 + (i % 3) * 14, 5, '#C99A55');
  for (let i = 0; i < 4; i++) { const k = ((t * 0.7 + i / 4) % 1);       // smoke puffs
    ctx.globalAlpha = smoke * (1 - k) * 0.8; circle(-30 + i * 20 + Math.sin(k * 5 + i) * 10, -80 - k * 140, 14 + k * 22, C.grayDark); ctx.globalAlpha = 1; }
  ctx.restore();
}
/** pressure cooker with whistle (mummy's phone-ring substitute) */
export function cooker(x, y, s, { whistle = false, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.steel; ctx.beginPath(); ctx.roundRect(-120, -80, 240, 240, 40); ctx.fill();
  ctx.fillStyle = C.steelDark; ctx.beginPath(); ctx.roundRect(-130, -96, 260, 40, 18); ctx.fill();
  ctx.fillStyle = C.steelDark; ctx.fillRect(-30, -150, 60, 60);           // top pipe
  circle(0, -150, 34, C.steel); circle(0, -150, 14, C.steelDark);
  ctx.fillStyle = C.blackish ?? C.ink; ctx.beginPath(); ctx.moveTo(96, 40); ctx.lineTo(130, 80); ctx.lineTo(96, 80); ctx.closePath(); ctx.fill(); // handle
  if (whistle) { const k = (t * 2.2) % 1;                                 // steam jet
    ctx.globalAlpha = 0.85 * (1 - k);
    for (let i = 0; i < 3; i++) circle((i - 1) * 16 * k * 3, -210 - k * 190, 16 + k * 30, C.white);
    ctx.globalAlpha = 1;
    bigText('SEETI!', 130, -220, 60, C.yellow, 0.1, eob(seg(k, 0, 0.2))); }
  ctx.restore();
}
/** the flying chappal — desi's guided missile */
export function chappal(x, y, s, angle = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
  ell(0, 0, 130, 62, C.orange); ell(0, -6, 96, 40, C.yellowDark);         // sole + strap base
  ctx.strokeStyle = C.orangeDark; ctx.lineWidth = 16; ctx.lineCap = 'round';
  line([[0, -30], [-42, 8]], C.orangeDark, 16); line([[0, -30], [42, 8]], C.orangeDark, 16); // V strap
  ctx.restore();
}
/** ₹500 note stack */
export function notes(x, y, s, n = 3, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < n; i++) { const bob = Math.sin(t * 3 + i) * 4;
    ctx.fillStyle = i % 2 ? '#8FCB8F' : '#7ABA78';
    ctx.beginPath(); ctx.roundRect(-120 + i * 8, -30 - i * 34 + bob, 240, 110, 12); ctx.fill();
    ctx.strokeStyle = '#3E7C4A'; ctx.lineWidth = 5; ctx.stroke();
    text('₹500', -10, 26 - i * 34 + bob, 40, '#2A5A34', 'center', 900); }
  ctx.restore();
}
/** cricket bat + ball */
export function bat(x, y, s, angle = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
  ctx.fillStyle = '#C9A227'; ctx.beginPath(); ctx.roundRect(-46, -230, 92, 300, 30); ctx.fill();
  ctx.fillStyle = '#8A5A2B'; ctx.beginPath(); ctx.roundRect(-24, 70, 48, 220, 20); ctx.fill();
  line([[-20, 60], [20, 60]], '#8A5A2B', 8);
  circle(0, 380, 40, C.red);                                              // ball resting by the handle
  ctx.restore();
}
/** classic Chetak-style scooter (the street hook) */
export function scooter(x, y, s, { wobble = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(-160, 190, 74, C.ink); circle(-160, 190, 40, C.steel);           // wheels
  circle(160, 190, 74, C.ink); circle(160, 190, 40, C.steel);
  ctx.fillStyle = C.teal;                                                 // body
  ctx.beginPath(); ctx.roundRect(-210, -30, 420, 190, [40, 40, 70, 70]); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-40, -190, 130, 200, 30); ctx.fill();    // front shield
  ctx.fillStyle = C.steel; ctx.beginPath(); ctx.roundRect(-30, -250, 110, 70, 24); ctx.fill(); // handlebar
  ctx.fillStyle = '#5A4632'; ctx.beginPath(); ctx.ellipse(0, -60, 120, 44, 0, Math.PI, 0); ctx.fill(); // seat
  ctx.fillStyle = C.well; circle(0, 30, 34, C.well);                      // spare-wheel cover
  ctx.restore();
}

// ---------- asset-pack extras ----------
/** starburst sticker: WOW! / LOL! / BOOM! / HA HA! — pops in with sc */
export function sticker(txt, x, y, s = 1, rot = 0, bg = C.yellow) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (let i = 0; i < 14; i++) { const an = i / 14 * TAU;                 // jagged star behind
    const r1 = 92, r2 = i % 2 ? 128 : 158;
    ctx.beginPath(); ctx.moveTo(Math.cos(an) * r1, Math.sin(an) * r1);
    ctx.lineTo(Math.cos(an + TAU / 28) * r2, Math.sin(an + TAU / 28) * r2);
    ctx.lineTo(Math.cos(an + TAU / 14) * r1, Math.sin(an + TAU / 14) * r1); ctx.closePath();
    ctx.fillStyle = bg; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke(); }
  circle(0, 0, 78, C.white);
  bigText(txt, 0, 4, txt.length > 4 ? 54 : 72, C.red);
  ctx.restore();
}
/** the classic yellow-black auto rickshaw */
export function autorickshaw(x, y, s, { t = 0, drive = false } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = drive ? Math.sin(t * 9) * 3 : 0;
  ctx.fillStyle = C.yellow;                                               // body
  ctx.beginPath(); ctx.moveTo(-150, 200); ctx.lineTo(-150, -60); ctx.quadraticCurveTo(-150, -220, 30, -230);
  ctx.quadraticCurveTo(200, -230, 210, -40); ctx.lineTo(220, 200); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.fillRect(-150, 40, 370, 40);                 // black band
  ctx.fillStyle = '#BEE3F0'; ctx.beginPath(); ctx.roundRect(-120, -190, 300, 150, 30); ctx.fill();  // windscreen
  ctx.lineWidth = 6; ctx.stroke();
  line([[-40, -190], [-40, -40]], C.ink, 6);                              // front pillar
  circle(-60, 200, 56, C.ink); circle(-60, 200, 26, C.steel);             // wheels
  circle(150, 200, 56, C.ink); circle(150, 200, 26, C.steel);
  ctx.restore();
}
/** a flat puffy cloud that drifts */
export function cloud(x, y, s = 1, t = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  const dx = Math.sin(t * 0.3) * 14;
  circle(x + dx, y, 44 * s, C.white); circle(x + dx + 46 * s, y + 10 * s, 34 * s, C.white); circle(x + dx - 46 * s, y + 12 * s, 30 * s, C.white);
  ell(x + dx, y + 22 * s, 84 * s, 26 * s, C.white);
  ctx.restore();
}

// ---------- WhatsApp-style chat ----------
/** chat UI card: msgs = [{me: bool, txt: str}], typing shows dots on the last bubble */
export function waChat(x, y, s, { name = 'पापा', msgs = [], typing = false, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#0B2A2E'; ctx.beginPath(); ctx.roundRect(-280, -400, 560, 800, 26); ctx.fill(); // phone-ish card
  ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(-280, -400, 560, 110, [26, 26, 0, 0]); ctx.fill();
  circle(-220, -345, 34, C.panel); text('👤', -220, -342, 34, C.ink, 'center', 400);
  text(name, -170, -345, 44, C.white, 'left', 800);
  ctx.fillStyle = '#E8E1D5'; ctx.beginPath(); ctx.roundRect(-280, -290, 560, 690, [0, 0, 26, 26]); ctx.fill();
  let by = -230;
  msgs.forEach((m, i) => {
    const wdt = Math.max(120, m.txt.length * 22 + 60), bx = m.me ? 250 - wdt : -250;
    const pop = eob(seg((t - i * 0.25) % 10, 0, 0.3));
    ctx.save(); ctx.globalAlpha = clamp(pop);
    ctx.fillStyle = m.me ? '#D6F5C6' : C.white;
    ctx.beginPath(); ctx.roundRect(bx, by, wdt, 76, 20); ctx.fill();
    text(m.txt, bx + wdt / 2, by + 40, 30, C.ink, 'center', 700);
    ctx.restore();
    by += 100;
  });
  if (typing) { ctx.fillStyle = C.white; ctx.beginPath(); ctx.roundRect(-250, by, 160, 66, 20); ctx.fill();
    for (let i = 0; i < 3; i++) circle(-215 + i * 34, by + 34, 9 + 3 * Math.sin((t * 6) + i), C.gray); }
  ctx.restore();
}

// ---------- graphics ----------
/** straight arrow (chalk style) */
export function arrow(x, y, len, angle = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(angle);
  line([[-len / 2, 0], [len / 2, 0]], C.chalk, 14); line([[len / 2, 0], [len / 2 - 44, -30]], C.chalk, 14);
  line([[len / 2, 0], [len / 2 - 44, 30]], C.chalk, 14); ctx.restore();
}
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
/** manga anger cross */
export function angerMark(x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.red; ctx.lineWidth = 14 * s; ctx.lineCap = 'round';
  line([[x - 46 * s, y - 46 * s], [x + 46 * s, y + 46 * s]], C.red, 14 * s);
  line([[x + 46 * s, y - 46 * s], [x - 46 * s, y + 46 * s]], C.red, 14 * s); ctx.restore();
}
/** sweat drop */
export function sweat(x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#7EC8F0';
  ctx.beginPath(); ctx.moveTo(x, y - 30 * s); ctx.quadraticCurveTo(x + 22 * s, y + 10 * s, x, y + 26 * s);
  ctx.quadraticCurveTo(x - 22 * s, y + 10 * s, x, y - 30 * s); ctx.fill(); ctx.restore();
}
/** floating HA HA pills (audience laughing) */
export function haha(x, y, s, t = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1;
    ctx.globalAlpha = a * (1 - k) * 0.9;
    pill(['HA HA', 'HA HA HA', 'HE HE'][(i + Math.floor(t)) % 3], x - 120 + i * 120, y - k * 220, 34, C.yellow, C.ink, 1); }
  ctx.restore();
}
/** dramatic zoom lines behind a character (the "savage moment") */
export function zoomLines(x, y, r, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a * 0.5;
  for (let i = 0; i < 16; i++) { const an = (i / 16) * TAU + t * 0.4;
    line([[x + Math.cos(an) * r * 0.55, y + Math.sin(an) * r * 0.55], [x + Math.cos(an) * (r + 40), y + Math.sin(an) * (r + 40)]], C.red, 14); }
  ctx.restore();
}
/** POV title card */
export function povCard(main, sub, pop = 1) {
  ctx.save();
  ctx.rotate(-0.03);
  pill('POV', 540, 620, 74, C.red, C.white, pop);
  ctx.rotate(0.03);
  bigText(main, 540, 820, 96, C.white, -0.02, pop);
  if (sub) bigText(sub, 540, 960, 66, C.yellow, 0.02, pop);
  ctx.restore();
}

// THE 17-YEAR-OLD WHO HACKED TWITTER — shot list (the per-video file, with script.json).
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) } · lt = time in shot, d = shot length.
// Cut = L(i) - 0.08 (picture changes just before its line). Sound cues land on their words.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, bigText } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

// faint dot-grid backdrop (the tech-file "control room" floor)
function grid(alpha = 1) {
  ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.save(); ctx.globalAlpha = 0.5 * alpha;
  for (let y = 60; y < 1260; y += 96) for (let x = 60; x < W; x += 96) { ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fillStyle = C.panelEdge; ctx.fill(); }
  ctx.restore();
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: the tweet goes out ────────────────────────────────────────
  {
    const st = cut(0), out = Wd('tweeted', 0) - st, st2 = Wd('twenty', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'phone with the giveaway post, BREAKING bar',
      draw(lt, d, t) {
        grid();
        K.globe(880, 180, 130, t, { nodes: 4, pulse: lt > st2 });
        const pop = eob(seg(lt, out, out + 0.25));
        K.phone(540, 700, 0.92, (sx, sy, sw, sh) => {
          K.panel(sx + 20, sy + 60, sw - 40, 130, 16, C.well, C.panelEdge);
          K.monotype('FOR YOU', sx + sw / 2, sy + 125, 28, C.white, 'center');
          if (lt > out) { K.post(sx + sw / 2, sy + 430, 0.72, { name: 'BARACK OBAMA', text: ['SEND $1,000, GET', '$2,000 RIGHT BACK'], hi: 1 }); }
          K.monotype('1:24 PM · JULY 15', sx + sw / 2, sy + 600, 22, C.grayDark, 'center');
        });
        if (lt > out) K.newsBar(1070, lt - out, 'OBAMA\'S ACCOUNT POSTS GIVEAWAY');
      } });
    cue(st, 'whoosh'); cue(st + out, 'pop'); cue(st + out + 0.3, 'tock');
  }

  // ── 2 · the biggest accounts join in ───────────────────────────────────
  {
    const st = cut(1), musk = Wd('musk', 1) - st, gates = Wd('gates', 1) - st, appl = Wd('apple', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.07, note: 'verified cards pop in on each name',
      draw(lt, d, t) {
        grid(); K.globe(540, 760, 460, t, { nodes: 6 });
        const cards = [
          ['ELON MUSK', 300, 480, musk], ['BILL GATES', 780, 480, gates], ['APPLE INC', 540, 880, appl]];
        for (const [name, x, y, at] of cards) {
          const p = eob(seg(lt, at, at + 0.25)); if (p <= 0) continue;
          ctx.save(); ctx.translate(x, y); ctx.rotate((name === 'APPLE' ? 0.03 : -0.03) * (1 - p));
          K.post(0, 0, 0.9 * p, { name, text: ['SEND $1,000, GET', '$2,000 RIGHT BACK'], hi: 1 }); ctx.restore();
        }
        K.pill('+ MORE...', 540, 1120, 34, C.panel, C.gray, eob(seg(lt, appl + 0.2, appl + 0.45)));
      } });
    cue(st, 'whoosh'); for (const at of [musk, gates, appl]) cue(st + at, 'pop', { gain: 0.7 });
  }

  // ── 3 · it wasn't them ─────────────────────────────────────────────────
  {
    const st = cut(2), x = Wd("wasn't", 2) - st - 0.05;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'red X slams over the card wall',
      draw(lt) {
        grid();
        for (const [name, px, py] of [['ELON MUSK', 300, 520], ['BILL GATES', 780, 520], ['APPLE INC', 540, 900]])
          K.post(px, py, 0.9, { name, text: ['SEND $1,000, GET', '$2,000 RIGHT BACK'], hi: 1 });
        const p = seg(lt, x, x + 0.2), sh = lt > x ? Math.sin(lt * 90) * 16 * Math.max(0, 1 - (lt - x) * 4) : 0;
        ctx.save(); ctx.translate(sh, 0); K.redX(540, 760, lerp(2.2, 1.5, eo(p)), clamp(p * 3)); ctx.restore();
        if (lt > x) bigText('FAKE', 540, 340, 110, C.red, -0.06, eob(seg(lt, x + 0.1, x + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + x + 0.1, 'slam');
  }

  // ── 4 · a 17-year-old kid from Florida ─────────────────────────────────
  {
    const st = cut(3), kid = Wd('seventeen', 3) - st, fl = Wd('florida', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 820], zoom: 0.08, note: 'hooded kid, 17 tag, pin drops on Florida',
      draw(lt) {
        grid();
        const p = eio(seg(lt, kid, kid + 0.5));
        K.person({ x: 400, y: 900, s: 1.25, hood: true, mouth: 'smirk', look: Math.sin(lt * 1.2) * 0.4 });
        K.pill('17', 660, 560, 90, C.yellow, C.ink, eob(seg(lt, kid, kid + 0.3)));
        K.mapCard(220, 950, 640, 260, lt, lt > fl ? [[680, 1060]] : []);
        K.tag('TAMPA', 300, 880, 680, 1060, 40, seg(lt, fl + 0.2, fl + 0.4));
      } });
    cue(st, 'whoosh'); cue(st + kid, 'pop'); cue(st + fl, 'thud', { gain: 0.7 });
  }

  // ── 5 · his name was Graham Clark ──────────────────────────────────────
  {
    const st = cut(4), name = Wd('graham', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 780], zoom: 0.09, note: 'case file card slides in',
      draw(lt) {
        grid();
        const p = eob(seg(lt, name, name + 0.3));
        ctx.save(); ctx.translate(lerp(900, 0, eio(seg(lt, name, name + 0.45))), 0);
        K.caseCard(540, 780, 1.05 * (p < 1 ? p : 1)); ctx.restore();
        K.tag('THE MASTERMIND', 790, 380, 700, 620, 44, seg(lt, name + 0.3, name + 0.55));
      } });
    cue(st, 'whoosh'); cue(st + name + 0.35, 'pop');
  }

  // ── 6 · not a single line of malware ───────────────────────────────────
  {
    const st = cut(5), mw = Wd('malware', 5) - st, type = Wd('write', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.06, note: 'fake code types itself, then NO MALWARE X',
      draw(lt) {
        grid();
        K.terminal(140, 480, 800, 560, lt, [
          { txt: '$ grep -r exploit .' }, { txt: '0 files found' }, { txt: '$ ps aux | grep hack' }, { txt: 'nothing.' }], (lt - type) * 2);
        K.pill('LINES OF MALWARE: 0', 540, 380, 40, C.well, C.cyan, eob(seg(lt, 0.15, 0.4)));
        if (lt > mw) { const p = seg(lt, mw, mw + 0.2); K.redX(540, 760, lerp(1.8, 1.15, eo(p)), clamp(p * 3)); }
      } });
    cue(st, 'whoosh'); cue(st + type, 'tock'); for (let k = 1; k < 4; k++) cue(st + type + k * 0.35, 'tock', { gain: 0.7 });
    cue(st + mw + 0.1, 'slam');
  }

  // ── 7 · he picked up the phone ─────────────────────────────────────────
  {
    const st = cut(6), pick = Wd('picked', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 820], zoom: 0.1, note: 'the phone rings, a hand lifts it',
      draw(lt) {
        grid();
        const rise = eio(seg(lt, pick, pick + 0.5));
        K.handPhone(540 + Math.sin(lt * 9) * (rise > 0.02 ? 4 : 14), lerp(980, 780, rise), 1.05,
          { ring: lt < pick + 0.2, lt });
        K.tag('A PHONE CALL', 820, 420, 540, 700, 46, seg(lt, pick + 0.2, pick + 0.45));
      } });
    cue(st, 'whoosh'); for (const k of [0, 0.5, 1.0]) cue(st + k, 'tock', { gain: 0.6 }); cue(st + pick + 0.4, 'pop');
  }

  // ── 8 · calling employees, pretending to be IT ─────────────────────────
  {
    const st = cut(7), call = Wd('called', 7) - st, pret = Wd('pretending', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 780], zoom: 0.08, note: 'incoming call: IT DEPARTMENT',
      draw(lt, d, t) {
        grid();
        K.person({ x: 950, y: 1050, s: 1.05, hood: true, mouth: lt > pret ? 'smirk' : 'flat', look: -0.6 });
        K.phone(420, 760, 1.05, (sx, sy, sw, sh, l) => K.callUI(sx, sy, sw, sh, l, { name: 'IT DEPARTMENT' }), lt - call);
        K.tag('"JUST FIXING YOUR LAPTOP"', 300, 380, 420, 460, 34, seg(lt, pret + 0.2, pret + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + call, 'tock'); cue(st + call + 0.4, 'tock', { gain: 0.7 }); cue(st + pret, 'pop', { gain: 0.7 });
  }

  // ── 9 · asking for login credentials ───────────────────────────────────
  {
    const st = cut(8), log = Wd('login', 8) - st, cred = Wd('credentials', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.12, note: 'VPN prompt, password dots fill',
      draw(lt) {
        grid();
        K.phone(540, 700, 1.15, (sx, sy, sw, sh) => K.credUI(sx, sy, sw, sh, { typed: clamp(seg(lt, log, log + 0.9)), field: 1 }), lt);
        K.tag('USERNAME + PASSWORD', 810, 400, 540, 300, 40, seg(lt, cred, cred + 0.3));
      } });
    cue(st, 'whoosh'); cue(st + log, 'tock'); cue(st + cred, 'pop');
  }

  // ── 10 · one of them typed it in ───────────────────────────────────────
  {
    const st = cut(9), typed = Wd('typed', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.16, note: 'close-up: password accepted, SIGN IN',
      draw(lt) {
        grid();
        K.phone(540, 680, 1.45, (sx, sy, sw, sh) => K.credUI(sx, sy, sw, sh, { typed: clamp(seg(lt, typed, typed + 0.35)), field: 1 }), lt);
        if (lt > typed + 0.4) { const p = eob(seg(lt, typed + 0.4, typed + 0.65));
          K.pill('ACCESS OK', 540, 1180, 40, C.green, C.ink, p); K.burst(540, 1180, 0.9, 1 - (p - 1) * 0.5); }
      } });
    cue(st, 'whoosh'); cue(st + typed, 'tock'); cue(st + typed + 0.45, 'pop', { gain: 0.8 });
  }

  // ── 11 · the internal admin tool ───────────────────────────────────────
  {
    const st = cut(10), tool = Wd('admin', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'INTERNAL TOOLS panel opens, account selected',
      draw(lt) {
        grid();
        const p = eio(seg(lt, 0.05, 0.4));
        ctx.save(); ctx.translate(0, lerp(120, 0, p)); ctx.globalAlpha = p;
        K.adminPanel(240, 420, 600, 640, lt, { pick: 2, granted: false }); ctx.restore();
        K.tag('EVERY ACCOUNT', 240, 360, 340, 470, 38, seg(lt, tool, tool + 0.3));
      } });
    cue(st, 'whoosh'); cue(st + tool, 'alarm', { dur: 1.2, gain: 0.6 });
  }

  // ── 12 · controls every account ────────────────────────────────────────
  {
    const st = cut(11), every = Wd('every', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.14, note: 'dashboard sweep, takeover granted',
      draw(lt, d, t) {
        grid();
        K.adminPanel(240, 380, 600, 680, lt, { pick: 2, granted: lt > every });
        K.sweep(240, 380, 600, 680, t);
        if (lt > every) { const p = eob(seg(lt, every, every + 0.3));
          K.pill('TAKEOVER ✓', 540, 1120, 42, C.red, C.white, p); K.burst(540, 1120, 0.8, (1 - p) * 1.4); }
      } });
    cue(st, 'whoosh'); cue(st + every, 'slam', { gain: 0.7 });
  }

  // ── 13 · 130 accounts, one scam ────────────────────────────────────────
  {
    const st = cut(12), scam = Wd('scam', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.12, note: 'the feed wall scrolls, SAME SCAM tag',
      draw(lt, d, t) {
        grid();
        K.feed(540, 700, t, { rows: 4, cols: 2, s: 0.6, dark: true });
        K.pill('130 ACCOUNTS HIJACKED', 540, 300, 40, C.red, C.white, eob(seg(lt, 0.1, 0.4)));
        K.tag('ONE SCAM', 820, 1020, 700, 900, 44, seg(lt, scam, scam + 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'zip'); cue(st + scam, 'pop');
  }

  // ── 14 · $117,000 pours in ─────────────────────────────────────────────
  {
    const st = cut(13), hun = Wd('hundred', 13) - st, pour = Wd('poured', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.1, note: 'counter runs to $117,000, cash stacks',
      draw(lt) {
        grid();
        const k = clamp(seg(lt, hun, pour));
        K.counter(540, 500, lerp(1000, 117000, eo(k)), lt);
        K.cash(430, 880, 1.0 + 0.12 * Math.sin(lt * 3), 2 + Math.round(k * 2.2), lt);
        if (k >= 1) { const p = eob(seg(lt, pour, pour + 0.3)); K.pill('IN ONE DAY', 540, 1140, 38, C.gold, C.ink, p); }
      } });
    cue(st, 'whoosh'); for (let k = hun; k < pour; k += 0.4) cue(st + k, 'tock', { gain: 0.5 });
    cue(st + pour, 'thud', { gain: 0.8 });
  }

  // ── 15 · the part people miss ──────────────────────────────────────────
  {
    const st = cut(14), miss = Wd('miss', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 780], zoom: 0.18, note: 'quiet beat: the kid, dim, WAIT...',
      draw(lt) {
        ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600);
        K.person({ x: 540, y: 1000, s: 1.5, hood: true, mouth: 'smirk', look: 0 });
        ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = C.bg;  // vignette: dim the edges
        ctx.fillRect(-300, -300, W + 600, 560); ctx.fillRect(-300, 1300, W + 600, 900); ctx.restore();
        if (lt > miss) bigText('WAIT...', 540, 400, 120, C.yellow, -0.05, eob(seg(lt, miss, miss + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + miss, 'boing', { gain: 0.5 });
  }

  // ── 16 · he never cracked Twitter's security ───────────────────────────
  {
    const st = cut(15), sec = Wd('security', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.08, note: 'the firewall stands intact, green check',
      draw(lt) {
        grid();
        K.firewall(240, 560, 600, 480, { crack: 0, open: false });
        if (lt > sec) { const p = eob(seg(lt, sec, sec + 0.3));
          K.pill('UNBROKEN', 540, 1130, 42, C.green, C.ink, p); K.burst(540, 1130, 0.8, (1 - p) * 1.4); }
      } });
    cue(st, 'whoosh'); cue(st + sec, 'sparkle', { dur: 0.9, gain: 0.6 });
  }

  // ── 17 · he cracked a person ───────────────────────────────────────────
  {
    const st = cut(16), crack = Wd('cracked', 16) - st, per = Wd('person', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 760], zoom: 0.14, note: 'a crack of light runs through the person',
      draw(lt) {
        grid();
        K.person({ x: 540, y: 880, s: 1.35, eyes: 'wide', mouth: 'o', brow: 1 });
        const p = seg(lt, crack, crack + 0.5);
        if (p > 0) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 16; ctx.lineCap = 'round';
          const pts = [[540, 250], [510, 560], [570, 800], [520, 1080], [548, 1320]];
          line(pts.slice(0, 1 + Math.round(p * (pts.length - 1))), C.red, 16);
          if (p > 0.9) { ctx.globalAlpha = 0.35; line(pts, C.red, 40); ctx.globalAlpha = 1; } ctx.restore(); }
        if (lt > per) { const p2 = eob(seg(lt, per, per + 0.25)); K.shockLines(540, 620, 330, p2); }
      } });
    cue(st, 'whoosh'); cue(st + crack, 'alarm', { dur: 1.0, gain: 0.7 }); cue(st + per, 'slam', { gain: 0.6 });
  }

  // ── 18 · the strongest firewall in the world ───────────────────────────
  {
    const st = cut(17), fw = Wd('firewall', 17) - st;
    add({ id: 'S18', at: st, cam: [540, 720], zoom: 0.06, note: 'globe + full firewall wall, padlock shut',
      draw(lt, d, t) {
        grid();
        K.globe(540, 700, 400, t, { nodes: 7 });
        K.firewall(220, 620, 640, 420, { crack: 0, open: false });
        K.tag('THE STRONGEST FIREWALL', 300, 380, 400, 620, 38, seg(lt, fw, fw + 0.3));
      } });
    cue(st, 'whoosh'); cue(st + fw, 'pop');
  }

  // ── 19 · ...is a human who answers the phone ───────────────────────────
  {
    const st = cut(18), phone = Wd('phone', 18) - st;
    add({ id: 'S19', at: st, cam: [540, 780], zoom: 0.1, note: 'phone rings against the wall, loop',
      draw(lt) {
        grid();
        K.firewall(160, 300, 760, 560, { crack: 0, open: false });
        K.handPhone(540, 1000 + Math.sin(lt * 9) * 8, 0.95, { ring: true, lt });
        if (lt > phone) K.pill('STILL RINGING', 540, 1180, 38, C.red, C.white, eob(seg(lt, phone, phone + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'tock'); cue(st + 0.8, 'tock', { gain: 0.7 });
    cue(st + phone, 'pop'); cue(st + phone + 0.5, 'tock');
  }

  return { shots: S, cues: CUES };
}

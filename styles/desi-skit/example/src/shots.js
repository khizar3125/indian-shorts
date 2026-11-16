// टीचर बनाम राजू — desi comedy skit shot list (the per-video file, with script.json).
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) } · lt = time in shot, d = shot length.
// Cut = L(i) - 0.08 (picture changes just before its line). Sound cues land on their words.
// Characters: सर (teacher, hm_omega — speaks even lines) · राजू (student, hm_psi — speaks odd lines).
// Every guy() call passes t (breathing + blinking) and talk (the speaker's mouth flaps).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, bigText } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

const TEACHER = [300, 800], STUDENT = [790, 820];
const sir = (o) => K.guy({ role: 'teacher', ...o });
const rajoo = (o) => K.guy({ role: 'student', ...o });

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · सर asks the trap question; राजू giggles ──────────────────────────
  {
    const st = cut(0), q = Wd('धरती', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 660], zoom: 0.07, note: 'classroom: सर points at the board, राजू giggles',
      draw(lt, d, t) {
        K.classroom(['सवाल: धरती', 'गोल है या चपटी?']);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.52, mood: 'flat', arm: lt > q ? 'point' : 'hip', t, talk: true });
        K.nameTag('सर', TEACHER[0], TEACHER[1] - 460, C.teal, eob(seg(lt, 0.1, 0.4)));
        rajoo({ x: STUDENT[0], y: STUDENT[1], s: 0.5, mood: 'grin', arm: 'down', t });
        K.nameTag('राजू', STUDENT[0], STUDENT[1] - 440, C.blue, eob(seg(lt, 0.3, 0.6)));
        if (lt > q) K.haha(STUDENT[0], STUDENT[1] - 260, 1, lt, 0.8);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop'); cue(st + q, 'boing', { gain: 0.7 });
  }

  // ── 2 · राजू's savage reply: "सब चपट है" ─────────────────────────────────
  {
    const st = cut(1), num = Wd('नंबर', 1) - st, sap = Wd('चपट', 1) - st;
    add({ id: 'S02', at: st, cam: [STUDENT[0], 620], zoom: 0.12, note: 'close-up राजू smirk; 2/100 paper floats beside his face',
      draw(lt, d, t) {
        K.classroom(['सवाल: धरती', 'गोल है या चपटी?']);
        K.zoomLines(STUDENT[0], 620, 380, lt, lt > sap ? 0.5 : 0.15);
        rajoo({ x: STUDENT[0], y: 700, s: 0.72, mood: lt > sap ? 'smirk' : 'flat', look: -0.4, t, talk: true });
        if (lt > num) { // the marks paper rises beside him (never over the face)
          const p = eob(seg(lt, num, num + 0.3));
          ctx.save(); ctx.translate(STUDENT[0] - 330, lerp(1000, 460, eo(p))); ctx.rotate(0.08);
          K.paper(0, 0, p, { lines: 2 }); K.pill('2 / 100', 0, 0, 40, C.red, C.white); ctx.restore();
        }
      } });
    cue(st, 'whoosh'); cue(st + num, 'plop'); cue(st + sap, 'boing');
  }

  // ── 3 · सर: साइलेंस! जीरो मिलेगा ─────────────────────────────────────────
  {
    const st = cut(2), sil = Wd('साइलेंस!', 2) - st - 0.05;
    add({ id: 'S03', at: st, cam: [TEACHER[0], 560], zoom: 0.14, note: 'सर slams: साइलेंस! + जीरो pill',
      draw(lt, d, t) {
        K.classroom(['सवाल: धरती', 'गोल है या चपटी?']);
        const sh = lt > sil ? Math.sin(lt * 70) * 14 * Math.max(0, 1 - (lt - sil) * 3) : 0;
        ctx.save(); ctx.translate(sh, 0);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.62, mood: 'angry', arm: 'raise', t, talk: true });
        K.angerMark(TEACHER[0] + 150, TEACHER[1] - 380, 1.2, lt > sil ? 1 : 0);
        if (lt > sil) bigText('साइलेंस!', 540, 400, 150, C.red, -0.04, eob(seg(lt, sil, sil + 0.22)));
        K.shockLines(TEACHER[0], TEACHER[1] - 120, 260, lt > sil ? 0.9 : 0);
        const zp = eob(seg(lt, sil + 0.35, sil + 0.6));
        if (zp > 0) K.pill('जीरो', 760, 700, 64, C.red, C.white, zp);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + sil, 'slam'); cue(st + sil + 0.35, 'pop');
  }

  // ── 4 · राजू: जीरो के आगे दस लगा दीजिए ───────────────────────────────────
  {
    const st = cut(3), das = Wd('दस', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 600], zoom: 0.09, note: 'blackboard: 0, then a 1 slides in front → 10',
      draw(lt, d, t) {
        K.classroom([]);
        rajoo({ x: 190, y: 780, s: 0.42, mood: 'smirk', arm: 'up', t, talk: true });
        bigText('0', 560, 560, 300, C.chalk, 0, 1);
        const p = eob(seg(lt, das, das + 0.3));
        if (p > 0) { ctx.save(); ctx.globalAlpha = p; bigText('1', 560 - 190 * p, 560, 300, C.yellow, 0, p); ctx.restore();
          if (p >= 1) bigText('10', 540, 560, 300, C.yellow); ctx.globalAlpha = 1; }
        K.nameTag('राजू', 260, 440, C.blue, eob(seg(lt, 0.1, 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + das, 'tock'); cue(st + das + 0.3, 'sparkle', { gain: 0.8 });
  }

  // ── 5 · सर: ये कैसे? ─────────────────────────────────────────────────────
  {
    const st = cut(4), k = Wd('कैसे?', 4) - st - 0.05;
    add({ id: 'S05', at: st, cam: [TEACHER[0], 580], zoom: 0.16, note: 'सर confused, giant ? spins in',
      draw(lt, d, t) {
        K.classroom([]);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.7, mood: 'shock', arm: 'down', look: 0.6, t, talk: true });
        const p = eob(seg(lt, k, k + 0.3));
        if (p > 0) bigText('?', TEACHER[0] + 260, 420 - 30 * (1 - p), 340, C.yellow, Math.sin(lt * 3) * 0.06, p);
        K.sweat(TEACHER[0] - 190, TEACHER[1] - 400, 1.4, p);
      } });
    cue(st, 'whoosh'); cue(st + k, 'plop');
  }

  // ── 6 · राजू: जीरो की वैल्यू पीछे लगे नंबर से बढ़ती है ────────────────────
  {
    const st = cut(5), v = Wd('वैल्यू', 5) - st, b = Wd('बढ़', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 620], zoom: 0.1, note: 'blackboard maths: 0 → 10 with an arrow, sparkles',
      draw(lt, d, t) {
        K.classroom([]);
        rajoo({ x: 170, y: 760, s: 0.4, mood: 'grin', arm: 'point', t, talk: true });
        const p1 = eob(seg(lt, v - 0.1, v + 0.2)), p2 = eob(seg(lt, b, b + 0.3));
        bigText('0', 340, 560, 260, C.chalk, 0, p1);
        if (p1 >= 1) K.arrow(540, 560, 160, 0, 1);
        bigText('10', 740, 560, 260, C.yellow, 0, p2);
        if (p2 > 0) K.burst(740, 560, 1.3, p2);
      } });
    cue(st, 'whoosh'); cue(st + v, 'tock'); cue(st + b, 'sparkle');
  }

  // ── 7 · सर: पैरेंट्स मीटिंग में पापा को लेकर आओ ────────────────────────────
  {
    const st = cut(6), par = Wd('पैरेंट्स', 6) - st - 0.05;
    add({ id: 'S07', at: st, cam: [TEACHER[0], 600], zoom: 0.13, note: 'सर furious: पैरेंट्स मीटिंग! + desk thud',
      draw(lt, d, t) {
        K.classroom([]);
        const sh = lt > par ? Math.sin(lt * 60) * 12 * Math.max(0, 1 - (lt - par) * 3) : 0;
        ctx.save(); ctx.translate(sh, 0);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.66, mood: 'angry', arm: 'point', t, talk: true });
        K.desk(TEACHER[0] + 210, TEACHER[1] + 210, 1.05);
        K.angerMark(TEACHER[0] - 170, TEACHER[1] - 400, 1.3, 1);
        if (lt > par) K.pill('पैरेंट्स मीटिंग!', 540, 400, 56, C.red, C.white, eob(seg(lt, par, par + 0.25)));
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + par, 'slam', { gain: 0.8 });
  }

  // ── 8 · राजू: पापा नंबर लेकर नहीं आएंगे ───────────────────────────────────
  {
    const st = cut(7), n = Wd('नंबर', 7) - st;
    add({ id: 'S08', at: st, cam: [STUDENT[0], 640], zoom: 0.11, note: 'राजू deadpan shrug; नंबर? / नहीं! pills',
      draw(lt, d, t) {
        K.classroom([]);
        rajoo({ x: STUDENT[0], y: 760, s: 0.62, mood: 'flat', arm: 'down', t, talk: true });
        const p = eob(seg(lt, n, n + 0.3));
        if (p > 0) { K.pill('नंबर?', STUDENT[0], 460, 52, C.ink, C.white, p); K.pill('नहीं!', STUDENT[0] + 210, 460, 44, C.red, C.white, eob(seg(lt, n + 0.25, n + 0.5))); }
      } });
    cue(st, 'whoosh'); cue(st + n, 'pop');
  }

  // ── 9 · सर: मतलब? ────────────────────────────────────────────────────────
  {
    const st = cut(8), m = Wd('मतलब?', 8) - st - 0.05;
    add({ id: 'S09', at: st, cam: [TEACHER[0], 560], zoom: 0.18, note: 'hard zoom on सर: giant मतलब?',
      draw(lt, d, t) {
        K.classroom([]);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.78, mood: 'shock', arm: 'fold', look: -0.5, t, talk: true });
        const p = eob(seg(lt, m, m + 0.22));
        if (p > 0) bigText('मतलब?', 540, 380, 170, C.yellow, 0.03, p);
      } });
    cue(st, 'whoosh'); cue(st + m, 'tock');
  }

  // ── 10 · राजू: वो आपसे मिलकर खुद फेल हो जाएंगे ────────────────────────────
  {
    const st = cut(9), f = Wd('फेल', 9) - st - 0.05;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.13, note: 'the FAIL stamp slams on सर; zoom lines',
      draw(lt, d, t) {
        K.classroom([]);
        K.zoomLines(TEACHER[0], TEACHER[1] - 80, 420, lt, lt > f ? 0.65 : 0.15);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.6, mood: 'shock', arm: 'down', t });
        rajoo({ x: STUDENT[0], y: STUDENT[1], s: 0.44, mood: 'smirk', t, talk: true });
        if (lt > f) { const p = eob(seg(lt, f, f + 0.2));
          ctx.save(); ctx.translate(TEACHER[0], TEACHER[1] - 160); ctx.rotate(-0.12);
          ctx.globalAlpha = p; K.pill('फेल!', 0, 0, 84, C.red, C.white, p); ctx.globalAlpha = 1; ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + f, 'thud', { gain: 0.9 });
  }

  // ── 11 · सर: साइलेंस!! ────────────────────────────────────────────────────
  {
    const st = cut(10), sil = Wd('साइलेंस!!', 10) - st - 0.05;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.2, note: 'full-frame साइलेंस!! shake',
      draw(lt, d, t) {
        K.classroom([]);
        const sh = lt > sil ? Math.sin(lt * 80) * 20 * Math.max(0, 1 - (lt - sil) * 2.5) : 0;
        ctx.save(); ctx.translate(sh, sh * 0.4);
        sir({ x: TEACHER[0], y: TEACHER[1], s: 0.8, mood: 'angry', arm: 'raise', t, talk: true });
        if (lt > sil) bigText('साइलेंस!!', 540, 380, 210, C.red, 0.02, eob(seg(lt, sil, sil + 0.2)));
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + sil, 'slam');
  }

  // ── 12 · राजू's loop punchline ───────────────────────────────────────────
  {
    const st = cut(11), jab = Wd('जवाब', 11) - st, sil2 = Wd('साइलेंस', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 660], zoom: 0.1, note: 'राजू winks + HA HA + the loop card',
      draw(lt, d, t) {
        K.classroom([]);
        rajoo({ x: 540, y: 780, s: 0.6, mood: 'wink', arm: 'hip', t, talk: true });
        K.haha(540, 480, 1.3, t, 0.9);
        const p = eob(seg(lt, sil2, sil2 + 0.3));
        if (p > 0) { ctx.save(); ctx.globalAlpha = p; K.panel(90, 1090, 900, 110, 26, C.ink, C.ink);
          K.text('जब जवाब नहीं होता... तो साइलेंस आता है', 540, 1145, 46, C.yellow, 'center', 800); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + jab, 'boing'); cue(st + sil2, 'pop');
  }

  return { shots: S, cues: CUES };
}

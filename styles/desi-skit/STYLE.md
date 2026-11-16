# Desi Skit: देसी comedy shorts, 9:16

Two flat desi characters (सर vs राजू, पापा vs बेटा, मम्मी vs दुनिया) roast each other in Hinglish — a trap
question, one savage one-liner, "साइलेंस!", the counter-roast, and a punchline that loops. Sunny gully /
classroom / ghar worlds, big Baloo2 captions with one yellow word, a bouncy comedy bed.
Example to study and copy: `example/` = **टीचर बनाम राजू** (~35 s, 12 shots).

## 1. The look (rules — do not break them)
- **Flat shapes only.** No gradients, textures, realistic lighting. Depth = flat darker/lighter tones.
- **Palette (warm & sunny):** bg `#FFE9BC` · wall `#F2C078` · floor `#E8A85E` · panel `#FFF6E3` (edge `#C98A4B`) ·
  red `#E63946` (anger/danger) · green `#2E9E5B` (money/OK) · yellow `#FFC93C` (the one caption keyword + bursts) ·
  blue `#2D6CDF` (uniform/chat) · orange `#FF8A3D` (marigold) · teal `#2A9D8F` · maroon `#8E2F3C` ·
  ink `#3A2415` (warm dark brown outlines) · skin `#E8B486` / shade `#C98F63` · chalk `#FFFDF5`.
- **One accent per meaning:** red = anger or the FAIL stamp, yellow = the caption keyword and comedy bursts.
  Never use red for decoration.
- **Faces read at thumbnail size:** dot eyes with a white highlight, thick eyebrows that carry the mood
  (angry = slanted in, shock = raised, sad = drooped), mouths: flat / smile / smirk / grin / O / sad / wink.
- **Everything is Indian and named:** सर, राजू, पापा, शर्मा जी, मम्मी. Name tags pop in on each character's
  first appearance. Props: chalkboard, cutting chai, tawa + जली हुई roti, pressure-cooker seeti, the flying
  chappal, ₹500 notes, cricket bat, Chetak scooter, WhatsApp chat.
- Mood: cheeky, loud, warm — a comedy skit, not a documentary. No gore, no slurs, no real brands,
  no punching down (the kid always outsmarts the adult — never the reverse).

## 2. Format
- **1080x1920, 30 fps, 30-40 s.** Lead silence 0.4 s, outro 0.9 s (in `script.json`).
- **Story shape (the 5 beats):** the trap question (hook) → the smart-aleck answer → "साइलेंस!" + a threat
  → the counter-attack → the final roast that loops. Every beat = 2-3 lines, every line = one shot.
- **Dialogue drives it:** each line has `"voice"` — one Kokoro voice per character (`hm_omega` = सर/papa,
  `hm_psi` = राजू, `hf_alpha` = मम्मी). Lines are in Devanagari with common English words mixed in
  (एग्जाम, होमवर्क, मीटिंग) — the way people actually talk. Never copy another creator's lines.
- Punch-in + white flash on every cut (automatic in `main.js`); cue a `boing` on every smirk and a `slam`
  on every "साइलेंस!".

## 3. Captions (Devanagari)
Same engine as Tech File but in **Baloo2** (covers Devanagari + Latin), 118 px, white with the warm ink
outline, ONE yellow word, at y 1400. `caps` are written in Devanagari: `"सर, *नंबर देखकर | सब *चपट है"`.
Keep chunks 1-3 words; Devanagari is wider than Latin — never exceed `maxW 900`.

## 4. Engine map (`example/`)
| file | gives you |
|---|---|
| `script.json` | title, `voice` (default character), `lang: "hi"`, speed, lead, outro, gap, `music: "comedy"`, lines `{text, caps, voice, gap}` |
| `src/shots.js` | **the per-video file**: shot list + sound cues |
| `src/core/kit.js` | the desi component zoo (below) |
| `src/core/lib.js` | `W H FPS`, desi palette `C`, `FONT`, `clamp lerp seg eo eio eob rnd line bigText` |
| `src/core/timing.js` | `L(i) Le(i) Wd(word, line)` word timing (Devanagari-aware; throws if a word is missing) |
| `src/core/captions.js` | caption chunking + drawing (`CAP` y 1400) |
| `src/main.js` | boot (loads Baloo2), camera punch-in, cut flash, fades, `window.OP` for capture |
| `tools/capture.mjs` | `check · cues · sheet · frames · video · preview` |
| `tools/mix.py` | narration + comedy bed + procedural effects → `data/mix.wav` |
| `data/` | `lines.json words.json narration.wav cues.json mix.wav` (generated, not committed) |

## 5. The component zoo (`kit.js`, `import * as K`)
**Worlds** `K.street(t)` (sunny gully + sun + chai tapri) · `K.home(lt)` (ghar: window, clock, family photo) ·
`K.classroom(board[])` (blackboard with chalk lines + ledge).
**Chrome** `K.panel` · `K.pill(text,x,y,size,bg,fg,sc)` · `K.nameTag(text,x,y,col,sc)` · `K.text(str,...)` (Baloo2).
**People** `K.guy({x,y,s,role,mood,look,arm,flip})` — roles `papa · sharma · teacher · student · mom · aunty · kid`
(kurta, saree + bun, school cap + bag, glasses, mustache are all preset); moods `flat smile smirk grin o sad shock
angry wink cry`; arms `down up phone point fold hip raise`. Origin = chest, ~1000 px tall at s:1, feet at +556.
**Props** `K.desk` · `K.paper(x,y,s,{lines,wobble})` (exam/report card) · `K.chai(x,y,s,{steam,t})` ·
`K.tawa(x,y,s,{burn,smoke,t})` · `K.cooker(x,y,s,{whistle,t})` · `K.chappal(x,y,s,angle,a)` · `K.notes(x,y,s,n,t)` ·
`K.bat` · `K.scooter(x,y,s,{wobble})`.
**UI** `K.waChat(x,y,s,{name,msgs,typing,t})` — WhatsApp-style chat card, green bubbles for "me".
**Graphics** `K.arrow` · `K.burst` · `K.shockLines` · `K.angerMark` (manga cross) · `K.sweat` · `K.haha(x,y,s,t,a)` ·
`K.zoomLines(x,y,r,t,a)` (the savage-moment lines) · `K.povCard(main,sub,pop)`.

## 6. A shot
```js
const st = cut(2), sil = Wd('साइलेंस!', 2) - st - 0.05;
add({ id: 'S03', at: st, cam: [300, 560], zoom: 0.14, note: 'सर slams: साइलेंस!',
  draw(lt, d, t) {
    K.classroom([]);
    const sh = lt > sil ? Math.sin(lt * 70) * 14 * Math.max(0, 1 - (lt - sil) * 3) : 0;   // screen shake on the word
    ctx.save(); ctx.translate(sh, 0);
    K.guy({ x: 300, y: 800, s: 0.62, role: 'teacher', mood: 'angry', arm: 'raise' });
    if (lt > sil) bigText('साइलेंस!', 540, 400, 150, C.red, -0.04, eob(seg(lt, sil, sil + 0.22)));
    ctx.restore();
  } });
cue(st, 'whoosh'); cue(st + sil, 'slam');
```
`cam` = the point the camera pushes toward; `zoom` 0.07-0.2. Keep key objects between y 250 and 1250 — the caption
zone (y 1250-1550) is sacred. Reaction faces go big (s 0.6-0.8) on the punchline word.

**Sound cues** `cue(t, type, {gain, dur})`: `whoosh` (every cut) · `boing` (every smirk/comedy beat) · `slam`
("साइलेंस!", FAIL stamp) · `pop` (name tags, pills) · `tock` (chalk writing) · `thud` (stamp, desk) ·
`sparkle` (the clever answer lands) · `plop` (floating ?/!) — all in `tools/mix.py`, soft by design.
`music: "comedy"` = the bouncy desi bed (112 BPM plucks + soft dhol thump).

## 7. QA pitfalls (check these first)
- **Devanagari tofu boxes:** every text draw must use `FONT`/Baloo2 (kit + captions do; if you draw raw
  `ctx.font = 'Inter'`, Hindi breaks). Check the contact sheet for hollow boxes.
- **Wd() word not found:** the `Wd('word', line)` argument must match a script token after punctuation is
  ignored — Wd('साइलेंस!', 2) matches the token "साइलेंस!". `node tools/capture.mjs check` fails loudly.
- **Captions over faces:** anything below y 1250 hides under the caption; keep faces above it.
- **Two characters at the same x:** they overlap; keep ≥ 480 px apart at s 0.5.
- **A reaction before its word:** every face change / stamp / burst lands on its spoken word — check the sheet.
- **Voice mismatch:** each dialogue line needs its `"voice"`; both characters must not share one voice.

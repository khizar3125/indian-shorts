# Tech File: dark tech-crime documentary shorts, 9:16

"How did that hack actually happen?" — real tech stories (hacks, scams, outages, breaches) told like a documentary
b-roll edit: dark control-room panels, phones, terminals, dashboards, one idea per shot, a cut every 1.5-3.5 s.
Example to study and copy: `example/` = **THE 17-YEAR-OLD WHO HACKED TWITTER** (~40 s, 19 shots).

## 1. The look (rules — do not break them)
- **Flat shapes only.** No gradients, textures or realistic lighting. Depth = flat darker/lighter tones.
- **Palette:** bg `#0B0E14` · panel `#131A26` (edge `#26324A`) · screen `#0E1622` · well `#0A1019` ·
  green `#3DDC84` (systems working) · red `#FF4757` (danger / the breach) · cyan `#4FD1E8` (data / network) ·
  yellow `#FFD43B` (the one keyword per caption) · blue `#4B7BEC` (verified badges) · steel `#8FA0B8` (device chrome) ·
  gold `#F5C542` (money). Skin `#E8B89A` for visible faces; hooded figures get the dark hoodie `#2B3242` look.
- **One accent per meaning:** green check = intact/safe, red = breached/dangerous, cyan = data moving,
  yellow = the caption keyword and impact bursts. Never use red for decoration.
- **UI chrome is real:** panels have title bars with three dots; screens have borders; terminals type; counters tick.
  People are minimal: dot eyes with a highlight, simple mouth lines; the hacker wears a hood, victims don't.
- Mood: calm, matter-of-fact, slightly tense — a documentary, not a cartoon. No gore, no real logos drawn from
  brand assets (generic bird-free posts, "APPLE INC" as text is fine).

## 2. Format
- **1080x1920, 30 fps, 30-45 s.** Lead silence 0.45 s, outro 0.9 s (in `script.json`).
- **Story shape:** the public moment (the tweet/news) → "it wasn't them" (red X) → who did it (case file) →
  the surprising method (no malware — a phone call) → step by step (call → credentials → admin tool) →
  the damage (feed wall, money counter) → the twist/lesson (he cracked a person) → punchy last line that loops.
- **One line = one shot = one cut**, sentences span 2-3 lines; voice speaks each sentence in one pass.
  Punch-in + brief white flash + whoosh on every cut (automatic in `main.js`; cue the whoosh yourself).

## 3. Captions
Same engine as Inside Out: `script.json` line has `caps` ("|" = next chunk, "*" = the ONE yellow word), 1-3 words per
chunk, Inter Black 150 px white with ink outline at y 1400. On the dark background the ink outline is what keeps white
readable — never drop it. Numbers written as said ("twenty twenty", "a hundred and thirty"), caps may show "$117,000".

## 4. Engine map (`example/`)
| file | gives you |
|---|---|
| `script.json` | title, voice, speed, lead, outro, gap, `music: "tension"` (documentary drone — default for this style), sources, lines `{text, caps, gap}` |
| `src/shots.js` | **the per-video file**: shot list + sound cues |
| `src/core/kit.js` | the component zoo (below) |
| `src/core/lib.js` | `W H FPS`, palette `C`, `clamp lerp seg eo eio eob rnd line bigText` |
| `src/core/timing.js` | `L(i) Le(i) Wd(word, line)` word timing (throws if a word is missing) |
| `src/core/captions.js` | caption chunking + drawing (`CAP` y 1400) |
| `src/main.js` | boot, camera punch-in + push, cut flash, fades, `window.OP` for capture |
| `tools/capture.mjs` | `check · cues · sheet · frames · video · preview` |
| `tools/mix.py` | narration + tension bed + procedural effects → `data/mix.wav` |
| `data/` | `lines.json words.json narration.wav cues.json mix.wav` (generated, not committed) |

## 5. The component zoo (`kit.js`, `import * as K`)
**Chrome** `K.panel(x,y,w,h,r,fill,edge)` · `K.titleBar(x,y,w,title)` (3 dots + title) · `K.screen(x,y,w,h)` ·
`K.sweep(x,y,w,h,t)` (cyan scanner line) · `K.monotype(text,x,y,size,col,align)`.
**Devices & UI** `K.phone(x,y,s,drawScreen,lt)` (drawScreen gets the screen rect) · `K.callUI(sx,sy,sw,sh,lt,{name,answered})`
· `K.credUI(sx,sy,sw,sh,{typed 0..1,field})` (VPN prompt with password dots) · `K.terminal(x,y,w,h,lt,lines,prog)`
· `K.adminPanel(x,y,w,h,lt,{rows,pick,granted})` (internal tools dashboard) · `K.firewall(x,y,w,h,{crack 0..1,open})`.
**Social** `K.post(x,y,s,{name,text[],hi,dark})` (verified-badge card) · `K.avatar(x,y,r,col,init)` · `K.badge(x,y,r)`
· `K.feed(x,y,t,{rows,cols,s,dark})` (scrolling wall of identical posts).
**People** `K.person({x,y,s,hood,eyes,mouth,look,shirt,pants})` (origin = chest, ~1000 px at s:1; `hood: true` = the
anonymous hacker) · `K.handPhone(x,y,s,{angle,ring,lt})`.
**Props** `K.caseCard(x,y,s,{name,age,city})` · `K.mapCard(x,y,w,h,t,pins)` + `K.pin(x,y,s,a)` · `K.globe(x,y,r,t,{nodes})`
· `K.cash(x,y,s,n,t)` · `K.counter(x,y,val,lt,w)` · `K.cuffs(x,y,s)` · `K.newsBar(y,lt,text)`.
**Graphics** `K.pill(tag,x,y,size,bg,fg,scale)` · `K.tag(text,x,y,tx,ty,size,scale)` · `K.redX(x,y,s,a)` ·
`K.arrow(x,y,len,angle,a)` · `K.warning(x,y,s,a)` · `K.burst(x,y,s,a)` · `K.shockLines(x,y,r,a)` · `bigText(...)`.

## 6. A shot
```js
const st = cut(5), x = Wd("wasn't", 2) - st - 0.05;      // the X lands on "wasn't"
add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'red X slams over the card wall',
  draw(lt, d, t) {
    grid();                                              // the dot-grid backdrop lives in shots.js
    ...panels and props as pure functions of lt...
    if (lt > x) { const p = seg(lt, x, x + 0.2); K.redX(540, 760, lerp(2.2, 1.5, eo(p)), clamp(p * 3)); }
  } });
cue(st, 'whoosh'); cue(st + x + 0.1, 'slam');
```
`cam` = the point the camera pushes toward; `zoom` 0.06-0.18 typical. Keep key objects between y 250 and 1250 so the
caption zone (y 1250-1550) never covers them; `newsBar` hangs at y ~1070-1180 (still above the caption).

**Sound cues** `cue(t, type, {gain, dur})`: `whoosh` (every cut) · `pop` (a tag/pill appears) · `thud` (pin/panel lands)
· `slam` (red X / takeover) · `tock` (typing, ringing, counting) · `alarm` (breach moments) · `zip` (feed scroll) ·
`sparkle` (intact security check) · `boing` (comedic beat) — all from `tools/mix.py`, soft by design.

## 7. QA pitfalls (check these first)
- **Caption vs news bar collision:** newsBar at y 1070 is fine, anything below y 1250 is under the caption — never put
  key text there.
- **Real logos / brands drawn sloppily:** verified badge + plain text names only; no trademark shapes.
- **Terminal text overflowing its screen:** keep typed lines ≤ ~40 chars at 34 px inside an 800-wide terminal.
- **A panel popping before its cause:** everything appears on (or after) its spoken word — check with
  `node tools/capture.mjs check` then the contact sheet.
- **Too busy:** one idea per shot; if you need two, split the line into two shots.

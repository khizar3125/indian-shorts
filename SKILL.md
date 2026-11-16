---
name: indian-shorts
description: Make desi comedy skit shorts (YouTube Shorts / Reels / TikTok) fully in code — Hindi AI voices (one per character), Devanagari word-synced captions, flat desi cartoon worlds, rendered on GitHub Actions, $0. You say "generate new video", it picks a fresh desi idea (teacher vs student, papa vs sharma ji ka beta, mummy vs jali roti...) and ships the finished MP4 to a GitHub release. A style: Desi Skit (desi-skit).
---

# Indian Shorts (Desi Skit — GitHub Actions edition)

You make a finished vertical comedy skit from a desi idea: script (Hinglish dialogue, one voice per character),
voice, word-synced Devanagari captions, animated desi cartoon shots, sound + comedy music, rendered to MP4
**on GitHub Actions — never on the user's device**. Everything is code: canvas drawing, headless Chrome capture,
ffmpeg, free local Kokoro Hindi voices, local Whisper word timing, numpy sound. No AI images or video, no API keys,
no credits. `SKILL` = this repo. Projects live in `projects/<short-name>/`.

| style | what it makes | length · aspect |
|---|---|---|
| **Desi Skit** `desi-skit` | 2-character desi comedy skits: trap question → savage one-liner → "साइलेंस!" → counter-roast → loop punchline. सर, पापा, मम्मी, राजू, शर्मा जी. | 30-40 s · 9:16 |
| Tech File `tech-file` | (bonus engine demo) dark tech-crime documentary shorts | 30-45 s · 9:16 |

**Read `styles/desi-skit/STYLE.md` in full before planning.**

## 0. First use
Nothing to install locally. The workflow installs what it needs on the runner and caches the two models
(Kokoro voices, Whisper small) between runs. On a computer: `bash SKILL/scripts/setup.sh` then
`bash SKILL/scripts/selftest.sh` proves the pipeline.

## 1. "generate new video" — the auto flow (no questions asked)
When the user says **generate new video** (or "naya video banao", "next video", or gives a topic):
1. **Pick the idea:** choose the first unused idea from the bank below (keep a `projects/` count; never repeat
   a done idea until the bank is exhausted, then riff 5 new ones). If the user gave a topic, use theirs.
2. **Write the skit:** follow the Desi Skit story shape (STYLE.md §2): trap → smart-aleck → साइलेंस! →
   counter-attack → loop punchline. 12-14 lines, one cut per line, `voice` per character
   (`hm_omega` papa/sir, `hm_psi` raju/beta, `hf_alpha` mummy/aunty). Devanagari with English words mixed in.
   **Original writing only — take the format, never another creator's lines or shots.**
3. Show the plan in ONE screen (title · the dialogue with its caps chunks · shot list, one line each) and start
   building — do not wait for approval when the user asked for "generate new video".
4. `bash SKILL/scripts/new_video.sh desi-skit <short-name>`, rewrite `script.json` + `src/shots.js`, commit,
   push the project folder, run the workflow (**Actions → render → Run workflow → project: `<short-name>`,
   mode: full**) — or dispatch it with the API.
5. QA (section 4) · iterate · deliver the release link.

## 2. The desi idea bank (rotate; original scripts only)
1. सर का ट्रैप सवाल — teacher asks a trick question, the kid's logic wins
2. पापा vs शर्मा जी का बेटा — the 99.8% comparison with a twist
3. मम्मी vs जली रोटी — papa's patient "कोई बात नहीं" until the cooker wins
4. कुकर की सीटी vs फोन — "seeti bajti hai to samajh lo call aayi hi hai"
5. ऑटो वाले का मीटर — "meter pe chalo" has a different meaning every time
6. रिश्ते वाली आंटी — "beta kya kar rahe ho" becomes an interrogation
7. चाय तपरी का stock market — chai + free advice that beats any MBA
8. एग्जाम में पास होने के बहाने — every excuse is a philosophy
9. सब्ज़ी वाले से भाव — mom negotiates ₹2 like a UN treaty
10. शादी का बफे — the plate strategy, uncle edition
11. गली क्रिकेट — "last man out" who never accepts being out
12. मम्मी का "लाइट बंद करो" — the house power minister
13. पापा का "हम जमाने में" — everything cost ₹1 and walked uphill
14. दोस्त का नया फोन — the whole gully becomes a camera crew
15. रिपोर्ट कार्ड की दुआएं — prayers before results, post-its on marks
16. सास vs बहू की चाय — who makes the perfect cup
17. बिजली गई — inverter uncle announces it like a news anchor
18. WhatsApp ग्रुप का गुड मॉर्निग — papa forwards the whole internet
19. सेल की शॉपिंग — "70% off" on things nobody needed
20. जॉब इंटरव्यू — "अपने बारे में बताओ" meets overprepared answers
21. होमवर्क vs क्रिकेट — mummy's negotiation skills
22. पापा का पुराना गाना — the same cassette story every car ride
23. नए साल का रेज़ोल्यूशन — "kal se padhunga, pakka"
24. दोस्त की उधार की 500 — the friend becomes a myth
25. स्कूल की PT period — the period that's always "borrowed"

## 3. Build
1. Copy the example: `bash SKILL/scripts/new_video.sh desi-skit <short-name>`.
2. Write `script.json` (title, `lang: "hi"`, `voice`, `music: "comedy"`, lines with `text`/`caps`/`voice`).
3. Rewrite `src/shots.js`: one shot per line, characters with `K.guy(...)`, props from the kit
   (`K.classroom`, `K.street`, `K.home`, `K.chai`, `K.cooker`, `K.chappal`, `K.waChat`...), key moments on words
   with `Wd('word', line)`. Reuse/add components in `src/core/kit.js`, in the desi look.
4. Commit and push the project folder, then run the workflow (project name, mode `full`/`draft`/`sheet`).
5. The final MP4 lands on a GitHub release.

Timing is generated on the runner (voice.py speaks with Kokoro Hindi voices, words.py aligns with Whisper
multilingual); `data/` is not committed. `node tools/capture.mjs check` runs there too and fails on any draw
error or word-not-found.

## 4. QA: never ship a frame you haven't looked at
Download the run artifact `review/all.jpg` (a frame every 1 s) and read the whole sheet, then key frames full size:
- Story: does each beat land on its line? The roast lands ON the roast word.
- Devanagari: no tofu boxes; captions 1-3 words, exactly one yellow word, readable on a phone.
- No collisions: nothing in the caption zone (y 1250-1550); characters ≥ 480 px apart.
- Voice: two distinct character voices; the comedy bed ducks under dialogue; `boing` on smirks, `slam` on साइलेंस.
Fix, push, re-run. Tell the user what you caught and fixed.

## 5. Deliver
Give the user: the release link, the best cover frame, a Hindi title, a caption and 5-8 hashtags
(#desi #comedy #funny #teacher #trending). Offer one round of precise changes.

## Never
Generate images or video with AI; spend the user's money or credits; copy another creator's script, shots or
frames; repeat an idea from the bank that's already shipped; push a project you haven't QA'd on a contact sheet;
put tokens or secrets in any file (Actions uses the built-in `GITHUB_TOKEN`); render on the user's device.

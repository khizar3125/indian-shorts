# indian-shorts

Desi comedy skit shorts (YouTube Shorts / Reels / TikTok) made **100% in code** and rendered **on GitHub
Actions** — nothing runs on your phone or laptop. Hinglish dialogue with **one Hindi AI voice per character**
(Kokoro, free local), **word-synced Devanagari captions**, flat desi cartoon worlds (classroom, gully, ghar),
comedy music, ffmpeg → MP4. No API keys, no credits, $0 per video.

## You say "generate new video"
The skill picks a fresh idea from its desi idea bank (teacher vs student, papa vs sharma ji ka beta,
mummy vs jali roti...), writes an original 2-character skit, renders it, and gives you the MP4. Repeat daily.

## How it works here
1. A **project** lives in `projects/<name>/` (`script.json` = the dialogue + captions, `src/shots.js` = every shot).
2. **GitHub Actions** (`render` workflow) does everything: installs the two free models once (then cached),
   speaks the script (Kokoro Hindi), times every word (Whisper), draws every frame (headless Chrome), mixes the
   soundtrack, renders the MP4.
3. The finished MP4 is attached to a GitHub **release** and also saved as a run **artifact** (with the QA
   contact sheet).

## Style
- **Desi Skit** (`styles/desi-skit/`): the full rules, the component zoo (किरदार + props), and a complete
  `example/` that renders as-is — सर vs राजू classroom roast. See its `STYLE.md`.

## Start a new video
1. `bash scripts/new_video.sh desi-skit <short-name>` (copies the example), rewrite `script.json` +
   `src/shots.js`, copy the folder into `projects/<short-name>/`.
2. Run the workflow: **Actions → render → Run workflow → project: `<short-name>`, mode: full**.
3. QA the `review/all.jpg` contact-sheet artifact, then download the MP4 from the release.

## Local scripts (on a computer)
`scripts/setup.sh` (install + models) · `scripts/selftest.sh` (pipeline test) · `scripts/voice.py --list`
(voices) · `scripts/words.py` (timings) · `scripts/ci_render.sh` (what Actions runs).

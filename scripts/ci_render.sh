#!/usr/bin/env bash
# The GitHub Actions render pipeline for one project under projects/.
#   bash scripts/ci_render.sh <project> [full|draft|sheet]
# full: voice -> words -> check -> cues -> mix -> sheet -> MP4 (+ release upload handled by the workflow)
# draft: same but ultrafast/low-quality MP4 · sheet: timing + contact sheet only (no MP4)
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
NAME="${1:?project name required}"; PROJ="$SKILL/projects/$NAME"; MODE="${2:-full}"
[ -d "$PROJ" ] || { echo "no project $NAME under projects/"; exit 1; }
PY="$SKILL/scripts/py"
mkdir -p "$PROJ/renders" "$PROJ/review"
cd "$PROJ"

if [ "$MODE" != "sheet" ]; then
  echo "== voice (Kokoro)";  "$PY" "$SKILL/scripts/voice.py" .
  echo "== words (Whisper)"; "$PY" "$SKILL/scripts/words.py" .
fi

echo "== check"; node tools/capture.mjs check | tee review/check.txt
grep -q "CHECK OK" review/check.txt || { echo "check failed"; exit 1; }

echo "== cues"; node tools/capture.mjs cues
echo "== mix";  "$PY" tools/mix.py .
echo "== sheet"; node tools/capture.mjs sheet review/all.jpg 1 8

if [ "$MODE" != "sheet" ]; then
  DRAFT=""; [ "$MODE" = "draft" ] && DRAFT="--draft"
  echo "== video"; node tools/capture.mjs video "renders/$NAME.mp4" $DRAFT
  ls -la renders/
fi
echo "RENDER DONE"

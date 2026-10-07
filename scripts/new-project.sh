#!/bin/bash
# Creates a preview-video project from the skill's template and installs it.
# Usage: new-project.sh <destination-dir>
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
dest="$1"
[ -e "$dest" ] && { echo "$dest already exists" >&2; exit 1; }
mkdir -p "$(dirname "$dest")"
cp -R "$here/assets/template" "$dest"
cd "$dest"
npm install --no-audit --no-fund --loglevel=error
./scripts/fetch-music.sh 1167:close-up
./scripts/make-placeholder.sh example
npx tsc --noEmit && echo "Ready: $dest"

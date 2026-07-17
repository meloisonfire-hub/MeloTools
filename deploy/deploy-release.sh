#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${APP_DIR:-/srv/melotools}
BRANCH=${1:-main}

cd "$APP_DIR"
git fetch --prune origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
"$APP_DIR/venv/bin/pip" install -r requirements.txt
"$APP_DIR/venv/bin/python" -m compileall -q app.py melotools tools
sudo systemctl restart melotools
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8090/ready
echo "Deploy concluído em $(git rev-parse --short HEAD)."


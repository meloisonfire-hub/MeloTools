#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/srv/melotools
VENV_DIR="$APP_DIR/venv"

apt update
apt install -y python3 python3-venv python3-pip ffmpeg libreoffice poppler-utils tesseract-ocr tesseract-ocr-por libzbar0 zbar-tools whois nginx

mkdir -p "$APP_DIR/uploads" "$APP_DIR/results" "$APP_DIR/tmp"

python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install -r "$APP_DIR/requirements.txt"

cp "$APP_DIR/deploy/melotools.service" /etc/systemd/system/melotools.service
cp "$APP_DIR/deploy/nginx-melotools.conf" /etc/nginx/sites-available/melotools
ln -sf /etc/nginx/sites-available/melotools /etc/nginx/sites-enabled/melotools
rm -f /etc/nginx/sites-enabled/default || true

systemctl daemon-reload
systemctl enable melotools
systemctl restart melotools
systemctl restart nginx

echo "MeloTools instalado e em execucao."

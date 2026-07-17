#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/srv/melotools
VENV_DIR="$APP_DIR/venv"
ENV_FILE=/etc/melotools.env
SECRET_FILE=/etc/melotools.secret

if [ -n "${MELOTOOLS_PYTHON_BIN:-}" ]; then
  PYTHON_BIN="$MELOTOOLS_PYTHON_BIN"
elif command -v python3.9 >/dev/null 2>&1; then
  PYTHON_BIN=$(command -v python3.9)
else
  PYTHON_BIN=$(command -v python3)
fi

apt-get update
apt-get install -y python3 python3-venv python3-pip ffmpeg ghostscript libreoffice poppler-utils tesseract-ocr tesseract-ocr-por libzbar0 zbar-tools whois nginx ufw

if ! id melotools >/dev/null 2>&1; then
  useradd --system --home-dir "$APP_DIR" --shell /usr/sbin/nologin melotools
fi

install -d -o melotools -g melotools -m 0750 /var/lib/melotools
install -d -o melotools -g melotools -m 2770 /var/lib/melotools/uploads /var/lib/melotools/results /var/lib/melotools/tmp

"$PYTHON_BIN" -m venv --copies "$VENV_DIR"
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r "$APP_DIR/requirements.txt"

if [ ! -f "$SECRET_FILE" ]; then
  openssl rand -out "$SECRET_FILE" -hex 48
fi
chown root:melotools "$SECRET_FILE"
chmod 0640 "$SECRET_FILE"

if [ ! -f "$ENV_FILE" ]; then
  install -m 0600 -o root -g root "$APP_DIR/deploy/melotools.env.example" "$ENV_FILE"
fi

install -m 0644 "$APP_DIR/deploy/melotools.service" /etc/systemd/system/melotools.service
install -m 0644 "$APP_DIR/deploy/melotools-cleanup.service" /etc/systemd/system/melotools-cleanup.service
install -m 0644 "$APP_DIR/deploy/melotools-cleanup.timer" /etc/systemd/system/melotools-cleanup.timer
install -m 0644 "$APP_DIR/deploy/nginx-melotools.conf" /etc/nginx/sites-available/melotools
install -m 0644 "$APP_DIR/deploy/nginx-melotools-rate-limit.conf" /etc/nginx/conf.d/melotools-rate-limit.conf
ln -sfn /etc/nginx/sites-available/melotools /etc/nginx/sites-enabled/melotools

systemctl daemon-reload
nginx -t
systemctl enable --now melotools-cleanup.timer
systemctl enable melotools
systemctl restart melotools
systemctl reload nginx

curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8090/ready
echo "MeloTools instalado e validado."

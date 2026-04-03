#!/usr/bin/env bash
set -Eeuo pipefail

APP_USER="ocrweb"
APP_GROUP="ocrweb"
APP_DIR="/srv/ocr-web"
SERVICE_NAME="ocr-web"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "${TOOLS_DIR}/.." && pwd)"
SERVICE_SRC="${TOOLS_DIR}/ocr-web.service"
SERVICE_DST="/etc/systemd/system/${SERVICE_NAME}.service"
REQ_FILE="${TOOLS_DIR}/requirements.txt"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    echo "Execute este script como root."
    exit 1
  fi
}

install_system_packages() {
  export DEBIAN_FRONTEND=noninteractive
  log "Instalando dependências do sistema"
  apt-get update
  apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    nodejs \
    npm \
    imagemagick \
    qpdf \
    ocrmypdf \
    ghostscript \
    poppler-utils \
    ffmpeg \
    mkvtoolnix \
    tesseract-ocr \
    tesseract-ocr-por \
    tesseract-ocr-eng \
    curl \
    rsync
}

ensure_service_user() {
  if ! getent group "${APP_GROUP}" >/dev/null; then
    log "Criando grupo ${APP_GROUP}"
    groupadd --system "${APP_GROUP}"
  fi

  if ! id -u "${APP_USER}" >/dev/null 2>&1; then
    log "Criando usuário ${APP_USER}"
    useradd --system --gid "${APP_GROUP}" --home-dir "${APP_DIR}" --shell /usr/sbin/nologin "${APP_USER}"
  fi
}

prepare_directories() {
  log "Criando diretórios da aplicação"
  mkdir -p \
    "${APP_DIR}" \
    "${APP_DIR}/uploads" \
    "${APP_DIR}/results" \
    "${APP_DIR}/tmp" \
    "${APP_DIR}/templates" \
    "${APP_DIR}/static/css" \
    "${APP_DIR}/static/js" \
    "${APP_DIR}/static/vendor/pdfjs"
}

sync_project() {
  log "Copiando projeto para ${APP_DIR}"
  rsync -a --delete \
    --exclude 'venv/' \
    --exclude '__pycache__/' \
    --exclude 'uploads/' \
    --exclude 'results/' \
    --exclude 'tmp/' \
    "${SOURCE_DIR}/" "${APP_DIR}/"
}

setup_venv() {
  log "Criando ambiente virtual Python"
  python3 -m venv "${APP_DIR}/venv"
  "${APP_DIR}/venv/bin/pip" install --upgrade pip setuptools wheel
  "${APP_DIR}/venv/bin/pip" install -r "${REQ_FILE}"
}

prepare_frontend_assets() {
  log "Preparando assets do frontend"
  mkdir -p "${APP_DIR}/static/vendor/pdfjs"

  curl -fsSL "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.min.mjs" \
    -o "${APP_DIR}/static/vendor/pdfjs/pdf.min.mjs"
  curl -fsSL "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs" \
    -o "${APP_DIR}/static/vendor/pdfjs/pdf.worker.min.mjs"

  if npx --yes javascript-obfuscator "${APP_DIR}/static/js/app.js" \
    --output "${APP_DIR}/static/js/app.min.js" \
    --compact true \
    --self-defending true \
    --string-array true \
    --string-array-encoding base64 \
    --string-array-threshold 0.75 \
    --identifier-names-generator hexadecimal \
    --simplify true \
    --transform-object-keys true; then
    log "app.min.js gerado com ofuscação"
  else
    log "Falha ao ofuscar JS; copiando app.js para app.min.js"
    cp "${APP_DIR}/static/js/app.js" "${APP_DIR}/static/js/app.min.js"
  fi
}

patch_imagemagick_policy() {
  local policy_file=""

  if [[ -f /etc/ImageMagick-6/policy.xml ]]; then
    policy_file="/etc/ImageMagick-6/policy.xml"
  elif [[ -f /etc/ImageMagick-7/policy.xml ]]; then
    policy_file="/etc/ImageMagick-7/policy.xml"
  fi

  if [[ -z "${policy_file}" ]]; then
    log "Política do ImageMagick não encontrada; seguindo sem ajuste"
    return
  fi

  if grep -Eq 'pattern="PDF".*rights="none"|rights="none".*pattern="PDF"' "${policy_file}"; then
    log "Ajustando política do ImageMagick para permitir PDF"
    cp "${policy_file}" "${policy_file}.bak.$(date +%Y%m%d-%H%M%S)"
    sed -i -E 's#<policy domain="coder" rights="none" pattern="PDF"[[:space:]]*/>#<policy domain="coder" rights="read|write" pattern="PDF" />#g' "${policy_file}"
    sed -i -E 's#<policy domain="coder" rights="none" pattern="PDF">#<policy domain="coder" rights="read|write" pattern="PDF">#g' "${policy_file}"
  else
    log "Política do ImageMagick para PDF já está liberada"
  fi
}

fix_permissions() {
  log "Aplicando permissões"
  chown -R "${APP_USER}:${APP_GROUP}" "${APP_DIR}"
  chmod -R u+rwX,g+rX "${APP_DIR}"
  chmod -R u+rwx "${APP_DIR}/uploads" "${APP_DIR}/results" "${APP_DIR}/tmp"
}

install_systemd_service() {
  log "Instalando serviço ${SERVICE_NAME}"
  install -m 0644 "${SERVICE_SRC}" "${SERVICE_DST}"
  systemctl daemon-reload
  systemctl enable "${SERVICE_NAME}"
  systemctl restart "${SERVICE_NAME}"
}

health_check() {
  log "Validando aplicação"
  sleep 2
  "${APP_DIR}/venv/bin/python" -m py_compile "${APP_DIR}/app.py" "${APP_DIR}/instagram_transcribe.py"
  curl --fail --silent --show-error "http://127.0.0.1:8080/health" >/dev/null
  systemctl --no-pager --full status "${SERVICE_NAME}" | sed -n '1,12p'
}

show_summary() {
  cat <<EOF

Instalação concluída.

- Projeto: ${APP_DIR}
- Serviço: ${SERVICE_NAME}
- Usuário: ${APP_USER}
- Health: http://127.0.0.1:8080/health

Comandos úteis:
- systemctl status ${SERVICE_NAME}
- journalctl -u ${SERVICE_NAME} -f
- systemctl restart ${SERVICE_NAME}

EOF
}

main() {
  require_root
  install_system_packages
  ensure_service_user
  prepare_directories
  sync_project
  setup_venv
  prepare_frontend_assets
  patch_imagemagick_policy
  fix_permissions
  install_systemd_service
  health_check
  show_summary
}

main "$@"

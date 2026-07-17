# MeloTools

Painel web Flask com interface em abas no estilo do OCR-Web, incluindo utilidades para videos online, imagem, documentos, videos, texto, links/QR, TI e Dev, sorteadores e calculadoras.

## Estrutura
- app.py
- melotools/ (segurança e extensões compartilhadas)
- templates/index.html
- static/css/style.css
- static/js/app.js
- uploads/
- results/
- tmp/
- requirements.txt
- deploy/melotools.service
- deploy/nginx-melotools.conf

## Dependencias de sistema (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y ffmpeg libreoffice poppler-utils tesseract-ocr tesseract-ocr-por libzbar0 zbar-tools whois
```

## Instalar dependencias Python
```bash
cd /srv/melotools
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Segurança e operação

- O Gunicorn deve escutar apenas em `127.0.0.1:8090`.
- Segredos ficam em `/etc/melotools.env`, nunca no repositório.
- Resultados usam URLs assinadas e expiram em 24 horas por padrão.
- Uploads e processamentos pesados possuem limites configuráveis.
- A limpeza é executada pelo timer `melotools-cleanup.timer`.

Consulte `docs/SECURITY-OPERATIONS.md` antes de implantar ou atualizar o servidor.

## Executar localmente
```bash
python app.py
```
Acesse: `http://127.0.0.1:8090`

## Executar com Gunicorn
```bash
gunicorn -w 2 -b 127.0.0.1:8090 app:app
```

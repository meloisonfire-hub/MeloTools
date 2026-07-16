# MeloTools

Painel web Flask com interface em abas no estilo do OCR-Web, incluindo utilidades para videos online, imagem, documentos, videos, texto, links/QR, TI e Dev, sorteadores e calculadoras.

## Estrutura
- app.py
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

## Executar localmente
```bash
python app.py
```
Acesse: `http://127.0.0.1:8090`

## Executar com Gunicorn
```bash
gunicorn -w 2 -b 0.0.0.0:8090 app:app
```

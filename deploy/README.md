# Ferramentas 2.0

Pacote de instalação da aplicação para uma nova máquina Linux.

## O que tem aqui

- `instalar_ocr_web.sh`: instala dependências do sistema, cria diretórios, ajusta permissões, cria a `venv`, instala os pacotes Python, publica o projeto em `/srv/ocr-web` e sobe o serviço.
- `ocr-web.service`: unidade `systemd` usada pelo instalador.
- `requirements.txt`: dependências Python do projeto.

## Ambiente alvo

- Debian 13 ou Ubuntu/Debian compatível com `apt`
- Execução como `root`
- Acesso à internet durante a instalação

## Como usar

1. Copie o projeto inteiro para a nova máquina.
2. Entre na pasta `ferramentas 2.0`.
3. Execute:

```bash
chmod +x instalar_ocr_web.sh
sudo ./instalar_ocr_web.sh
```

## O que o script faz

- instala os pacotes do sistema
- cria o usuário de serviço `ocrweb`
- cria `/srv/ocr-web` e subpastas de trabalho
- copia os arquivos do projeto para `/srv/ocr-web`
- cria e prepara a `venv`
- instala os pacotes Python
- prepara os assets do frontend (`app.min.js` e `pdf.js`)
- ajusta a política do ImageMagick para PDF quando necessário
- instala e habilita o serviço `ocr-web`
- testa o endpoint `/health`

## Arquivos que não são copiados como dados de produção

O instalador ignora:

- `venv/`
- `__pycache__/`
- `uploads/`
- `results/`
- `tmp/`

Essas pastas são recriadas limpas no servidor novo.

# Organizacao do servidor

## Diretorios ativos
- `/srv/ocr-web`: codigo e estrutura principal da aplicacao.
- `/srv/ocr-web/uploads`: entrada de arquivos de usuarios.
- `/srv/ocr-web/results`: saida dos arquivos processados.
- `/srv/ocr-web/tmp`: area temporaria de trabalho.
- `/srv/ocr-web/venv`: ambiente virtual Python da producao.

## Diretorios de apoio
- `/srv/ocr-web/deploy`: instalador, service do systemd e requirements.
- `/srv/ocr-web/archive/backups`: backups antigos retirados da raiz do projeto.
- `/srv/ocr-web/archive/packages`: pacotes de deploy arquivados.

## Boas praticas adotadas
- Mantidos os caminhos ativos da aplicacao para evitar regressao.
- Backups e artefatos antigos foram removidos do fluxo principal.
- Foi preservada compatibilidade com o caminho legado `ferramentas 2.0`.

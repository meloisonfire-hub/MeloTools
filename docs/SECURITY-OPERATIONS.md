# Segurança e operação

## Implantação

1. Use um checkout limpo da branch `main` em `/srv/melotools`.
2. Mantenha uploads, resultados, runtime e cookies fora do Git. Os dados persistentes ficam em `/var/lib/melotools`.
3. Execute `sudo deploy/install.sh` na primeira instalação.
4. Nas atualizações seguintes, execute `sudo deploy/deploy-release.sh main`.
5. Valide `/ready`, Nginx e logs antes de encerrar a janela de manutenção.

## Segredos

Os arquivos `/etc/melotools.env` e `/etc/melotools.secret` devem pertencer a `root:root` e usar modo `0600`.
Nunca copie cookies, chaves SSH, certificados ou o conteúdo desse arquivo para o repositório.

## Firewall

`deploy/configure-firewall.sh` preserva SSH e libera somente 22, 80 e 443. Confirme também o firewall do provedor da VPS.

## Arquivos temporários

O runtime fica em `/var/lib/melotools`. O timer de limpeza remove:

- uploads após 4 horas;
- resultados após 24 horas;
- jobs, caches e temporários após 4 horas.

## Atualização da plataforma

O Ubuntu 20.04 e o Python 3.9 devem ser migrados em uma janela separada, pois o host também executa serviços de rede. Procedimento recomendado:

1. provisionar Ubuntu LTS atual em uma instância nova;
2. instalar o MeloTools com o script versionado;
3. executar os testes e validar VPN, Pi-hole, TLS e DNS;
4. trocar o DNS apenas depois dos testes;
5. manter a instância antiga disponível para rollback durante a janela definida.

Não faça upgrade de distribuição no mesmo deploy da aplicação.

## Verificações

```bash
sudo nginx -t
systemctl is-active melotools nginx melotools-cleanup.timer
curl --fail http://127.0.0.1:8090/ready
sudo systemd-analyze security melotools.service
sudo ufw status verbose
```

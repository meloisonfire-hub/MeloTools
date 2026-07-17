# Segurança e operação

## Implantação

1. Use um checkout limpo da branch `main` em `/srv/melotools`.
2. Mantenha uploads, resultados, runtime e cookies fora do Git. Os dados persistentes ficam em `/var/lib/melotools`.
3. Execute `sudo deploy/install.sh` na primeira instalação.
4. Nas atualizações seguintes, execute `sudo deploy/deploy-release.sh main`.
5. Valide `/ready`, Nginx e logs antes de encerrar a janela de manutenção.

## Segredos

O arquivo `/etc/melotools.env` deve pertencer a `root:root` e usar modo `0600`.
O segredo `/etc/melotools.secret` deve pertencer a `root:melotools` e usar modo `0640`, para ser legivel apenas pelo systemd e pelo processo da aplicacao.
Nunca copie cookies, chaves SSH, certificados ou o conteúdo desse arquivo para o repositório.

## Firewall

`deploy/configure-firewall.sh` preserva SSH, HTTP/HTTPS e o DNS-over-TLS existente nas portas 22, 80, 443 e 853.
Como o host também executa VPN e Pi-hole, revise regras de encaminhamento e DNS antes de habilitar o UFW. Confirme também o firewall do provedor da VPS.

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

#!/usr/bin/env bash
set -euo pipefail

# Keep SSH reachable before enabling the firewall.
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose


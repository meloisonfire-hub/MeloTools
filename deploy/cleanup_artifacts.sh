#!/usr/bin/env bash
set -euo pipefail
BASE=/srv/melotools
find "$BASE/uploads" -type f -mmin +240 -delete
find "$BASE/tmp" -type f -mmin +240 -delete
find "$BASE/results" -type f -mmin +1440 -delete
find "$BASE/tmp" -type d -empty -delete || true

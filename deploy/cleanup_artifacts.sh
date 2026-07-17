#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${MELOTOOLS_APP_DIR:-/srv/melotools}
RUNTIME_DIR=${MELOTOOLS_RUNTIME_DIR:-/var/lib/melotools}

delete_old_files() {
  local directory=$1
  local minutes=$2
  [ -d "$directory" ] || return 0
  find -L "$directory" -xdev -type f -mmin "+$minutes" -delete
}

delete_empty_dirs() {
  local directory=$1
  [ -d "$directory" ] || return 0
  find -L "$directory" -xdev -depth -mindepth 1 -type d -empty -delete
}

delete_old_files "$APP_DIR/uploads" 240
delete_old_files "$APP_DIR/results" 1440
delete_old_files "$RUNTIME_DIR/tmp" 240
delete_empty_dirs "$RUNTIME_DIR/tmp"

#!/usr/bin/env bash
set -euo pipefail

RUNTIME_DIR=${MELOTOOLS_RUNTIME_DIR:-/var/lib/melotools}
UPLOAD_DIR=${MELOTOOLS_UPLOAD_DIR:-$RUNTIME_DIR/uploads}
RESULT_DIR=${MELOTOOLS_RESULT_DIR:-$RUNTIME_DIR/results}

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

delete_old_files "$UPLOAD_DIR" 240
delete_old_files "$RESULT_DIR" 1440
delete_old_files "$RUNTIME_DIR/tmp" 240
delete_empty_dirs "$RUNTIME_DIR/tmp"

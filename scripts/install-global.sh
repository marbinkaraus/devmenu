#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PREFIX="${DEVMENU_PREFIX:-${HOME}/.local}"
BIN_DIR="${PREFIX}/bin"

mkdir -p "${BIN_DIR}"

if command -v bun >/dev/null 2>&1; then
  ( cd "${PKG_ROOT}" && bun install --frozen-lockfile && bun run build )
elif command -v npm >/dev/null 2>&1 && [[ -f "${PKG_ROOT}/cli.js" ]]; then
  echo "Using existing cli.js (run 'bun run build' first if stale)." >&2
else
  echo "Need bun to build cli.js, or run: npm install -g ${PKG_ROOT}" >&2
  exit 1
fi

cp "${PKG_ROOT}/cli.js" "${BIN_DIR}/devmenu"
chmod +x "${BIN_DIR}/devmenu"

echo "Installed ${BIN_DIR}/devmenu (Node >=18 on PATH). Add ${BIN_DIR} to PATH if needed."

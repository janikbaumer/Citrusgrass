#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

pkill -f "next dev" 2>/dev/null || true
exec npm run dev

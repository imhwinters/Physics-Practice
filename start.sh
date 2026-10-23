#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
echo 'AP Physics C Practice: http://localhost:5173'
echo 'Keep this terminal open. Press Ctrl+C to stop.'
exec python3 -m http.server 5173 --bind 127.0.0.1 --directory dist

#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npm run build
rsync -avz --delete out/ flatGPTserverIPv4:/var/www/citrusgrass/

echo "Deployed to https://citrusgrass.com"

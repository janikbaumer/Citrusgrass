#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npm run build
rsync -avz --delete out/ /var/www/citrusgrass/
./scripts/deploy_firestore_rules.sh

echo "Deployed to https://citrusgrass.com"

#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npx --yes firebase-tools deploy --only firestore:rules,firestore:indexes

echo "Deployed firestore.rules and firestore.indexes.json to the citrusgrass Firebase project"

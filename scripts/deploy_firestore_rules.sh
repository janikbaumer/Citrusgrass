#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npx --yes firebase-tools deploy --only firestore:rules,firestore:indexes,storage

echo "Deployed firestore.rules, firestore.indexes.json, and storage.rules to the citrusgrass Firebase project"

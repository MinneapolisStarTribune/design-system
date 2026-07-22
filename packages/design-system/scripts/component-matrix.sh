#!/usr/bin/env bash
# Regenerates the component matrix and compares it against the committed file.
#
#   component-matrix.sh check    Exit 1 if the committed matrix is stale (CI).
#   component-matrix.sh commit   Commit the regenerated matrix and exit 1 so
#                                the current push stops and can be retried
#                                with the new commit included (lefthook).
set -euo pipefail

cd "$(dirname "$0")/../../.."

mode="${1:-check}"
matrix=packages/design-system/src/stories/GettingStarted/component-matrix.json

yarn workspace @minneapolisstartribune/design-system generate:component-matrix
node ./node_modules/.bin/prettier --write "$matrix"

if git diff --quiet HEAD -- "$matrix"; then
  exit 0
fi

case "$mode" in
  check)
    echo "component-matrix.json is stale." >&2
    echo "Run: yarn workspace @minneapolisstartribune/design-system generate:component-matrix" >&2
    echo "then commit the result (the pre-push hook normally does this for you)." >&2
    exit 1
    ;;
  commit)
    git add -- "$matrix"
    git commit -m "chore: Update component matrix"
    echo "" >&2
    echo "There were updates to the component matrix. Changes were committed; run git push again." >&2
    exit 1
    ;;
  *)
    echo "Usage: component-matrix.sh {check|commit}" >&2
    exit 2
    ;;
esac

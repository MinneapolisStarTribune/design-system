#!/usr/bin/env bash
# This line tells the system to run this script with bash

# Bootstrap script for git workflow helpers
# This script explains how to set up the workflow on your machine

set -e
# Exit immediately if any command fails (safety feature)

# Find the repo root directory (works no matter where repo is cloned)
REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

# Build the full path to the workflow script
WORKFLOW_SCRIPT="$REPO_ROOT/scripts/git-workflow.sh"

cat << EOF

--------------------------------------------
For complete setup instructions, see:
docs/git-workflow.md
--------------------------------------------

Your personalized setup path:

Add this to your ~/.zshrc (or ~/.bashrc):

# --- Repo git workflow helpers ---
source "$WORKFLOW_SCRIPT"

EOF

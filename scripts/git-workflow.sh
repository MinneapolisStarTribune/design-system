#!/usr/bin/env bash

# Git workflow helpers for release-based branching
# Source this file in your shell - for instructions, see bootstrap-git-aliases.sh

verify_correct_repo() {
  # Verify we're in the design-system repo
  # Check remote URL contains "design-system" or repo has our marker file
  local remote_url
  remote_url=$(git remote get-url origin 2>/dev/null || echo "")
  
  if [[ -n "$remote_url" ]] && [[ "$remote_url" =~ design-system ]]; then
    return 0
  fi
    
  echo "❌ Not in the design-system repository"
  echo "   These workflow commands are specific to this repo"
  return 1
}

list_release_branches() {
  # Fetch to ensure we have latest remote branches
  git fetch origin --quiet
  
  # Get all release/* branches from origin, remove "origin/" prefix and whitespace, sort by version
  git branch -r --list 'origin/release/*' | sed 's|origin/||; s|^[[:space:]]*||' | sort -V
}

# Get the active release branch (must be pinned)
get_release_branch() {
  verify_correct_repo || return 1
  
  local pin_file=".git/.release-branch"
  
  # Pin file is required
  if [[ ! -f "$pin_file" ]]; then
    echo "❌ No release branch pinned" >&2
    echo "" >&2
    echo "   You must pin a release branch first:" >&2
    echo "   1. Checkout a release branch: git checkout release/X.Y.Z" >&2
    echo "   2. Pin it: setrelease" >&2
    return 1
  fi
  
  local pinned
  pinned=$(sed 's|^[[:space:]]*||; s|[[:space:]]*$||' "$pin_file")
  
  if [[ -z "$pinned" ]]; then
    echo "❌ Release branch pin file is empty" >&2
    echo "   Run: setrelease" >&2
    return 1
  fi
  
  echo "$pinned"
}

# Pin the current branch as the active release
setrelease() {
  verify_correct_repo || return 1
  
  local current_branch
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  
  if [[ ! "$current_branch" =~ ^release/ ]]; then
    echo "❌ Current branch '$current_branch' is not a release branch"
    echo "   Checkout a release branch first: git checkout release/X.Y.Z"
    return 1
  fi
  
  local pin_file=".git/.release-branch"
  echo "$current_branch" > "$pin_file"
  echo "✅ Pinned release branch: $current_branch"
}

# Create a new feature branch from the pinned release branch
newbranch() {
  verify_correct_repo || return 1
  
  if [[ -z "$1" ]]; then
    echo "❌ Please provide a branch name"
    echo "   Usage: newbranch my-feature-name"
    echo "   Example: newbranch sus-87-add-new-button"
    return 1
  fi
  
  local branch_name="$1"
  local release_branch
  release_branch=$(get_release_branch) || return 1
  
  echo "🌿 Creating branch '$branch_name' from $release_branch..."
  
  # Stash any uncommitted changes
  local stashed=false
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git stash push -u -m "newbranch auto-stash" || return 1
    stashed=true
    echo "📦 Changes stashed"
  fi
  
  # Update release branch from origin
  git fetch origin "$release_branch" --quiet || return 1
  git checkout "$release_branch" --quiet || return 1
  git pull origin "$release_branch" --quiet 2>/dev/null || echo "⚠️  Could not pull $release_branch (may not exist on origin yet)"
  
  # Create and checkout new branch
  git checkout -b "$branch_name" --quiet || {
    echo "❌ Failed to create branch '$branch_name'"
    echo "   Branch might already exist. Check with: git branch -a"
    if [[ "$stashed" == true ]]; then
      git stash pop || true
    fi
    return 1
  }
  
  # Restore stashed changes if any
  if [[ "$stashed" == true ]]; then
    git stash pop || {
      echo "⚠️  Stash conflicts detected"
      echo "   Resolve manually."
      return 1
    }
    echo "📦 Changes restored"
  fi
  
  echo "✅ Created and switched to branch '$branch_name'"
  echo "   Based on: $release_branch"
}

# Show which release branch is active
whichrelease() {
  verify_correct_repo || return 1
  
  local pin_file=".git/.release-branch"
  
  if [[ ! -f "$pin_file" ]]; then
    echo "❌ No release branch pinned"
    echo ""
    echo "   Pin a release branch:"
    echo "   1. git checkout release/X.Y.Z"
    echo "   2. setrelease"
    return 1
  fi
  
  local release_branch
  release_branch=$(sed 's|^[[:space:]]*||; s|[[:space:]]*$||' "$pin_file")
  
  if [[ -z "$release_branch" ]]; then
    echo "❌ Release branch pin file is empty"
    echo "   Run: setrelease"
    return 1
  fi
  
  echo "📌 Active release (pinned): $release_branch"
}

# Daily sync: stash, update release branch, rebase, restore
goodMorning() {
  # Handle errors explicitly (no set -e) to prevent terminal from closing in VS Code/Cursor
  verify_correct_repo || return 1
  
  local release_branch
  release_branch=$(get_release_branch) || return 1
  
  echo "🌅 Syncing with $release_branch..."
  
  # Capture original branch before any checkouts
  local original_branch
  original_branch=$(git rev-parse --abbrev-ref HEAD) || return 1
  
  # Stash uncommitted changes
  local stashed=false
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git stash push -u -m "goodMorning auto-stash" || return 1
    stashed=true
    echo "📦 Changes stashed"
  fi
  
  # Update release branch from origin
  git fetch origin "$release_branch" --quiet || return 1
  git checkout "$release_branch" --quiet || return 1
  git pull origin "$release_branch" --quiet 2>/dev/null || echo "⚠️  Could not pull $release_branch (may not exist on origin yet)"
  
  # If we were already on the release branch, we're done
  if [[ "$original_branch" == "$release_branch" ]]; then
    echo "✨ Already on $release_branch and up to date"
  else
    # Switch back to original branch and rebase
    git checkout "$original_branch" --quiet || return 1
    
    if ! git rebase "$release_branch"; then
      echo "🚨 Rebase conflict with $release_branch"
      echo "   Resolve conflicts, then run: git rebase --continue"
      if [[ "$stashed" == true ]]; then
        echo "   (Your stashed changes are still in the stash)"
      fi
      return 1
    fi
  fi
  
  # Restore stashed changes
  if [[ "$stashed" == true ]]; then
    if ! git stash pop; then
      echo "⚠️  Stash conflicts detected"
      echo "   Resolve manually: git stash list"
      return 1
    fi
    echo "📦 Changes restored"
  fi
  
  echo "✨ You're amazing! Have a good day!"
}

# Push current feature branch (with protection for main and release/*)
gitpushmybranch() {
  verify_correct_repo || return 1
  
  local branch
  branch=$(git rev-parse --abbrev-ref HEAD)
  
  if [[ "$branch" == "main" || "$branch" =~ ^release/ ]]; then
    echo "❌ Refusing to push protected branch: $branch"
    echo "   Use explicit: git push origin $branch"
    return 1
  fi
  
  git push origin "$branch"
}

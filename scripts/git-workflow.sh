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

# Helper: Stash uncommitted changes
_stash_changes() {
  local stash_message="$1"
  local -n stashed_ref="$2"
  
  stashed_ref=false
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git stash push -u -m "$stash_message" || return 1
    stashed_ref=true
    echo "📦 Changes stashed"
  fi
}

# Helper: Restore stashed changes
_restore_stash() {
  local stashed="$1"
  
  if [[ "$stashed" == true ]]; then
    if ! git stash pop; then
      echo "⚠️  Stash conflicts detected"
      echo "   Resolve manually: git stash list"
      return 1
    fi
    echo "📦 Changes restored"
  fi
}

# Helper: Core sync logic - stash, fetch, update release branch, rebase, restore
# Args:
#   $1: stash_message (default: "auto-stash")
#   $2: skip_if_on_release (default: "true" - skip rebase if already on release branch)
# Returns: 0 on success, 1 on error
_sync_with_release_branch() {
  local stash_message="${1:-auto-stash}"
  local skip_if_on_release="${2:-true}"
  
  verify_correct_repo || return 1
  
  local release_branch
  release_branch=$(get_release_branch) || return 1
  
  # Capture original branch before any checkouts
  local original_branch
  original_branch=$(git rev-parse --abbrev-ref HEAD) || return 1
  
  # Stash uncommitted changes
  local stashed=false
  _stash_changes "$stash_message" stashed || return 1
  
  # Fetch and update release branch from origin
  git fetch origin "$release_branch" --quiet || return 1
  git checkout "$release_branch" --quiet || return 1
  git pull origin "$release_branch" --quiet 2>/dev/null || echo "⚠️  Could not pull $release_branch (may not exist on origin yet)"
  
  # If we were already on the release branch and skip_if_on_release is true, we're done
  if [[ "$skip_if_on_release" == "true" && "$original_branch" == "$release_branch" ]]; then
    echo "✨ Already on $release_branch and up to date"
  else
    # Switch back to original branch and rebase (if not already on release branch)
    if [[ "$original_branch" != "$release_branch" ]]; then
      git checkout "$original_branch" --quiet || return 1
      echo "🔄 Rebasing $original_branch on top of $release_branch..."
      
      if ! git rebase "$release_branch"; then
        echo "🚨 Rebase conflict with $release_branch"
        echo "   Resolve conflicts, then run: git rebase --continue"
        if [[ "$stashed" == true ]]; then
          echo "   (Your stashed changes are still in the stash)"
        fi
        return 1
      fi
    fi
  fi
  
  # Restore stashed changes
  _restore_stash "$stashed" || return 1
  
  return 0
}

# Daily sync: updates your branch with latest from release branch (no push)
# Use this to sync your feature branch with the pinned release branch
syncmybranch() {
  verify_correct_repo || return 1
  
  local release_branch
  release_branch=$(get_release_branch) || return 1
  
  echo "🌅 Syncing with $release_branch..."
  
  if ! _sync_with_release_branch "syncmybranch auto-stash" "true"; then
    return 1
  fi
  
  echo "✨ You're amazing! Have a good day!"
}

# Sync + push: updates your branch with release branch, then pushes to origin
# Use this to sync your feature branch and push it in one command
# Protected branches (main, release/*) are not allowed - use explicit git push for those
gitpushmybranch() {
  verify_correct_repo || return 1
  
  local branch
  branch=$(git rev-parse --abbrev-ref HEAD)
  
  if [[ "$branch" == "main" || "$branch" =~ ^release/ ]]; then
    echo "❌ Refusing to push protected branch: $branch"
    echo "   Use explicit: git push origin $branch"
    return 1
  fi
  
  local release_branch
  release_branch=$(get_release_branch) || return 1
  
  echo "🚀 Pushing $branch (syncing with $release_branch first)..."
  
  # Sync with release branch (always rebase, even if on release branch - but we're on feature branch)
  if ! _sync_with_release_branch "gitpushmybranch auto-stash" "false"; then
    return 1
  fi
  
  # Push feature branch to github
  git push origin "$branch" || return 1
  echo "✅ Pushed $branch to origin"
}
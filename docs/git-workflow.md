# Git Workflow

We use a **main → release/\* → feature** branching strategy designed to keep production stable while allowing fast, low-friction feature development.

This document explains:

- How branches are expected to flow
- How the team selects the active release branch
- The helper scripts and shell commands that make this easy

## Branch Roles

### `main` (Production)

- Represents what is currently in production
- Protected branch
- Merges into `main` only come from `release/*`

### `release/*` (Pre‑Prod)

Examples:

```
release/0.1.0
release/0.1.1
```

- Represents the next production release
- Stage always points at the _lowest_ active release branch (i.e. `release/0.1.0` not `release/0.2.0`)
- QA and final fixes happen here
- Feature branches rebase and merge onto this branch, **not `main`**

### Feature branches

- Named freely (`feature/foo`, `bugfix/bar`, etc.)
- Always branch **from the active release branch**
- Regularly rebased onto the release branch

## Pinning a Release Branch

**You must pin a release branch before using workflow commands.** This ensures everyone is working against the same release target and prevents accidental drift.

### How to pin

1. Checkout the release branch you want to work with:

   ```sh
   git checkout release/0.2.0
   ```

2. Pin it:

   ```sh
   setrelease
   ```

This creates a local file:

```
.git/.release-branch
```

Containing:

```
release/0.2.0
```

From this point on:

- All workflow commands (`syncmybranch`, `newbranch <name>` etc.) will use this release branch
- The file is **local only** (never committed)
- Each developer controls their own pin

### When to change it

After we have bumped up our version number, the release captain will create a new release branch and announce it (loudly!) to the team in slack.

## Setup

1. Run the bootstrap script to get your personalized source path:

   ```sh
   ./scripts/bootstrap-git-aliases.sh
   ```

2. Add the printed `source "..."` line to the end of `~/.zshrc` (or `~/.bashrc`).

3. Reload your shell (`source ~/.zshrc`) and verify:

   ```sh
   whichrelease   # "command not found" means the path is wrong
   ```

4. Pin your first release branch:

   ```sh
   git checkout release/0.1.0   # or whichever release branch exists
   setrelease
   whichrelease                 # should print the pinned branch
   ```

## Available Commands

After setup, these commands are available:

- `setrelease` - Pin the current release branch locally (required before using other commands)
- `whichrelease` - Show which release branch is currently pinned
- `newbranch <name>` - Create a new feature branch from the pinned release branch
- `syncmybranch` - Sync your branch with the pinned release branch (stash, update release branch, rebase, restore). Does NOT push.
- `gitpushmybranch` - Sync your branch with the pinned release branch, then push to origin. Safe - won't push main/release branches.

These are all defined and live in the below file. If anything needs to change, update it there.

```
scripts/git-workflow.sh
```

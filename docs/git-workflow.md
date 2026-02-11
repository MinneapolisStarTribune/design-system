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

- All workflow commands (`goodMorning`, `newbranch <name>` etc.) will use this release branch
- The file is **local only** (never committed)
- Each developer controls their own pin

### When to change it

After we have bumped up our version number, the release captain will create a new release branch and announce it (loudly!) to the team in slack.

## Setup

### Step 1: Get your personalized setup path

Run the bootstrap script in your terminal to see your personalized file path:

```sh
./scripts/bootstrap-git-aliases.sh
```

This will show you the exact path you need to add to your shell config. The path will be customized for your system.

### Step 2: Open your shell config file

Your shell config file is where your terminal settings are stored.

You can use any text editor you're comfortable with:

**Option A - VS Code (recommended for beginners):**

```sh
code ~/.zshrc
```

**Option B - Terminal text editors:**

```sh
vim ~/.zshrc        # Press 'i' to edit, ESC then ':wq' to save and quit
nano ~/.zshrc       # Use Ctrl+X, then Y, then Enter to save
```

### Step 3: Add the workflow script

Scroll to the bottom of the file and add these lines (use the actual path from Step 1):

```bash
# --- Repo git workflow helpers ---
source "/Users/YOUR_USERNAME/design-system/scripts/git-workflow.sh"
```

⚠️ Notes:

- Replace `/Users/YOUR_USERNAME/design-system/` with the actual path shown when you run the bootstrap script
- Add it at the END of the file (after any existing content)
- Don't delete anything that's already in the file

### Step 4: Save the file

### Step 5: Reload your shell

Close and reopen your terminal, OR run:

```sh
source ~/.zshrc
```

### Step 6: Verify it worked

Run this command to test:

```sh
whichrelease
```

You should see an error about no release branch pinned (that's expected!). If you see "command not found", something went wrong - check the path in Step 3.

### Step 7: Set up your first release branch

Before using the workflow, you need to pin a release branch:

1. Checkout a release branch:

   ```sh
   git checkout release/0.1.0
   ```

   (Use whatever release branch exists in this repo)

2. Pin it:

   ```sh
   setrelease
   ```

3. Verify:
   ```sh
   whichrelease
   ```
   (Should show your pinned release branch)

### Troubleshooting

- **"command not found":** Check that the path in Step 3 is correct. Run `./scripts/bootstrap-git-aliases.sh` again to see the correct path.
- **"permission denied":** Make sure you saved the file correctly.
- **"No such file or directory":** The path might be wrong - run the bootstrap script again to see the correct path for your system.
- **"Nothing happens when I run commands":** You probably copied `source "$WORKFLOW_SCRIPT"` instead of the actual path. Run the bootstrap script to see the real path, then copy that.

## Available Commands

After setup, these commands are available:

- `setrelease` - Pin the current release branch locally (required before using other commands)
- `whichrelease` - Show which release branch is currently pinned
- `newbranch <name>` - Create a new feature branch from the pinned release branch
- `goodMorning` - Daily sync workflow (stash, update, rebase, restore)
- `gitpushmybranch` - Push current feature branch (safe - won't push main/release)

These are all defined and live in the below file. If anything needs to change, update it there.

```
scripts/git-workflow.sh
```

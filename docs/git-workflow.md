# Git Workflow

We use **trunk-based development**: `main` is the single source of truth, all work branches from `main`, and all PRs target `main`. Releases are cut from `main` by merging the automated "Version Packages" PR (see [release-runbook.md](release-runbook.md)).

> **Migrating from the old flow?** This repo previously used release branches (`release/X.Y.Z`) with helper aliases (`setrelease`, `newbranch`, `syncmybranch`, `gitpushmybranch`). Those are gone. Delete the `source ".../git-workflow.sh"` line from your `~/.zshrc`/`~/.bashrc`, and branch from `main` like any other repo.

## Branch Roles

### `main`

- The single source of truth. Every commit on `main` has passed CI and review.
- Protected: 2 approvals required, squash or merge commit (no rebase).
- Deploys the production Storybook on every merge.
- Releases to GitHub Packages are tagged directly on `main` commits, so a tag always points at exactly the code that was published.

### Feature branches

- Named freely (`feature/foo`, `fix/SUS-123-bar`, etc.)
- Branch **from `main`**, PR **to `main`**.
- Rebase or merge `main` in as needed; short-lived branches are the goal.

There are no other long-lived branches. No release branches, no develop branch, no back-merges.

## Day-to-day

```sh
git checkout main && git pull
git checkout -b feature/my-thing
# ...work, commit...
git push -u origin feature/my-thing
```

Open a PR to `main`. CI runs lint, tests, typecheck, Chromatic, and a Storybook preview deploy.

**If your PR changes the published package** (`packages/design-system`), add a changeset before merging:

```sh
yarn changeset
```

Pick the bump type (patch/minor/major) and write a one-or-two-sentence summary. That summary becomes the CHANGELOG entry and release notes, so write it for consumers of the library. Commit the generated file in `.changeset/` with your PR.

Changes that don't affect the published package (docs, CI, Storybook-only work) don't need a changeset.

## What about work that shouldn't ship yet?

Merging to `main` means the code goes out in the next release. If your work isn't ready to be public:

1. **Merge it dark** (preferred): land the code but don't export it from the public API (`src/index.ts`), or gate it behind a prop/flag. Unexported code is unreachable by consumers and tree-shakes away.
2. **Hold the PR**: fine for a few days. A branch held for weeks is a sign it should be merged dark instead.
3. **Prerelease branch** (rare, e.g. a v2 breaking-change stream): changesets supports publishing `-next.N` versions from a dedicated branch. See the runbook before reaching for this.

## Releasing

You don't release from your feature branch. The changesets bot keeps a "Version Packages" PR open against `main` that accumulates all pending changesets. Merging that PR bumps the version, updates the CHANGELOG, publishes to GitHub Packages, tags the commit, and announces in Slack. Details in [release-runbook.md](release-runbook.md).

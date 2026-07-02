# Release Runbook

**Package:** `@minneapolisstartribune/design-system`  
**Registry:** GitHub Packages  
**Maintained by:** Platform / Shared UI  
**Current version:** `v1.11.0`

---

## Overview

This document is the single source of truth for cutting a release of the design system. It covers both **feature releases** (new components, API changes) and **hotfix releases** (urgent patches to a shipped version), including the decision of when to publish a package to GitHub Packages and when to absorb the work into the next scheduled release.

All release automation runs through GitHub Actions. Steps marked **\[Auto\]** fire without intervention once the preceding manual step is complete.

> **Key rule:** Only branches named `release/*` may merge into `main`. Feature branches, hotfix branches, and any other work must target a release branch first. This is enforced by CI and will block the PR if violated.

---

## Release Types

| Type | Example | Publish? | Description |
|---|---|---|---|
| **Feature Release** | `v1.11.0 → v1.12.0` | Always | Scheduled releases with new components, token updates, or API changes. Patch digit is `0`. |
| **Hotfix / Patch Release** | `v1.11.0 → v1.11.1` | Optional | Targeted fixes to a shipped version. May be absorbed into the next feature release instead. Patch digit is > `0`. |

> **Terminology note:** The team sometimes calls feature releases "major" and hotfixes "minor." This does not map to semver — the package is still at major version `1`. Use "feature release" and "hotfix" to avoid ambiguity.

---

## Feature Release Flow

_Example: cutting `v1.12.0`_

### 1. Create the release branch `[Manual]`

Go to [Actions → "Create release branch"](https://github.com/MinneapolisStarTribune/design-system/actions/workflows/create-release-branch.yml) → **Run workflow**.

- `release_version`: `1.12.0` or `v1.12.0` (both accepted)
- `base_branch`: `main` (default)

Creates `release/1.12.0` from the tip of `main`. Exits cleanly if the branch already exists.

### 2. Develop against the release branch `[Manual]`

Cut feature branches **from** `release/1.12.0` — not from `main`. Open PRs targeting `release/1.12.0`.

- 2 approvals required before merge
- Squash or merge commit — no rebase

### \[Auto\] PR checks run on every PR

- `lint.yml` — ESLint, Prettier, TypeScript typecheck
- `component-tests.yml` — unit tests + a11y tests with Codecov upload
- `chromatic.yml` — visual regression (only runs if `.stories.ts/tsx` or `.storybook/` changed)

### 3. Open PR: `release/1.12.0` → `main` `[Manual]`

When all features are merged and the release is ready to ship, open a PR from `release/1.12.0` → `main`.

The `merging-to-main-restriction` check passes automatically because the source branch starts with `release/`. All other checks also run. 2 approvals required.

### 4. Merge the PR `[Manual]`

Squash or merge commit — match what the team used for feature PRs on this release.

### \[Auto\] Back-merge PRs created

`back-merge-main-to-release.yml` fires immediately. It finds any release branches with a version number higher than the one just merged and opens a PR from `main` → that branch. Review and merge these promptly to avoid divergence.

### 5. Create a GitHub Release and tag `[Manual — last manual step]`

Go to [Releases → "Draft a new release"](https://github.com/MinneapolisStarTribune/design-system/releases/new).

- **Tag:** `v1.12.0` — must match `vX.Y.Z` exactly
- **Target:** `main` — always tag against main, never a release branch
- Write release notes and click **Publish release**

Clicking **Publish release** is the trigger. Everything after this — the npm publish, the version bump, the Slack post — happens automatically. No further action is needed.

> ⚠️ **Tag caution:** "Restrict creations" is currently **unchecked** in branch protection — any team member with write access can push a tag and trigger the publish pipeline immediately. Coordinate before creating tags and verify `main` is in the correct state.

### \[Auto\] Publish pipeline runs — no action required

`publish.yml` fires on the `release: published` event:

1. Checks out `main` (not the tag ref — published code always comes from `main`)
2. Validates tag format — fails early if not `vX.Y.Z`
3. Runs `release:verify` gates (web, native, a11y)
4. Regenerates and commits the component matrix if changed
5. Bumps version in `packages/design-system/package.json`, commits, pushes to `main`
6. Builds and publishes `@minneapolisstartribune/design-system@1.12.0` to GitHub Packages

Simultaneously, `release-changelog.yml` generates a changelog from merged PR titles and posts to Slack.

> **Manual escape hatch:** If the pipeline fails and needs to be re-run, go to [Actions → "Publish Design System" → Run workflow](https://github.com/MinneapolisStarTribune/design-system/actions/workflows/publish.yml) and enter the version manually. Only use this for reruns — not for normal releases.

---

## Hotfix / Patch Release Flow

_Example: cutting `v1.11.1`_

### 1. Create the hotfix release branch `[Manual]`

Go to [Actions → "Create release branch"](https://github.com/MinneapolisStarTribune/design-system/actions/workflows/create-release-branch.yml).

- `release_version`: `1.11.1`
- `base_branch`: `main` (since `v1.11.0` is already on `main`)

Creates `release/1.11.1` from the tip of `main`.

### 2. Develop the fix `[Manual]`

Cut fix branches from `release/1.11.1`. PRs target `release/1.11.1`. Same CI gates and 2-approval requirement apply.

### 3. Decide: standalone patch or absorption? `[Decision]`

See [When to Publish](#when-to-publish) for the criteria.

- **Publish as `v1.11.1`** — the fix is urgent and consumers need it before the next feature release. Continue to step 4.
- **Absorb into next feature release** — merge `release/1.11.1` into the next feature release branch (e.g., `release/1.12.0`). `v1.11.1` is never tagged. Skip to that release's flow.

### 4. Merge hotfix branch into main and publish `[Manual]`

_Only if publishing as a standalone patch._

Open PR from `release/1.11.1` → `main`, get 2 approvals, merge. Then go to [Releases → "Draft a new release"](https://github.com/MinneapolisStarTribune/design-system/releases/new), create tag `v1.11.1` targeting `main`, and click **Publish release**. The npm publish, version bump, and Slack changelog all run automatically.

### \[Auto\] Back-merge and publish

Same as the feature release — back-merge workflow fires into higher release branches, and `publish.yml` + `release-changelog.yml` run identically.

---

## Absorption Pattern

The most recent example: hotfix work was done in `release/1.10.1`, but `v1.10.1` was never published. The work was absorbed into `v1.11.0`.

When a hotfix is absorbed, the hotfix release branch still existed and was used for development — it was just never merged to `main` and never tagged. The fix landed in the next feature release branch instead.

**Steps:**

1. Fix is developed in `release/1.10.1` normally
2. Open a PR from `release/1.10.1` → `release/1.11.0` (not `main`)
3. The `merging-to-main-restriction` check does not run (target is not `main`)
4. Normal CI and 2-approval requirement still apply
5. After merge, the fix ships with `v1.11.0`
6. `v1.10.1` is never created — it does not exist in GitHub Packages

> ⚠️ Consumers pinned to `v1.10.0` will not receive the hotfix automatically — they need to upgrade to `v1.11.0`. If the fix is truly urgent, publish the standalone patch instead.

---

## When to Publish

Publishing to GitHub Packages is a one-way action — you cannot unpublish a version.

| Scenario | Publish? | Tag created? | Notes |
|---|---|---|---|
| Feature release (e.g., `v1.12.0`) | **Always** | Yes | No exceptions. |
| Hotfix — urgent, needed now | **Yes** | Yes | Consumers cannot wait for the next feature release. |
| Hotfix — absorbed into next feature release | **No** | No | Fix lands in the feature release instead. |
| Hotfix — next feature release ships soon | **Your call** | Maybe | Days away → absorb. Weeks away → publish the patch. |

---

## Tag Rules

| | |
|---|---|
| **Required format** | `vX.Y.Z` (e.g., `v1.12.0`) |
| **Target branch** | `main` |
| **Validated by** | `validate-tag-format` action — rejects anything not matching `^v[0-9]+\.[0-9]+\.[0-9]+$` |
| **Published code source** | Always `main` — the publish workflow checks out `main` regardless of which commit the tag points to |

**Quick links:** [All tags](https://github.com/MinneapolisStarTribune/design-system/tags) · [All releases](https://github.com/MinneapolisStarTribune/design-system/releases) · [New release](https://github.com/MinneapolisStarTribune/design-system/releases/new)

> ⚠️ **"Restrict creations" is unchecked** in branch protection — any team member with write access can push a `vX.Y.Z` tag and trigger the full publish pipeline. Coordinate before creating tags.

### Pre-flight checklist

Before clicking Publish release:

- [ ] Release branch PR has been merged into `main`
- [ ] All CI checks on `main` are green
- [ ] Version does not already exist — [check the tags list](https://github.com/MinneapolisStarTribune/design-system/tags)
- [ ] Back-merge PRs from the previous step are open and acknowledged
- [ ] Tag is being created against `main`, not a release branch

---

## CI/CD Workflow Reference

All workflows live in `.github/workflows/`.

| Workflow | Trigger | What it does |
|---|---|---|
| `merging-to-main-restriction.yml` | Any PR | Fails if PR targets `main` and source isn't `release/*` |
| `lint.yml` | PR to `main` or `release/**` | ESLint, Prettier, TypeScript typecheck |
| `component-tests.yml` | PR to `main` or `release/**` | Unit + a11y tests; uploads to Codecov |
| `chromatic.yml` | PR to `main` or `release/**` | Visual regression — only if stories or Storybook config changed |
| `create-release-branch.yml` | Manual dispatch | Creates `release/X.Y.Z` from specified base branch |
| `publish.yml` | GitHub Release published _or_ manual dispatch | Checks out `main`; validates tag; runs verify gates; bumps version; builds; publishes to GitHub Packages |
| `release-changelog.yml` | GitHub Release published _or_ manual dispatch | Generates PR-based changelog; posts to Slack |
| `back-merge-main-to-release.yml` | `release/*` merged into `main` | Opens PRs from `main` into all higher release branches |
| `sync-versions-from-vercel.yml` | Schedule / manual | Syncs Storybook version metadata from Vercel |

---

## Branch Protection

Managed in [GitHub repository settings](https://github.com/MinneapolisStarTribune/design-system/settings/branches) — not in code.

### `main`

| Setting | Value |
|---|---|
| Required approvals | 2 |
| Allowed merge types | Squash, Merge commit |
| Source branch rule | `release/*` only (CI-enforced) |
| Restrict creations (tags) | ⚠️ Unchecked — open |
| Direct pushes | CI bot only (bypass app) |

### `release/*`

| Setting | Value |
|---|---|
| Required approvals | 2 |
| Allowed merge types | Squash, Merge commit |
| Direct pushes | CI bot only (bypass app) |
| Feature branches target | This branch (not `main`) |

> The CI bypass app (`GH_BYPASS_APP_ID` / `GH_BYPASS_APP_SECRET`) is used by automated workflows to push directly to protected branches. These secrets must only ever live in GitHub repository secrets — never in code.

---

## Future State — v2.0.0

The team is evaluating conventional commits and semantic release tooling to automate the parts of this workflow that are currently manual.

| Topic | Detail |
|---|---|
| **Conventional Commits** | Standardize prefixes: `feat:`, `fix:`, `chore:`, `BREAKING CHANGE:`. Prerequisite for all automation below. Tool: `commitlint` + lefthook commit-msg hook (lefthook is already in the repo). |
| **Automated versioning** | `semantic-release`, `changesets`, or `release-please` can determine the next version from commit history and create the GitHub Release automatically — eliminating the manual tag step. |
| **Automated changelog** | With conventional commits, `release-changelog.yml` can derive accurate changelogs from commit messages rather than PR title heuristics. |
| **Tooling choice** | `semantic-release` is fully automated and opinionated. `changesets` keeps humans in the loop for version decisions. Given the optional-publish pattern for hotfixes, `changesets` may be the better fit — worth a dedicated discussion before `v2.0.0`. |

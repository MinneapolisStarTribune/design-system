# Release Runbook

**Package:** `@minneapolisstartribune/design-system`
**Registry:** GitHub Packages
**Maintained by:** Platform / Shared UI

---

## Overview

Releases are managed by [changesets](https://github.com/changesets/changesets). `main` is the single source of truth: every PR targets `main`, and the published package is built from the exact `main` commit that gets tagged. There are no release branches.

The flow in one paragraph: each PR that changes the package includes a **changeset** (a small file declaring patch/minor/major plus a summary). A bot keeps a **"Version Packages" PR** open against `main` that accumulates pending changesets into a version bump and CHANGELOG entries. **Merging that PR is the release.** CI then builds, publishes to GitHub Packages, tags the commit, creates a GitHub Release, and posts to Slack. No manual tagging, no manual version bumps.

> The old flow (release branches, `merging-to-main-restriction`, manual GitHub Releases triggering `publish.yml`) was removed in the changesets migration. Git history for this file has the old runbook if you ever need it.

---

## Day-to-day: adding a changeset

When your PR changes `packages/design-system`:

```sh
yarn changeset
```

- Pick the bump type. **patch** = bug fix, no API change. **minor** = new component/prop/feature, backwards compatible. **major** = breaking change to the public API (coordinate with the team first).
- Write the summary for consumers of the library. It becomes the CHANGELOG entry and the release notes, e.g. "Button: added `loading` prop" beats "updated button".
- Commit the generated `.changeset/*.md` file with your PR.

No changeset is needed for docs, CI, or Storybook-only changes. If you want to record explicitly that a PR needs no release, `yarn changeset --empty` documents that.

## Cutting a release

1. Look at the open **"chore: version packages"** PR. Its diff is the release: the version bump, and every pending changeset folded into `CHANGELOG.md`.
2. Sanity-check the bump type (e.g. a release full of fixes should be a patch; an accidental `major` changeset should be caught here).
3. Get the usual 2 approvals and merge it.

Everything after the merge is automatic (`.github/workflows/release.yml`):

1. `release:verify` gates run (web + native + a11y)
2. The package builds and publishes to GitHub Packages **from the merged commit**
3. The commit is tagged `@minneapolisstartribune/design-system@X.Y.Z` and a GitHub Release is created with the changelog
4. Slack channels are notified (design system, shared UI library, all releases)

Release cadence is whatever the team wants: merging the Version Packages PR weekly, per sprint, or on demand are all fine. Unmerged, it just keeps accumulating changes and updating itself.

> **Tag format change:** tags are now `@minneapolisstartribune/design-system@1.14.0` (created by changesets) instead of `v1.14.0`. Historical `v*` tags up to `v1.13.1` remain and still resolve to the old releases.

## Hotfixes

**Fix to the latest published version** (the normal case): trunk-based makes this trivial. Merge the fix PR with a `patch` changeset, then merge the Version Packages PR. Two merges, and the patch is out. If unreleased feature work is already on `main`, it rides along; if it was merged dark (unexported), that's harmless. The old publish-vs-absorb decision still exists in a simpler form: merge the Version PR now (publish) or let the fix wait for the next scheduled release (absorb).

**Fix to an older published version** (rare): branch from the old tag, cherry-pick the fix, bump the patch version by hand, and publish manually with `yarn npm publish` from `packages/design-system`. This is off the paved road on purpose; in practice consumers upgrade to latest.

## Prereleases (optional, for big streams like v2)

For a long-running breaking-change effort, changesets has [prerelease mode](https://github.com/changesets/changesets/blob/main/docs/prereleases.md): on a dedicated branch, `yarn changeset pre enter next` makes publishes come out as `2.0.0-next.N` under a separate dist-tag, so consumers can opt in for testing. Exit with `yarn changeset pre exit` and merge to `main` when it becomes the real release. Don't use this for ordinary "not ready yet" work; merge dark or hold the PR instead (see [git-workflow.md](git-workflow.md)).

---

## CI/CD Workflow Reference

All workflows live in `.github/workflows/`.

| Workflow | Trigger | What it does |
|---|---|---|
| `lint.yml` | PR | ESLint, Prettier, TypeScript typecheck |
| `component-tests.yml` | PR | Unit + a11y tests; uploads to Codecov |
| `chromatic.yml` | PR | Visual regression — only if stories or Storybook config changed |
| `release.yml` | Push to `main` / manual dispatch | Runs verify gates, then either updates the Version Packages PR or publishes, tags, creates the GitHub Release, and posts to Slack |
| `sync-versions-from-vercel.yml` | Schedule / manual | Syncs Storybook version metadata from Vercel |

### Required secrets

| Secret | Used for |
|---|---|
| `GH_BYPASS_APP_ID` / `GH_BYPASS_APP_SECRET` | GitHub App that opens the Version Packages PR and pushes tags. Must only ever live in GitHub repository secrets — never in code. |
| `GH_PUBLISH_TOKEN` | npm auth for publishing to GitHub Packages |
| `SLACK_DESIGN_SYSTEM_RELEASE_WEBHOOK`, `SLACK_SHARED_UI_LIBRARY_WEBHOOK`, `SLACK_ALL_RELEASES_WEBHOOK` | Release announcements |

## Troubleshooting

**Publish failed after the Version PR merged.** Fix the cause, then re-run `release.yml` via workflow dispatch on `main`. `changeset publish` is idempotent: it only publishes versions that aren't on the registry yet, so re-runs are safe and won't double-publish.

**Version PR has a conflict.** The bot force-updates its branch on every push to `main`; conflicts resolve themselves on the next merge to `main`. If it's stuck, close the PR and the bot will recreate it.

**A changeset was wrong (bad bump type or summary).** Changesets are just files in `.changeset/`; edit or delete the file in a normal PR before the release is cut.

**Publishing is a one-way door.** You cannot unpublish from GitHub Packages. The review of the Version Packages PR is the last gate; treat it as such.

## Branch protection (GitHub settings, not code)

| Setting | Value |
|---|---|
| `main` required approvals | 2 |
| Allowed merge types | Squash, Merge commit |
| Direct pushes | CI bot only (bypass app) |
| Tag creation (`@minneapolisstartribune/design-system@*` and `v*`) | Should be restricted to the bypass app via a ruleset, so tag pushes can't trigger or spoof releases |

# Release Runbook

**Package:** `@minneapolisstartribune/design-system`
**Registry:** GitHub Packages
**Maintained by:** Platform / Shared UI

---

## Overview

Releases are managed by [changesets](https://github.com/changesets/changesets). `main` is the single source of truth: every PR targets `main`, and the published package is built from the exact `main` commit that gets tagged. There are no release branches.

The flow in one paragraph: each PR that changes the package includes a **changeset** (a small file declaring patch/minor/major plus a summary). A bot keeps a **"chore: version packages"** PR (the version PR) open against `main` that accumulates pending changesets into a version bump and CHANGELOG entries. **Merging that PR is the release.** CI then builds, publishes to GitHub Packages, tags the commit, creates a GitHub Release, and announces it in Slack. No manual tagging, no manual version bumps.

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

CI enforces this: the **Require changeset** check (`changeset-check.yml`) fails any PR that changes the published package without a changeset. An empty changeset satisfies it.

## Cutting a release

1. Look at the open **"chore: version packages"** PR. Its diff is the release: the version bump, and every pending changeset folded into `CHANGELOG.md`.
2. Sanity-check the bump type (e.g. a release full of fixes should be a patch; an accidental `major` changeset should be caught here).
3. Get the usual 2 approvals and merge it.

Everything after the merge is automatic (`.github/workflows/release.yml`, then `release-notify.yml`):

1. `release:verify` gates run (web + native + a11y)
2. The package builds and publishes to GitHub Packages **from the merged commit**
3. The commit is tagged `@minneapolisstartribune/design-system@X.Y.Z` and a GitHub Release is created with the changelog
4. Publishing the Release triggers `release-notify.yml`, which posts an announcement with a link to the Release to the design system Slack channel. The changelog itself lives in the Release body and `CHANGELOG.md`, not in the Slack message.

Release cadence is whatever the team wants: merging the version PR weekly, per sprint, or on demand are all fine. Unmerged, it just keeps accumulating changes and updating itself.

> **Tag format change:** tags are now `@minneapolisstartribune/design-system@1.14.0` (created by changesets) instead of `v1.14.0`. Historical `v*` tags up to `v1.13.2` remain and still resolve to the old releases.

## Hotfixes

**Fix to the latest published version** (the normal case): trunk-based makes this trivial. Merge the fix PR with a `patch` changeset, then merge the version PR. Two merges, and the patch is out. If unreleased feature work is already on `main`, it rides along; if it was merged dark (unexported), that's harmless. The old publish-vs-absorb decision still exists in a simpler form: merge the version PR now (publish) or let the fix wait for the next scheduled release (absorb).

**Fix to an older published version** (rare): branch from the old tag, cherry-pick the fix, and bump the patch version by hand. Before publishing, run the checkout's own install, verify, and build steps (the `publish.yml` in that checkout has the exact commands) and confirm `packages/design-system/dist/` contains the entrypoints. `dist` is gitignored and `yarn npm publish` does not run a build, so skipping this publishes a package with no code in it, and there is no unpublish. Then publish with `yarn npm publish` from `packages/design-system`. This is off the paved road on purpose; in practice consumers upgrade to latest.

## Prereleases (optional, for big streams like v2)

For a long-running breaking-change effort, changesets has [prerelease mode](https://github.com/changesets/changesets/blob/main/docs/prereleases.md): on a dedicated branch, `yarn changeset pre enter next` makes publishes come out as `2.0.0-next.N` under a separate dist-tag, so consumers can opt in for testing. Exit with `yarn changeset pre exit` and merge to `main` when it becomes the real release. Don't use this for ordinary "not ready yet" work; merge dark or hold the PR instead (see [git-workflow.md](git-workflow.md)).

---

## CI/CD Workflow Reference

All workflows live in `.github/workflows/`.

| Workflow                         | Trigger                                    | What it does                                                                                             |
| -------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `lint.yml`                       | PR                                         | ESLint, Prettier, TypeScript typecheck                                                                   |
| `component-tests.yml`            | PR                                         | Unit + a11y tests; uploads to Codecov                                                                    |
| `chromatic.yml`                  | PR                                         | Visual regression — only if stories or Storybook config changed                                          |
| `changeset-check.yml`            | PR                                         | Fails PRs that change the published package without a changeset                                          |
| `release.yml`                    | Push to `main` / manual dispatch           | Runs verify gates, then either updates the version PR or publishes, tags, and creates the GitHub Release |
| `release-notify.yml`             | GitHub Release published                   | Posts the release announcement to the design system Slack channel                                        |
| `storybook-versioned-deploy.yml` | GitHub Release published / manual          | Builds the released tag's Storybook and deploys it to Vercel production                                  |
| `sync-versions-from-vercel.yml`  | Schedule / after versioned deploy / manual | Rebuilds the version dropdown's `versions.json` from Vercel production deployments                       |

### Storybook environments

Vercel serves three Storybook environments:

- **Production** (`design-system.startribune.com`) — the latest published release. Only `storybook-versioned-deploy.yml` updates it. The Vercel production branch is `production-release`, an empty placeholder branch that exists only because Vercel requires the production branch to be real; nothing ever pushes to it (`vercel.json` disables git deploys for it as a backstop), so merges to `main` cannot deploy here.
- **Stage** (`stage-design-system.startribune.com`) — trunk. The `stage` custom environment in the Vercel dashboard tracks `main`, so every merge deploys it through the git integration.
- **Preview** — every PR branch gets a hashed preview URL through the git integration.

The version dropdown in the Storybook toolbar is built from production deployments: each versioned deploy is stamped with a `vX.Y.Z` label in its metadata, and `sync-versions-from-vercel.yml` turns those into `packages/design-system/.storybook/versions.json` (committed to `main`). The toolbar shows the five most recent entries.

### Required secrets

| Secret                                                 | Used for                                                                                                                |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `GH_BYPASS_APP_ID` / `GH_BYPASS_APP_SECRET`            | GitHub App that opens the version PR and pushes tags. Must only ever live in GitHub repository secrets — never in code. |
| `GH_PUBLISH_TOKEN`                                     | npm auth for publishing to GitHub Packages                                                                              |
| `SLACK_DESIGN_SYSTEM_RELEASE_WEBHOOK`                  | Release announcements                                                                                                   |
| `VERCEL_TOKEN` / `VERCEL_PROJECT_ID` / `VERCEL_ORG_ID` | Storybook deploys to Vercel and the version dropdown sync                                                               |

## Troubleshooting

**Publish failed before anything reached the registry** (verify gates, build, npm error). Fix the cause, then re-run `release.yml` via workflow dispatch on `main`. `changeset publish` only publishes versions that aren't on the registry yet, so re-runs are safe and won't double-publish.

**Publish succeeded but the tag or GitHub Release is missing.** A re-run will **not** recover this: changesets sees the version already on the registry, reports nothing published, and the re-run goes green without doing anything. Recover by hand from a checkout of the released commit on `main`:

1. Missing tag: `yarn changeset tag && git push --tags`
2. Missing Release: `gh release create '@minneapolisstartribune/design-system@X.Y.Z'` with the `CHANGELOG.md` entry for that version as the notes
3. Slack needs no manual step; it fires when the Release is published (`release-notify.yml`)

**The version PR merged, but nothing was published and no tag exists.** Release runs queue in order (`queue: max` in `release.yml`), so this should only happen if the run was canceled by hand or never started. If nothing package-changing has landed on `main` since, a dispatch re-run publishes it. If newer changesets have already landed, a dispatch run just updates the version PR instead, so either let the next release absorb it (the skipped version never exists on the registry; its changes ship with the next version), or publish it by hand from the version PR's merge commit: check it out, run `yarn install && yarn release`, then `git push --tags`, then create the GitHub Release as described above.

**The Slack post failed or never arrived.** Re-run the failed `release-notify.yml` run from the Actions tab. It only posts to Slack, so re-running it never touches the registry or the tags.

**The Storybook production deploy failed, or a version is missing from the dropdown.** Dispatch `storybook-versioned-deploy.yml` with the release tag (either format works: `@minneapolisstartribune/design-system@X.Y.Z` or `vX.Y.Z`). The dropdown updates on the next `sync-versions-from-vercel.yml` run, which fires automatically after the deploy; dispatch it if you don't want to wait.

**The version PR has a conflict.** The bot force-updates its branch on every push to `main`; conflicts resolve themselves on the next merge to `main`. If it's stuck, close the PR and the bot will recreate it.

**A changeset was wrong (bad bump type or summary).** Changesets are just files in `.changeset/`; edit or delete the file in a normal PR before the release is cut.

**Publishing is a one-way door.** You cannot unpublish from GitHub Packages. The review of the version PR is the last gate; treat it as such.

## Branch protection (GitHub settings, not code)

| Setting                                                           | Value                                                                                               |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `main` required approvals                                         | 2                                                                                                   |
| Required checks                                                   | Lint, component tests, and the `Require changeset` job from `changeset-check.yml`                   |
| Allowed merge types                                               | Squash, Merge commit                                                                                |
| Direct pushes                                                     | CI bot only (bypass app)                                                                            |
| Tag creation (`@minneapolisstartribune/design-system@*` and `v*`) | Should be restricted to the bypass app via a ruleset, so tag pushes can't trigger or spoof releases |

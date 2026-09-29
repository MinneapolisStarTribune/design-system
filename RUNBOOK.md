---
title: "design-system runbook"
service: design-system
repo: MinneapolisStarTribune/design-system
criticality: P2
team: UX-designers
alert-channel: TBD
aws-account: N/A
region: N/A
deploy-target: "GitHub Packages (@minneapolisstartribune/design-system); Storybook on Vercel"
owner: UX-designers
status: active
last-reviewed: 2026-09-29
---

<!-- markdownlint-disable MD025 -->
# design-system runbook

Library runbook. Publishing to GitHub Packages is a one-way door: there is no unpublish and no rollback. A bad version is fixed forward here, and consumers pin the last good version in their own repos until that patch is out.

Day-to-day release mechanics: [docs/release-runbook.md](docs/release-runbook.md). Shared Changesets flow: [engineering-handbook Changesets section](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/release-and-changelog.md#changesets-flow-shared-libraries-eg-design-system).

## 1. Service overview

- **What it does:** Publishes `@minneapolisstartribune/design-system` (React web + React Native components and tokens) to GitHub Packages, and the released Storybook to Vercel.
- **Criticality:** P2. A bad publish breaks consumer installs and builds. Already-deployed apps keep running until they install the bad version.
- **Team:** UX-designers
- **Alert channel:** TBD. Until that channel exists, post consumer impact in `#product-engineers`.
- **Links:** [Repo](https://github.com/MinneapolisStarTribune/design-system) · [Release runbook](docs/release-runbook.md) · [Releases](https://github.com/MinneapolisStarTribune/design-system/releases) · [Production Storybook](https://design-system.startribune.com) · [Stage Storybook](https://stage-design-system.startribune.com) · [Vercel project](https://vercel.com/startribune-team-one/design-system)

### Access prerequisites

Publish and Storybook deploys run in GitHub Actions. Do not copy tokens into this file.

- **SSO / cloud profile:** N/A
- **Region:** N/A
- **ZPA:** N/A
- **SSM tunnel:** N/A
- **Keeper:** N/A
- **GitHub:** write access to merge to `main`. Publish auth is the `GH_PUBLISH_TOKEN` Actions secret. The version PR and tags are pushed by the bypass GitHub App (`GH_BYPASS_APP_ID` / `GH_BYPASS_APP_SECRET`).
- **Vercel:** team `startribune-team-one`, project `design-system`. Production Storybook is not a git deploy of `main`.

### What's running now

- **Runtime:** no service process. The artifact is the npm package plus the production Storybook.
- **Current deployment:** latest [GitHub Release](https://github.com/MinneapolisStarTribune/design-system/releases). Tag shape is `@minneapolisstartribune/design-system@X.Y.Z`.
- **Storybook production:** [design-system.startribune.com](https://design-system.startribune.com), updated only by `storybook-versioned-deploy.yml` after a Release. Stage ([stage-design-system.startribune.com](https://stage-design-system.startribune.com)) tracks `main`.

### Upstream status pages

- GitHub: [www.githubstatus.com](https://www.githubstatus.com)
- Vercel: [www.vercel-status.com](https://www.vercel-status.com)
- npm / GitHub Packages: GitHub status (Packages is part of GitHub)

## 2. Architecture

- **Key components:** `packages/design-system` (published), Changesets (`.changeset/`), `release.yml` (version PR or publish), `release-notify.yml` (Slack), `storybook-versioned-deploy.yml` (production Storybook).
- **External dependencies:** GitHub Packages (the registry) and Vercel (Storybook). Registry downtime blocks publish and consumer installs. Vercel downtime blocks Storybook only; the package can still publish.
- **Data flow:** PR adds a changeset → merge to `main` updates the **chore: version packages** PR → merging that PR publishes from that commit, tags it, opens a GitHub Release, announces in Slack, and deploys that tag's Storybook to production.

## 3. Detection & triage

- **How incidents surface:** a red `release.yml` / `release-notify.yml` / `storybook-versioned-deploy.yml` run, a consumer install or typecheck failure after a bump, or a report that production Storybook is stale. There is no Datadog monitor for this library.
- **Severity:** see [incident-response.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/incident-response.md).
  - **P0** — a published version is already in production reader apps and the UI is unusable, and a consumer pin plus redeploy cannot start immediately.
  - **P1** — the bad version is on the registry and consumers are blocked or about to pick it up. Workaround is the pin in §4. This is the usual severity.
  - **P2** — publish, tag, Slack, or Storybook step failed and nothing bad reached consumers.
  - **P3** — wrong changelog text, dropdown lag, docs-only.
  - **P4** — release-process improvements.
- **First 5 minutes:** open the latest Release and the failed Actions run → decide whether a bad version is on the registry → if it is, post the pin guidance in §4 before debugging the workflow.

## 4. Deployment & rollback

Handbook: [Changesets flow](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/release-and-changelog.md#changesets-flow-shared-libraries-eg-design-system) and [Changesets rollback](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/deploy-rollback.md#changesets-shared-npm-packages-eg-design-system). Repo detail: [docs/release-runbook.md](docs/release-runbook.md).

- **Normal publish:**
  1. Feature PR includes a changeset (`yarn changeset`) when `packages/design-system` changes.
  2. Review the open **chore: version packages** PR (bump type and changelog).
  3. Two approvals, then merge. That merge is the release. `release.yml` publishes, tags, and opens the GitHub Release. Do not tag by hand for a normal release.
- **Rollback:** you cannot unpublish or overwrite the version. Do these in order.
  1. Find the bad version and the last good tag on [Releases](https://github.com/MinneapolisStarTribune/design-system/releases).
  2. **Consumer pin.** Post this, with the real versions filled in, to `#product-engineers` and the alert channel. Consumers to notify are in §8.

     ```text
     Bad publish: @minneapolisstartribune/design-system@<bad>
     Last good: @minneapolisstartribune/design-system@<good>
     Pin the exact version (no ^ or ~) and reinstall:
       yarn add @minneapolisstartribune/design-system@<good>
     Do not upgrade until the patch release is announced.
     ```

  3. **Fix forward.** Branch from `main`, add a `patch` changeset, merge the fix, then merge the new **chore: version packages** PR. Do not republish `<bad>`.
  4. Confirm the new version exists on the Release page, then reply on the pin thread with the good version consumers may upgrade to.
- **Verify success:** `yarn npm info @minneapolisstartribune/design-system --fields version` shows the patch, the GitHub Release exists, and production Storybook at [design-system.startribune.com](https://design-system.startribune.com) matches that tag. Already-deployed consumer apps recover only after they pin and redeploy.

Storybook-only rollback is a Vercel production promote of the previous Storybook deployment. That does not remove the npm version.

## 5. Datadog monitors & alerts

This library has no `monitoring-and-observability` monitor manifest and no production monitor. Publish failures show up in GitHub Actions. Consumer impact shows up in the consumer's build, not in a design-system dashboard.

- **Monitor manifest:** none. TBD: no `datadog_monitors/applications/design-system/monitors.yaml`.
- **Alert triage:** [on-call-datadog.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/on-call-datadog.md) applies to the consumer that installed the bad version, not to this repo.

## 6. Common failure modes

Generalized from [docs/release-runbook.md](docs/release-runbook.md#troubleshooting). Full command detail for the rare older-version hotfix stays in that doc.

### Publish failed before the registry

- **Symptoms:** `release.yml` is red. The version is not on GitHub Packages and there is no new tag.
- **Diagnosis:** open the failed job. Typical stops are `release:verify`, the build, or npm auth (`GH_PUBLISH_TOKEN`).
- **Mitigation:** fix the cause, then re-run [Release](https://github.com/MinneapolisStarTribune/design-system/actions/workflows/release.yml) via workflow dispatch on `main`. `changeset publish` skips versions already on the registry, so a re-run will not double-publish.
- **Escalate if:** two re-runs fail, or the failure is expired publish credentials.

### Publish succeeded but the tag or GitHub Release is missing

- **Symptoms:** the version is on the registry; the tag and/or Release is absent. Slack will not fire without a Release.
- **Diagnosis:** compare the registry version with [tags](https://github.com/MinneapolisStarTribune/design-system/tags) and [Releases](https://github.com/MinneapolisStarTribune/design-system/releases). A workflow re-run will not recreate them: Changesets sees the version already published and exits green.
- **Mitigation:** from a checkout of that `main` commit, `yarn changeset tag && git push --tags`. Then `gh release create '@minneapolisstartribune/design-system@X.Y.Z'` using that version's `CHANGELOG.md` entry as the notes.
- **Escalate if:** the tag push is rejected by rulesets.

### Version PR merged, but nothing was published and no tag exists

- **Symptoms:** **chore: version packages** is merged; registry and tags are unchanged.
- **Diagnosis:** check whether that `release.yml` run was cancelled or never started (`queue: max`). If newer changesets landed on `main` after it, a dispatch re-run only updates the version PR.
- **Mitigation:** if nothing package-changing landed since, dispatch `release.yml`. Otherwise let the next release absorb it, or from that merge commit run `yarn install && yarn release`, then `git push --tags`, then create the GitHub Release as in the previous scenario.
- **Escalate if:** `yarn release` would publish a commit that is not the one you checked out.

### Release announcement failed

- **Symptoms:** the GitHub Release exists; the shared UI library Slack post did not.
- **Diagnosis:** open the `release-notify.yml` run for that Release.
- **Mitigation:** dispatch `release-notify.yml` with the release tag (`@minneapolisstartribune/design-system@X.Y.Z`). Do not re-run the old run: it uses the workflow file from that run, so a fix to the workflow is not picked up. It only posts to Slack.
- **Escalate if:** the webhook secret is missing or revoked.

### Storybook production deploy failed, or a version is missing from the dropdown

- **Symptoms:** the package published, but [design-system.startribune.com](https://design-system.startribune.com) is unchanged or the toolbar dropdown lacks the version.
- **Diagnosis:** open `storybook-versioned-deploy.yml` for that Release. Production Storybook does not deploy on merge to `main`.
- **Mitigation:** dispatch `storybook-versioned-deploy.yml` with the release tag (`@minneapolisstartribune/design-system@X.Y.Z` or `vX.Y.Z`). The dropdown updates on the following `sync-versions-from-vercel.yml` run; dispatch that workflow if you are not waiting for the schedule.
- **Escalate if:** Vercel production still serves the previous Storybook after a green versioned deploy.

### Version PR has a conflict

- **Symptoms:** **chore: version packages** cannot merge.
- **Diagnosis:** the bot force-updates its branch on every push to `main`. A conflict that survives the next merge to `main` is stuck.
- **Mitigation:** close the PR. The bot recreates it. Do not hand-edit version numbers on that branch.
- **Escalate if:** the recreated PR is absent after a later push to `main`.

### Changeset was wrong

- **Symptoms:** bump type or changelog summary is wrong, and the version PR is still open.
- **Diagnosis:** the pending entry is a file in `.changeset/` and the version PR diff.
- **Mitigation:** edit or delete that file in a normal PR before the version PR merges. If the bad version is already published, treat it as a one-way door and fix forward.
- **Escalate if:** an accidental `major` has already been published. Post the pin immediately.

### Publishing is a one-way door

- **Symptoms:** a version you do not want is already on GitHub Packages.
- **Diagnosis:** the version PR merge was the last gate. Unpublish is not available.
- **Mitigation:** consumer pin, then a patch release (§4). Do not try to republish the same version.
- **Escalate if:** consumers have already shipped the bad version to production.

## 7. Useful commands

```bash
# Last good vs bad
gh release list --repo MinneapolisStarTribune/design-system --limit 10

# What the registry currently serves
yarn npm info @minneapolisstartribune/design-system --fields version

# Consumer pin (run in the consumer repo)
yarn add @minneapolisstartribune/design-system@<last-good>

# Changeset on a fix PR
yarn changeset

# Manual publish from the version-PR merge commit only
yarn install && yarn release
git push --tags
```

## 8. Communication & escalation

- **Status updates:** post the pin text from §4 in `#product-engineers` as soon as a bad version is on the registry. Repeat in the alert channel when `alert-channel` is no longer TBD. Update that thread when the patch Release exists. For an active P0, also follow [incident-response.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/incident-response.md) (`#victorops`, 15–30 min).
- **Next page:** UX-designers. TBD: named on-call rotation for this library.
- **Incident tickets:** Datadog incident for an actual P0. TBD: Jira project for UX-designers.
- **Escalate after:** 15 minutes when a published version is already breaking production consumers; otherwise stay on the 1-hour mitigation (pin guidance posted and patch PR opened).
- **After resolution:** postmortem from [postmortem-template.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/postmortem-template.md) for any P0/P1.

### Downstream blast radius

A bad `@minneapolisstartribune/design-system` version breaks the next install or lockfile update for every consumer. Exact pins are safe until someone bumps. A `^` or `~` range can pick the bad version up on the next resolution.

Confirmed consumers:

- `startribune-web`
- `varsity-web`
- `the-brief`
- `startribune-mobile-app`
- `product-ux-experimentation`
- `agentic-sdlc-test` (`apps/mn101-web`)

Already-deployed sites do not change until that consumer installs and ships the bad version. The pin in §4 is how they stay off it.

---
title: "design-system runbook"
service: design-system
repo: MinneapolisStarTribune/design-system
criticality: P2
team: Loons
alert-channel: "TBD: which channel the release-notify.yml Slack webhook (SLACK_SHARED_UI_LIBRARY_WEBHOOK) posts to"
aws-account: N/A
region: N/A
deploy-target: "GitHub Packages (@minneapolisstartribune/design-system); Storybook on Vercel"
owner: Loons
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
- **Team:** Loons (engineering owner per SW-214). UX designers are consulted on component and token changes; they are not the on-call escalation.
- **Alert channel:** TBD. `release-notify.yml` posts release announcements through the `SLACK_SHARED_UI_LIBRARY_WEBHOOK` secret (Engineering Changelog app); the workflow does not name the target channel. Until an incident channel is confirmed, post consumer impact in `#product-engineers`.
- **Links:** [Repo](https://github.com/MinneapolisStarTribune/design-system) · [Release runbook](docs/release-runbook.md) · [Releases](https://github.com/MinneapolisStarTribune/design-system/releases) · [Production Storybook](https://design-system.startribune.com) · [Stage Storybook](https://stage-design-system.startribune.com) · [Vercel project](https://vercel.com/startribune-team-one/design-system)

### Access prerequisites

Publish and Storybook deploys run in GitHub Actions. Do not copy tokens into this file.

- **SSO / cloud profile:** N/A
- **Region:** N/A
- **ZPA:** N/A
- **SSM tunnel:** N/A
- **Keeper:** N/A
- **GitHub Packages (consumers):** installing the package needs a PAT with `read:packages`; setup is in [accessing-private-resources.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/accessing-private-resources.md).
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
       yarn add --exact @minneapolisstartribune/design-system@<good>
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

Only the failures an on-call responder acts on are here. Release-mechanics recovery (tag or GitHub Release missing, cancelled publish run, Slack post missing, Storybook deploy or version dropdown, version PR conflict, wrong changeset) is in [docs/release-runbook.md → Troubleshooting](docs/release-runbook.md#troubleshooting).

### Bad version published

- **Symptoms:** consumer installs, typechecks, or builds fail after a bump, or a consumer deployed the new version and the UI is broken. The version is on GitHub Packages.
- **Diagnosis:** compare the consumer's installed version with [Releases](https://github.com/MinneapolisStarTribune/design-system/releases). Unpublish is not available; the version PR merge was the last gate.
- **Mitigation:** post the consumer pin from §4 first (`yarn add --exact @minneapolisstartribune/design-system@<good>`), then fix forward with a `patch` changeset and merge the new **chore: version packages** PR. Do not republish `<bad>`.
- **Escalate if:** a consumer has already shipped the bad version to production (P0 path in §3).

### Breaking change shipped as a minor or patch

- **Symptoms:** consumers on `^` or `~` ranges pick the version up on their next install and fail to typecheck or render. Exact pins are unaffected.
- **Diagnosis:** read the Release changelog and diff for removed or renamed exports, prop changes, or token renames that should have been a `major`.
- **Mitigation:** same pin and fix-forward path as above. The patch restores the old API (preferred); if the break is intentional, re-ship it as a `major` with a migration note in the changeset. Say in the pin thread which range shapes are affected.
- **Escalate if:** more than one consumer is already broken, or the fix cannot be a straight restore of the old API.

### Publish workflow failed

- **Symptoms:** `release.yml`, `release-notify.yml`, or `storybook-versioned-deploy.yml` is red. Nothing bad reached consumers (P2).
- **Diagnosis:** open the failed run, then check whether the version is already on the registry (`yarn npm info @minneapolisstartribune/design-system --fields version`). That decides whether a dispatch re-run is enough or whether the tag and Release have to be recreated by hand.
- **Mitigation:** follow the matching entry in [docs/release-runbook.md → Troubleshooting](docs/release-runbook.md#troubleshooting). `changeset publish` skips versions already on the registry, so a dispatch re-run of `release.yml` never double-publishes.
- **Escalate if:** two re-runs fail, or the cause is expired or revoked credentials (`GH_PUBLISH_TOKEN`, Slack webhook).

## 7. Useful commands

```bash
# Last good vs bad
gh release list --repo MinneapolisStarTribune/design-system --limit 10

# What the registry currently serves
yarn npm info @minneapolisstartribune/design-system --fields version

# Consumer pin (run in the consumer repo).
# Yarn 4 saves a caret range unless --exact is set.
yarn add --exact @minneapolisstartribune/design-system@<last-good>

# Changeset on a fix PR
yarn changeset

# Manual publish from the version-PR merge commit only
yarn install && yarn release
git push --tags
```

## 8. Communication & escalation

- **Status updates:** post the pin text from §4 in `#product-engineers` as soon as a bad version is on the registry. Repeat in the alert channel when `alert-channel` is no longer TBD. Update that thread when the patch Release exists. For an active P0, open the incident in `#victorops` and follow [incident-response.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/incident-response.md).
- **Next page:** Loons. UX designers are consulted, not paged. TBD: named on-call rotation for this library.
- **Incident tickets:** Datadog incident for an actual P0. TBD: Jira project for Loons library incidents.
- **Escalate after:** 15 min for P0, 30 min for P1, without progress.
- **After resolution:** postmortem from [postmortem-template.md](https://github.com/MinneapolisStarTribune/engineering-handbook/blob/main/on-call-support/postmortem-template.md) for any P0/P1.

### Downstream blast radius

A bad `@minneapolisstartribune/design-system` version breaks the next install or lockfile update for every consumer. Exact pins are safe until someone bumps. A `^` or `~` range can pick the bad version up on the next resolution.

Confirmed consumers:

- `startribune-web`
- `varsity-web`
- `the-brief`
- `startribune-mobile-app`
- `coaches-portal` (`apps/web`, exact pin `2.1.0`)
- `product-ux-experimentation`
- `agentic-sdlc-test` (`apps/mn101-web`)

Already-deployed sites do not change until that consumer installs and ships the bad version. The pin in §4 is how they stay off it.

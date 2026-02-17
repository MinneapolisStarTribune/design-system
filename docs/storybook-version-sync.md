# Storybook Version Sync

This document explains how the Storybook version dropdown is populated and kept up to date.

## Overview

The version selector in the Storybook header lets users switch between different deployed versions of the design system. The list of versions comes from `.storybook/versions.json`, which is **synced from Vercel** rather than updated manually or on each tag deploy.

## Why Sync from Vercel?

- **Single source of truth**: Vercel retains production deployments. We use that as the canonical list.
- **Simpler deploy flow**: Tag deploys no longer need to checkout `main` and commit; they just build and deploy.
- **Recovery**: If `versions.json` gets out of sync, the next sync run corrects it.

## How It Works

### 1. Sync Workflow

**File**: `.github/workflows/sync-versions-from-vercel.yml`

**Triggers**:

- **Daily** at 9am CST (3pm UTC) // [Can be changes as per needed]
- **Manual** via "Run workflow" in the Actions tab
- **After tag deploy** when "Storybook versioned deploy" completes

**Steps**:

1. Checkout `main`
2. Run `scripts/sync-versions-from-vercel.js`
3. Commit and push `.storybook/versions.json` if it changed

### 2. Sync Script

**File**: `scripts/sync-versions-from-vercel.js`

- Calls Vercel API: `GET /v6/deployments` with `target=stage` (configurable via `VERCEL_SYNC_TARGET`; switch to `production` when ready)
- Extracts version from deployment metadata (`meta.githubCommitRef` or `meta.gitSource.ref`)
- Writes `.storybook/versions.json` with `[{ version, url }, ...]` sorted newest first
- Skips deployments without version metadata

**Required env** (set as GitHub secrets):

- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

**Optional env** (set in workflow or as secret):

- `VERCEL_SYNC_TARGET` – deployment target (`stage` for testing, `production` when ready). Default: `stage`

### 3. Tag Deploy Workflow

**File**: `.github/workflows/storybook-versioned-deploy.yml`

- Triggers on tag push (`v*`)
- Builds Storybook and deploys to Vercel with `--prod` and `--meta "githubCommitRef=$VERSION"`
- Does **not** update `versions.json`; the sync workflow picks it up afterward

## Data Flow

```
Tag push (v0.1.0)
    │
    ▼
Storybook versioned deploy
    │  • Build Storybook
    │  • Deploy to Vercel (prod, with version in meta)
    │
    ▼
Sync versions from Vercel (triggered by workflow_run)
    │  • Fetch prod deployments from Vercel API
    │  • Build versions.json from deployments with version in meta
    │  • Commit to main if changed
    │
    ▼
versions.json updated → Version dropdown reflects new release
```

## Troubleshooting

### Version not appearing in dropdown

- Check that the deployment has the expected `target` (currently `stage`) and `state=READY`
- Verify the deployment has version metadata (e.g. `meta.githubCommitRef` for tag deploys)
- Run the sync workflow manually and check the logs

### Sync workflow fails

- Confirm `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_ORG_ID` are set in repo secrets
- Ensure the token has access to list deployments for the design-system project

### versions.json is empty or stale

- Run "Sync versions from Vercel" manually from the Actions tab
- If deployments don't have version metadata, the script will skip them; tag deploys use `--meta` to set it

### Switching from stage to production

When ready to use production deployments:

1. In `.github/workflows/sync-versions-from-vercel.yml`, change `VERCEL_SYNC_TARGET: stage` to `VERCEL_SYNC_TARGET: production`
2. Or add `VERCEL_SYNC_TARGET` as a repo secret and set it to `production`

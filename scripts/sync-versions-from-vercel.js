#!/usr/bin/env node
/**
 * Sync versions.json from Vercel deployments.
 *
 * Fetches deployments from the Vercel API and builds .storybook/versions.json
 * with { version, url } entries. Version is derived from deployment metadata
 * (e.g. meta.githubCommitRef for tag deploys).
 *
 * Requires env: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID (team)
 * Optional: VERCEL_SYNC_TARGET - deployment target (default: stage for testing, switch to production when ready)
 *
 * Usage: node scripts/sync-versions-from-vercel.js
 */

const fs = require('fs');
const path = require('path');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
const VERCEL_SYNC_TARGET = process.env.VERCEL_SYNC_TARGET || 'stage';

const VERSIONS_JSON_PATH = path.join(__dirname, '../.storybook/versions.json');
const API_BASE = 'https://api.vercel.com';

if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
  console.error('Missing required env: VERCEL_TOKEN, VERCEL_PROJECT_ID');
  process.exit(1);
}

/**
 * Extract version string from deployment meta.
 * Handles: githubCommitRef, gitSource.ref
 * - refs/tags/v0.0.11 -> v0.0.11
 * - v0.0.11, release/0.1.0 -> used as version
 */
function getVersionFromMeta(meta) {
  if (!meta || typeof meta !== 'object') return null;

  const ref = meta.githubCommitRef ?? meta.gitSource?.ref;
  if (!ref || typeof ref !== 'string') return null;

  // refs/tags/v0.0.11 -> v0.0.11
  const tagMatch = ref.match(/refs\/tags\/(.+)$/);
  if (tagMatch) return tagMatch[1];

  // refs/heads/release/0.1.0 -> release/0.1.0
  const branchMatch = ref.match(/refs\/heads\/(.+)$/);
  if (branchMatch) return branchMatch[1];

  // v0.0.11 or release/0.1.0 (already plain)
  if (/^v\d+\.\d+\.\d+/.test(ref) || /^release\/\d+\.\d+\.\d+/.test(ref)) return ref;

  return null;
}

async function fetchDeployments() {
  const params = new URLSearchParams({
    projectId: VERCEL_PROJECT_ID,
    target: VERCEL_SYNC_TARGET,
    state: 'READY',
    limit: '50',
  });
  if (VERCEL_ORG_ID) params.set('teamId', VERCEL_ORG_ID);

  const url = `${API_BASE}/v6/deployments?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vercel API error ${res.status}: ${text}`);
  }

  return res.json();
}

function main() {
  (async () => {
    const { deployments } = await fetchDeployments();

    const versions = [];
    const seen = new Set();

    for (const d of deployments) {
      const url = d.url;
      if (!url) continue;

      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      const version = getVersionFromMeta(d.meta);

      if (!version) {
        console.warn(`Skipping deployment ${d.uid} (no version in meta)`);
        continue;
      }
      if (seen.has(version)) continue;
      seen.add(version);

      versions.push({ version, url: fullUrl });
    }

    // Sort by version descending (newest first)
    // Handles v0.0.11 and release/0.1.0 formats
    versions.sort((a, b) => {
      const parse = (v) => {
        const normalized = v.replace(/^v/, '').replace(/^release\//, '');
        return normalized.split('.').map(Number);
      };
      const pa = parse(a.version);
      const pb = parse(b.version);
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] ?? 0;
        const nb = pb[i] ?? 0;
        if (na !== nb) return nb - na;
      }
      return 0;
    });

    const output = JSON.stringify(versions, null, 2) + '\n';
    fs.writeFileSync(VERSIONS_JSON_PATH, output, 'utf8');
    console.log(`Updated ${VERSIONS_JSON_PATH} with ${versions.length} versions (target: ${VERCEL_SYNC_TARGET})`);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();

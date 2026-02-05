#!/usr/bin/env node
/**
 * Select the release branch with the lowest semantic version.
 *
 * Usage:
 *   node scripts/select-lowest-version-branch.js release/0.2.0 release/0.1.1 release/0.0.4
 *   echo "release/0.2.0 release/0.0.4" | xargs node scripts/select-lowest-version-branch.js
 *
 * Output: the full branch name (e.g. "release/0.0.4") to stdout.
 * Exit: 0 if a branch was selected, 1 if no valid release branches.
 */

const RELEASE_PREFIX = 'release/';
const SEMVER_PATTERN = /^(\d+)\.(\d+)\.(\d+)(?:-[^.]*)?$/;

function parseVersion(versionStr) {
  const match = String(versionStr).trim().match(SEMVER_PATTERN);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function compareVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

/**
 * Normalize branch name: strip remote prefix (origin/) so we get "release/x.y.z".
 * @param {string} branch - e.g. "origin/release/0.1.0" or "release/0.1.0"
 * @returns {string|null} "release/0.1.0" or null if not a release branch
 */
function normalizeBranch(branch) {
  const name = String(branch).trim().replace(/^origin\/?/, '');
  if (!name.startsWith(RELEASE_PREFIX)) return null;
  const versionPart = name.slice(RELEASE_PREFIX.length);
  return parseVersion(versionPart) ? name : null;
}

/**
 * From a list of branch names (e.g. ["release/0.2.0", "release/0.0.4"]),
 * return the branch with the lowest semantic version.
 *
 * @param {string[]} branchNames - list of release branch names
 * @returns {{ branch: string, skipped: string[] } | { branch: null, skipped: string[], error: string }}
 */
function selectLowestVersionBranch(branchNames) {
  const skipped = [];
  const valid = [];

  for (const raw of branchNames) {
    const normalized = normalizeBranch(raw);
    if (normalized) {
      valid.push(normalized);
    } else {
      if (raw.trim() && !raw.trim().startsWith('release/')) {
        skipped.push(raw.trim());
      }
    }
  }

  if (valid.length === 0) {
    return {
      branch: null,
      skipped,
      error: 'No valid release branches found.',
    };
  }

  const versionPart = (b) => b.slice(RELEASE_PREFIX.length);
  valid.sort((a, b) => compareVersions(parseVersion(versionPart(a)), parseVersion(versionPart(b))));
  return { branch: valid[0], skipped };
}

function main() {
  const args = process.argv.slice(2);
  const branchNames = args.length > 0 ? args : [];

  if (branchNames.length === 0) {
    console.error('No release branches provided. Usage: node select-lowest-version-branch.js release/0.1.0 release/0.2.0');
    process.exit(1);
  }

  const result = selectLowestVersionBranch(branchNames);

  if (result.skipped.length > 0) {
    result.skipped.forEach((b) => console.error(`Warning: Skipping invalid branch name: ${b}`));
  }

  if (result.branch === null) {
    console.error(`Warning: ${result.error}`);
    process.exit(1);
  }

  console.log(result.branch);
}

if (require.main === module) {
  main();
}

module.exports = { selectLowestVersionBranch, parseVersion, normalizeBranch };

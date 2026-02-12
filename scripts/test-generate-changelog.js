#!/usr/bin/env node

/**
 * Local test script for generate-release-changelog.js
 *
 * This script uses the GitHub API to test changelog generation.
 *
 * This script is read-only and will:
 *    - Read git tags from GitHub API
 *    - Fetch commit comparisons from GitHub API
 *    - Fetch PR details from GitHub API
 *    - Generate formatted changelog text (output only)
 *
 * Authentication (automatically detected):
 *   1. GitHub CLI (if logged in via `gh auth login`)
 *      - Easiest option if you already use `gh` CLI
 *      - Run: node scripts/test-generate-changelog.js v0.0.8
 *
 *   2. GITHUB_TOKEN environment variable
 *      - Get a token at: https://github.com/settings/tokens
 *      - Required scope: repo (read-only)
 *      - Run: GITHUB_TOKEN=your_token node scripts/test-generate-changelog.js v0.0.8
 *
 * Usage:
 *   node scripts/test-generate-changelog.js [currentTag]
 *
 * Example:
 *   node scripts/test-generate-changelog.js v0.0.8
 */

const { Octokit } = require('@octokit/rest');
const generateChangelog = require('./generate-release-changelog.js');

const consoleSeparator = '='.repeat(60);

// Main test function
async function testChangelog() {
  const { execSync } = require('child_process');

  // Try to get GitHub token from gh CLI first, then fall back to env var
  let token = process.env.GITHUB_TOKEN;
  let tokenSource = 'GITHUB_TOKEN env var';

  if (!token) {
    try {
      // Try to get token from GitHub CLI (if user is logged in with `gh auth login`)
      token = execSync('gh auth token', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
      tokenSource = 'gh CLI';
      console.log('Using GitHub CLI authentication (gh auth token)');
    } catch {
      // gh CLI not available or not logged in
      console.error('ERROR: No GitHub authentication found - please run "gh auth login" from this terminal or set GITHUB_TOKEN');
      process.exit(1);
    }
  } else {
    console.log('Using GITHUB_TOKEN environment variable');
  }

  // Get current tag from command line or use default
  const currentTag = process.argv[2];
  if (!currentTag) {
    console.error('ERROR: Please provide a tag name example: v0.0.8');
    process.exit(1);
  }

  // Initialize real GitHub API client
  const octokit = new Octokit({ auth: token });

  // GitHub Actions context
  const context = {
    repo: {
      owner: 'MinneapolisStarTribune',
      repo: 'design-system'
    }
  };

  console.log(consoleSeparator);
  console.log('Testing Release Changelog Generator (READ-ONLY)');
  console.log(consoleSeparator);
  console.log(`Current Tag: ${currentTag}`);
  console.log(`Repository: ${context.repo.owner}/${context.repo.repo}`);
  console.log(consoleSeparator);

  try {
    const result = await generateChangelog({
      github: octokit,
      context,
      currentTag
    });

    console.log(consoleSeparator);
    console.log('Success Generating Changelog');
    console.log(consoleSeparator);
    console.log(`Has Updates: ${result.hasUpdates}`);

    if (result.hasUpdates) {
      console.log('Generated Slack Message:');
      console.log('-'.repeat(60));
      console.log(result.content);
      console.log('-'.repeat(60));
      console.log('');
      console.log('This message would be posted to Slack by the workflow');
    } else {
      console.log('No PRs found - no changelog generated');
    }

    console.log('Test completed successfully - no changes made to repository');
    return result;
  } catch (error) {
    console.error(consoleSeparator);
    console.error('Error Generating Changelog:');
    console.error(consoleSeparator);
    console.error(error.message);

    if (error.status === 401) {
      console.error('Check if the GITHUB_TOKEN is valid');
    } else if (error.status === 404) {
      console.error('Check that the tag exists in the repository');
    }

    console.error('Stack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testChangelog();
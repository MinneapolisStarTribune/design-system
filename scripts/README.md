# Scripts

This directory contains utility scripts for the repository.

## generate-release-changelog.js

Generates release changelogs from merged PRs between two git tags. Used by the `.github/workflows/release-changelog.yml` workflow.

### How it works

1. Gets the previous release tag using `git describe`
2. Compares commits between previous and current tag using GitHub API
3. Extracts PR numbers from commit messages
4. Fetches PR details and categorizes them:
   - 🐞 **BugFix** - PRs with keywords: bug, fix, hotfix, patch, issue, error, broken
   - ✨ **New** - PRs with keywords: new, feature, add, implement, create, ux, ui, design
   - 🔧 **Maintenance/Engineering** - All other PRs
5. Extracts JIRA tickets from branch names (LOON, VARSITY, PS, NLT, DS)
6. Extracts content from "# Internal Changelog" section in PR bodies
7. Formats everything for Slack posting

### Configuration

Edit these constants in `generate-release-changelog.js` to customize:

```javascript
const JIRA_PROJECTS = ['LOON', 'VARSITY', 'PS', 'NLT', 'DS'];
const JIRA_BASE_URL = 'https://minneapolisstartribune.atlassian.net/browse';
const PRODUCT_NAME = 'Shared UI Library';
```

## Testing Locally

### Option 1: Test in Terminal with Real GitHub API (Recommended)

The test script uses the **GitHub API** to fetch PR data from the repository. This is read-only, so it won't modify anything.

**Usage:**

```bash
node scripts/test-generate-changelog.js v0.0.8 # Uses the gh CLI for authentication
```

Replace `v0.0.8` with any existing tag in your repository. The script will show you what would be posted to Slack without actually posting it.

### Option 2: Test with Units (Mocked)

```bash
yarn test scripts/generate-release-changelog.test.js
```

### Option 3: Test in GitHub Actions

The final way to test is to push your changes to a branch and create a release:

1. Push your changes to GitHub
2. Create a draft release with a test tag (e.g., `v0.0.9-test`)
3. Publish the release
4. Check the Actions tab to see the workflow run
5. Delete the test release and tag from the GitHub UI when done

// Configuration
const JIRA_PROJECTS = ['LOON', 'VARSITY', 'PS', 'NLT', 'DS'];
const JIRA_BASE_URL = 'https://minneapolisstartribune.atlassian.net/browse';
const PRODUCT_NAME = 'Shared UI Library';
const JIRA_REGEX = new RegExp(`(${JIRA_PROJECTS.join('|')})-[0-9]+`);

/**
 * Get the previous release tag using GitHub API
 *
 * @param {Object} params
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.currentTag - Current release tag
 * @returns {Promise<string>} - Previous tag name
 */
async function getPreviousTag({ github, owner, repo, currentTag }) {
  // Fetch two latest tags from GitHub API (most recent first)
  const { data: tags } = await github.rest.repos.listTags({
    owner,
    repo,
    per_page: 2,
  });

  if (tags.length === 0) {
    throw new Error('No tags found in repository. Cannot generate changelog.');
  }

  if (tags.length === 1) {
    throw new Error(
      `No previous tag found. "${currentTag}" is the first release in this repository. ` +
      `For the first release, create a changelog manually or skip changelog generation.`
    );
  }

  console.log(`Fetched ${tags.length} tags from repository`);
  console.log(`- ${tags[0].name} (latest commit: ${tags[0].commit.sha})`);
  console.log(`- ${tags[1].name} (previous commit: ${tags[1].commit.sha})`);

  // Verify the current tag is the most recent tag
  if (tags[0].name !== currentTag) {
    throw new Error(
      `Current tag "${currentTag}" is not the most recent tag. Most recent tag is "${tags[0].name}". ` +
      `Changelog generation should only run for the latest release.`
    );
  }

  const previousTag = tags[1].name;
  console.log(`Previous tag: ${previousTag}`);
  return previousTag;
}

/**
 * Get commits between two tags
 *
 * @param {Object} params
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.previousTag - Previous release tag
 * @param {string} params.currentTag - Current release tag
 * @returns {Promise<Array>} - Array of commits
 */
async function getCommitsBetweenTags({ github, owner, repo, previousTag, currentTag }) {
  const { data } = await github.rest.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead: `${previousTag}...${currentTag}`,
  });

  console.log(`Found ${data.commits.length} commits between tags`);
  return data.commits;
}

/**
 * Extract PR numbers from commits
 *
 * @param {Array} commits - Array of commit objects
 * @returns {Set<number>} - Set of unique PR numbers
 */
function extractPRNumbers(commits) {
  const prNumbers = new Set();

  for (const commit of commits) {
    // Regex matches "Merge pull request #123" and captures the number (123)
    // The parentheses create a capture group at index 1
    const match = commit.commit.message.match(/Merge pull request #(\d+)/);
    if (match) {
      // Convert the captured string to a number (base 10) and add to Set
      // Set automatically deduplicates if the same PR number appears multiple times
      prNumbers.add(parseInt(match[1], 10));
    }
  }

  console.log(`Found ${prNumbers.size} unique PRs`);
  return prNumbers;
}

/**
 * Extract JIRA ticket from branch name
 *
 * @param {string} branchName - Git branch name
 * @returns {string|null} - JIRA ticket ID or null
 */
function extractJiraTicket(branchName) {
  const match = branchName.match(JIRA_REGEX);
  return match?.[0] || null;
}

/**
 * Determine category based on PR title
 *
 * @param {string} prTitle - Pull request title
 * @returns {Object} - { emoji: string, name: string }
 */
function categorizeChange(prTitle) {
  const titleLower = prTitle.toLowerCase();

  if (/(bug|fix|fixing|fixed|hotfix|patch|issue|error|broken)/.test(titleLower)) {
    return { emoji: '🐞', name: 'BugFix' };
  }

  if (/(new|feature|add|adding|added|implement|implementing|create|creating|ux|ui|design)/.test(titleLower)) {
    return { emoji: '✨', name: 'New' };
  }

  return { emoji: '🔧', name: 'Maintenance/Engineering' };
}

/**
 * Extract description from PR body
 *
 * @param {string} prBody - Pull request body text
 * @returns {string} - Extracted description
 */
function extractDescription(prBody) {
  if (!prBody) return '';

  const internalChangelogMatch = prBody.match(/# Internal Changelog\s+([\s\S]*?)(?=\n#|\n$|$)/);
  if (!internalChangelogMatch) return '';

  return internalChangelogMatch[1]
    .split('\n')
    .filter(line => line.trim() && !line.match(/^<!--.*-->$/))
    .slice(0, 10)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build PR summary string
 *
 * @param {Object} params
 * @param {Object} params.pr - Pull request data
 * @param {string} params.categoryEmoji - Category emoji
 * @param {string} params.categoryName - Category name
 * @param {string} params.jiraTicket - JIRA ticket ID
 * @param {string} params.description - PR description
 * @returns {string} - Formatted PR summary
 */
function buildPRSummary({ pr, categoryEmoji, categoryName, jiraTicket, description }) {
  const parts = [`• ${categoryEmoji} **${categoryName}** - ${pr.title}`];

  if (jiraTicket) {
    parts.push(` - [${jiraTicket}](${JIRA_BASE_URL}/${jiraTicket})`);
  }

  if (description) {
    parts.push(`\n${description}`);
  }

  return parts.join('');
}

/**
 * Fetch PR details and build changelog entries
 *
 * @param {Object} params
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {Set<number>} params.prNumbers - Set of PR numbers
 * @returns {Promise<Array<string>>} - Array of PR summaries
 */
async function buildPRSummaries({ github, owner, repo, prNumbers }) {
  const prSummaries = [];

  for (const prNumber of prNumbers) {
    try {
      const { data: pr } = await github.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });

      if (!pr.merged_at) {
        console.log(`Skipping PR #${prNumber} - not merged`);
        continue;
      }

      console.log(`Processing PR #${prNumber}: ${pr.title}`);

      const category = categorizeChange(pr.title);
      const summary = buildPRSummary({
        pr,
        categoryEmoji: category.emoji,
        categoryName: category.name,
        jiraTicket: extractJiraTicket(pr.head.ref),
        description: extractDescription(pr.body),
      });

      prSummaries.push(summary);
    } catch (error) {
      console.error(`Error processing PR #${prNumber}:`, error.message);
    }
  }

  return prSummaries;
}

/**
 * Build final changelog content
 *
 * @param {Array<string>} prSummaries - Array of PR summaries
 * @returns {Object} - { hasUpdates: boolean, content: string }
 */
function buildChangelogContent(prSummaries) {
  if (prSummaries.length === 0) {
    console.log('No PRs to report');
    return { hasUpdates: false, content: '' };
  }

  console.log(`Generated changelog with ${prSummaries.length} PRs`);

  const content = [`🚀 **Deploying to Production!** - ${PRODUCT_NAME} Updates`, '', ...prSummaries].join('\n\n');
  console.log('Changelog content generated');
  console.log(content);
  return {
    hasUpdates: true,
    content: content,
  };
}

/**
 * Generate release changelog from merged PRs between two tags
 *
 * This script extracts PR information, categorizes changes, and formats
 * a changelog for posting to Slack channels.
 *
 * @param {Object} params
 * @param {Object} params.github - Octokit instance from github-script
 * @param {Object} params.context - GitHub Actions context
 * @param {string} params.currentTag - Current release tag
 * @returns {Promise<Object>} - { hasUpdates: boolean, content: string }
 */
module.exports = async ({ github, context, currentTag }) => {
  const { owner, repo } = context.repo;

  const previousTag = await getPreviousTag({ github, owner, repo, currentTag });

  console.log(`Getting PRs between ${previousTag} and ${currentTag}`);
  const commits = await getCommitsBetweenTags({ github, owner, repo, previousTag, currentTag });

  // Extract PR numbers from commits
  const prNumbers = extractPRNumbers(commits);

  // Fetch PR details and build changelog entries
  const prSummaries = await buildPRSummaries({ github, owner, repo, prNumbers });

  return buildChangelogContent(prSummaries)
};
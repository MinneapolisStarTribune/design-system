// Configuration
const JIRA_PROJECTS = ['LOON', 'VARSITY', 'PS', 'NLT', 'SUS'];
const JIRA_BASE_URL = 'https://minneapolisstartribune.atlassian.net/browse';
const PRODUCT_NAME = 'Shared UI Library';
const JIRA_REGEX = new RegExp(`(${JIRA_PROJECTS.join('|')})-[0-9]+`);

/** Same family as .github/actions/validate-tag-format — only these participate in changelog ranges */
const SEMVER_TAG_RE = /^v(\d+)\.(\d+)\.(\d+)$/;

/**
 * @param {string} name
 * @returns {{ major: number; minor: number; patch: number } | null}
 */
function parseSemverTagName(name) {
  const m = name.match(SEMVER_TAG_RE);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
  };
}

/** @returns {number} negative if a < b, 0 if equal, positive if a > b */
function compareSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

/**
 * List all refs/tags (paginated). GitHub does not guarantee tag order matches semver.
 *
 * @param {Object} params
 * @param {import('@octokit/rest').Octokit} params.github
 * @param {string} params.owner
 * @param {string} params.repo
 */
async function listAllTags({ github, owner, repo }) {
  const all = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const { data } = await github.rest.repos.listTags({
      owner,
      repo,
      per_page: perPage,
      page,
    });
    if (data.length === 0) break;
    all.push(...data);
    if (data.length < perPage) break;
    page += 1;
  }
  return all;
}

/**
 * Get the previous semver release tag strictly before currentTag (semver order).
 * Ignores non-semver tags (e.g. v.1.20) so listTags ordering cannot break changelog.
 *
 * @param {Object} params
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.currentTag - Current release tag (e.g. v1.3.3)
 * @returns {Promise<string>} - Previous tag name
 */
async function getPreviousTag({ github, owner, repo, currentTag }) {
  const currentParsed = parseSemverTagName(currentTag);
  if (!currentParsed) {
    throw new Error(
      `Current tag "${currentTag}" is not a semver tag (expected vX.Y.Z, e.g. v1.3.3). Cannot generate changelog.`
    );
  }

  const tags = await listAllTags({ github, owner, repo });
  const semverEntries = [];
  for (const t of tags) {
    const parsed = parseSemverTagName(t.name);
    if (parsed) semverEntries.push({ name: t.name, semver: parsed });
  }

  if (semverEntries.length === 0) {
    throw new Error('No semver tags found in repository. Cannot generate changelog.');
  }

  const hasCurrent = semverEntries.some(e => e.name === currentTag);
  if (!hasCurrent) {
    throw new Error(`Tag "${currentTag}" not found among semver tags in the repository.`);
  }

  let best = null;
  for (const e of semverEntries) {
    if (e.name === currentTag) continue;
    const cmp = compareSemver(e.semver, currentParsed);
    if (cmp >= 0) continue;
    if (!best || compareSemver(e.semver, best.semver) > 0) {
      best = e;
    }
  }

  if (!best) {
    throw new Error(
      `No previous semver tag found before "${currentTag}". ` +
        `For the first release, create a changelog manually or skip changelog generation.`
    );
  }

  console.log(`Current tag: ${currentTag}; previous semver tag for range: ${best.name}`);
  return best.name;
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

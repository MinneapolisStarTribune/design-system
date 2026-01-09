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

  // Get the previous release tag using GitHub API
  let previousTag;
  try {
    // Fetch two latest tags from GitHub API
    const { data: tags } = await github.rest.repos.listTags({
      owner,
      repo,
      per_page: 2,
    });

    if (tags.length === 0) {
      throw new Error('No tags found in repository. Cannot generate changelog.');
    } else if (tags.length === 1) {
      // Only one tag exists - no previous tag
      throw new Error(
        `No previous tag found. "${currentTag}" is the first release in this repository. ` +
        `For the first release, create a changelog manually or skip changelog generation.`
      );
    }

    console.log(`Fetched ${tags.length} tags from repository`);
    for (const tag of tags) {
      console.log(`- ${tag.name} (commit: ${tag.commit.sha})`);
    }

    // Find the index of the current tag
    const currentTagIndex = tags.findIndex(tag => tag.name === currentTag);

    if (currentTagIndex === -1) {
      throw new Error(`Current tag "${currentTag}" not found in repository. Available tags: ${tags.slice(0, 5).map(t => t.name).join(', ')}`);
    }

    // Get the previous tag (next in the list since tags are sorted by date, newest first)
    if (currentTagIndex === tags.length - 1) {
      // This is the first/oldest tag - no previous tag exists
      throw new Error(
        `No previous tag found. "${currentTag}" is the first release in this repository. ` +
        `For the first release, create a changelog manually or skip changelog generation.`
      );
    }

    previousTag = tags[currentTagIndex + 1].name;
    console.log(`Previous tag: ${previousTag}`);
  } catch (error) {
    // Re-throw with helpful context
    if (error.message.includes('No previous tag') || error.message.includes('not found')) {
      throw error;
    }
    throw new Error(`Failed to get previous tag from GitHub API: ${error.message}`);
  }

  console.log(`Getting PRs between ${previousTag} and ${currentTag}`);

  // Configuration
  const JIRA_PROJECTS = ['LOON', 'VARSITY', 'PS', 'NLT', 'DS'];
  const JIRA_BASE_URL = 'https://minneapolisstartribune.atlassian.net/browse';
  const PRODUCT_NAME = 'Shared UI Library';

  // Get commits between tags
  const comparison = await github.rest.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead: `${previousTag}...${currentTag}`,
  });

  const commits = comparison.data.commits;
  console.log(`Found ${commits.length} commits between tags`);

  // Extract PR numbers from commits
  const prNumbers = new Set();
  for (const commit of commits) {
    // Look for "Merge pull request #123" or "(#123)" patterns
    const mergeMatch = commit.commit.message.match(/Merge pull request #(\d+)/);
    const hashMatch = commit.commit.message.match(/\(#(\d+)\)/);

    const prNumber = mergeMatch?.[1] || hashMatch?.[1];
    if (prNumber) {
      prNumbers.add(parseInt(prNumber, 10));
    }
  }

  console.log(`Found ${prNumbers.size} unique PRs`);

  // Fetch PR details and build changelog entries
  const prSummaries = [];

  for (const prNumber of prNumbers) {
    try {
      const { data: pr } = await github.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });

      // Only include merged PRs
      if (!pr.merged_at) {
        console.log(`Skipping PR #${prNumber} - not merged`);
        continue;
      }

      console.log(`Processing PR #${prNumber}: ${pr.title}`);

      // Extract JIRA ticket from branch name
      const branch = pr.head.ref;
      const jiraRegex = new RegExp(`(${JIRA_PROJECTS.join('|')})-[0-9]+`);
      const jiraMatch = branch.match(jiraRegex);
      const jiraTicket = jiraMatch?.[0] || null;

      // Determine category based on PR title
      const titleLower = pr.title.toLowerCase();
      let categoryEmoji, categoryName;

      if (/(bug|fix|fixing|fixed|hotfix|patch|issue|error|broken)/.test(titleLower)) {
        categoryEmoji = '🐞';
        categoryName = 'BugFix';
      } else if (/(new|feature|add|adding|added|implement|implementing|create|creating|ux|ui|design)/.test(titleLower)) {
        categoryEmoji = '✨';
        categoryName = 'New';
      } else {
        categoryEmoji = '🔧';
        categoryName = 'Maintenance/Engineering';
      }

      // Extract description from PR body (content between # Internal Changelog and next section)
      let descriptionContent = '';
      if (pr.body) {
        const internalChangelogMatch = pr.body.match(/# Internal Changelog\s+([\s\S]*?)(?=\n#|\n$|$)/);
        if (internalChangelogMatch) {
          descriptionContent = internalChangelogMatch[1]
            .split('\n')
            .filter(line => line.trim() && !line.match(/^<!--.*-->$/))
            .slice(0, 10)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }

      // Build PR summary
      let summary = `• ${categoryEmoji} **${categoryName}** - ${pr.title}`;

      if (jiraTicket) {
        const jiraUrl = `${JIRA_BASE_URL}/${jiraTicket}`;
        summary += ` - [${jiraTicket}](${jiraUrl})`;
      }

      if (descriptionContent) {
        summary += `\n${descriptionContent}`;
      }

      prSummaries.push(summary);

    } catch (error) {
      console.error(`Error processing PR #${prNumber}:`, error.message);
      // Continue processing other PRs
    }
  }

  // Build final content
  if (prSummaries.length === 0) {
    console.log('No PRs to report');
    return {
      hasUpdates: false,
      content: '',
    };
  }

  const content = [
    `🚀 **Deploying to Production!** - ${PRODUCT_NAME} Updates`,
    '',
    ...prSummaries,
  ].join('\n\n');

  console.log(`Generated changelog with ${prSummaries.length} PRs`);

  return {
    hasUpdates: true,
    content,
  };
};

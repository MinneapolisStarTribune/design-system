import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import the module to test
const generateChangelog = require('./generate-release-changelog.js');

const JIRA_BASE_URL = 'https://minneapolisstartribune.atlassian.net/browse';

describe('generate-release-changelog', () => {
  let mockGithub;
  let mockContext;

  beforeEach(() => {
    // Reset mocks before each test
    mockContext = {
      repo: {
        owner: 'MinneapolisStarTribune',
        repo: 'design-system',
      },
    };

    // Create a fresh mock GitHub API for each test
    mockGithub = {
      rest: {
        repos: {
          listTags: vi.fn(),
          compareCommitsWithBasehead: vi.fn(),
        },
        pulls: {
          get: vi.fn(),
        },
      },
    };

    // Mock console methods to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('General Tests', () => {
    it('should generate changelog with multiple PRs', async () => {
      // Mock tags response
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.8', commit: { sha: 'abc123' } },
          { name: 'v0.0.7', commit: { sha: 'def456' } },
        ],
      });

      // Mock commits comparison
      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            {
              sha: 'commit1',
              commit: { message: 'Merge pull request #42 from feature/add-button' },
            },
            {
              sha: 'commit2',
              commit: { message: 'Merge pull request #43 from bugfix/modal-a11y' },
            },
          ],
        },
      });

      // Mock PR details
      mockGithub.rest.pulls.get
        .mockResolvedValueOnce({
          data: {
            title: 'Add new button component',
            merged_at: '2024-01-01T00:00:00Z',
            head: { ref: 'feature/DS-123-add-button' },
            body: `# Description
This PR adds a button component.

# Internal Changelog
Added a reusable button component with multiple variants.

# Testing
- [x] Unit tests pass`,
          },
        })
        .mockResolvedValueOnce({
          data: {
            title: 'Fix accessibility issue in modal',
            merged_at: '2026-01-02T00:00:00Z',
            head: { ref: 'bugfix/LOON-456-fix-modal-a11y' },
            body: `# Description
Fixed modal keyboard navigation.

# Internal Changelog
Modal now properly traps focus.`,
          },
        });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.8',
      });

      // Validate result structure
      expect(result).toHaveProperty('hasUpdates');
      expect(result).toHaveProperty('content');

      // Validate result values
      expect(result.hasUpdates).toBe(true);
      expect(result.content).toContain('🚀 **Deploying to Production!**');
      expect(result.content).toContain('Shared UI Library Updates');
      expect(result.content).toContain('Add new button component');
      expect(result.content).toContain('Fix accessibility issue in modal');
      expect(result.content).toContain('[DS-123]');
      expect(result.content).toContain('[LOON-456]');
      expect(result.content).toContain(`${JIRA_BASE_URL}/DS-123`);
      expect(result.content).toContain(`${JIRA_BASE_URL}/LOON-456`);
      expect(result.content).toContain('Added a reusable button component with multiple variants.');
    });

    it('should categorize PRs correctly', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            { sha: 'c1', commit: { message: 'Merge pull request #1' } },
            { sha: 'c2', commit: { message: 'Merge pull request #2' } },
            { sha: 'c3', commit: { message: 'Merge pull request #3' } },
          ],
        },
      });

      mockGithub.rest.pulls.get
        .mockResolvedValueOnce({
          data: {
            title: 'Fix critical bug',
            merged_at: '2024-01-01T00:00:00Z',
            head: { ref: 'bugfix/test' },
            body: null,
          },
        })
        .mockResolvedValueOnce({
          data: {
            title: 'Add new analytics feature',
            merged_at: '2024-01-01T00:00:00Z',
            head: { ref: 'feature/analytics' },
            body: null,
          },
        })
        .mockResolvedValueOnce({
          data: {
            title: 'Refactor database layer',
            merged_at: '2024-01-01T00:00:00Z',
            head: { ref: 'chore/refactor' },
            body: null,
          },
        });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      // Check for category emojis
      expect(result.content).toContain('🐞'); // BugFix
      expect(result.content).toContain('✨'); // New Feature
      expect(result.content).toContain('🔧'); // Maintenance
      expect(result.content).toContain('**BugFix**');
      expect(result.content).toContain('**New**');
      expect(result.content).toContain('**Maintenance/Engineering**');
    });
  });

  describe('Edge Cases', () => {
    it('should return no updates when there are no PRs', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            { sha: 'c1', commit: { message: 'Direct commit without PR' } },
          ],
        },
      });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      expect(result.hasUpdates).toBe(false);
      expect(result.content).toBe('');
    });

    it('should skip PRs that are not merged', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            { sha: 'c1', commit: { message: 'Merge pull request #10' } },
          ],
        },
      });

      mockGithub.rest.pulls.get.mockResolvedValue({
        data: {
          title: 'Test PR',
          merged_at: null, // Not merged
          head: { ref: 'feature/test' },
          body: null,
        },
      });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      expect(result.hasUpdates).toBe(false);
      expect(result.content).toBe('');
    });

    it('should handle PRs without JIRA tickets', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            { sha: 'c1', commit: { message: 'Merge pull request #1' } },
          ],
        },
      });

      mockGithub.rest.pulls.get.mockResolvedValue({
        data: {
          title: 'Add new feature',
          merged_at: '2024-01-01T00:00:00Z',
          head: { ref: 'feature/no-jira-ticket' },
          body: null,
        },
      });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      expect(result.hasUpdates).toBe(true);
      expect(result.content).toContain('Add new feature');
      expect(result.content).not.toContain(`${JIRA_BASE_URL}`); // No JIRA ticket link
    });

    it('should continue processing even if one PR fetch fails', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            { sha: 'c1', commit: { message: 'Merge pull request #1' } },
            { sha: 'c2', commit: { message: 'Merge pull request #2' } },
          ],
        },
      });

      mockGithub.rest.pulls.get
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          data: {
            title: 'Fix bug',
            merged_at: '2024-01-01T00:00:00Z',
            head: { ref: 'bugfix/test' },
            body: null,
          },
        });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      // Should still have the second PR
      expect(result.hasUpdates).toBe(true);
      expect(result.content).toContain('Fix bug');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no tags exist in repository', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [],
      });

      await expect(
        generateChangelog({
          github: mockGithub,
          context: mockContext,
          currentTag: 'v0.0.1',
        })
      ).rejects.toThrow('No tags found in repository');
    });

    it('should throw error when only one tag exists (first release)', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [{ name: 'v0.0.1', commit: { sha: 'abc' } }],
      });

      await expect(
        generateChangelog({
          github: mockGithub,
          context: mockContext,
          currentTag: 'v0.0.1',
        })
      ).rejects.toThrow('No previous tag found');
    });

    it('should throw error when current tag is not found', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      await expect(
        generateChangelog({
          github: mockGithub,
          context: mockContext,
          currentTag: 'v0.0.99',
        })
      ).rejects.toThrow('Current tag "v0.0.99" is not the most recent tag. Most recent tag is "v0.0.2". Changelog generation should only run for the latest release.');
    });

    it('should throw error if current tag is the oldest tag', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.3', commit: { sha: 'abc' } },
          { name: 'v0.0.2', commit: { sha: 'def' } },
          { name: 'v0.0.1', commit: { sha: 'ghi' } },
        ],
      });

      await expect(
        generateChangelog({
          github: mockGithub,
          context: mockContext,
          currentTag: 'v0.0.1',
        })
      ).rejects.toThrow('Current tag "v0.0.1" is not the most recent tag. Most recent tag is "v0.0.3". Changelog generation should only run for the latest release.');
    });
  });

  describe('JIRA Ticket Extraction', () => {
    it('should extract all supported JIRA project codes', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [
            { sha: 'c1', commit: { message: 'Merge pull request #1 from feature/one' } },
            { sha: 'c2', commit: { message: 'Merge pull request #2 from feature/two' } },
            { sha: 'c3', commit: { message: 'Merge pull request #3 from feature/three' } },
            { sha: 'c4', commit: { message: 'Merge pull request #4 from feature/four' } },
            { sha: 'c5', commit: { message: 'Merge pull request #5 from feature/five' } },
          ],
        },
      });

      const jiraProjects = ['LOON', 'VARSITY', 'PS', 'NLT', 'DS'];
      jiraProjects.forEach((project, index) => {
        mockGithub.rest.pulls.get.mockResolvedValueOnce({
          data: {
            title: `Test ${project}`,
            merged_at: '2024-01-01T00:00:00Z',
            head: { ref: `feature/${project}-${index + 1}-test` },
            body: null,
          },
        });
      });

      // Debug
      // console.warn(mockContext);

      // Restore console.log for this test so you can see logs from generateChangelog
      // console.log.mockRestore();

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      // Debug
      // console.warn(result);

      // Check that all JIRA projects are linked
      expect(result.content).toContain('[LOON-1]');
      expect(result.content).toContain('[VARSITY-2]');
      expect(result.content).toContain('[PS-3]');
      expect(result.content).toContain('[NLT-4]');
      expect(result.content).toContain('[DS-5]');
    });
  });

  describe('Internal Changelog Extraction', () => {
    it('should extract content from Internal Changelog section', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [{ sha: 'c1', commit: { message: 'Merge pull request #1 from feature/test' } }],
        },
      });

      mockGithub.rest.pulls.get.mockResolvedValue({
        data: {
          title: 'Add feature',
          merged_at: '2024-01-01T00:00:00Z',
          head: { ref: 'feature/test' },
          body: `# Description
Some description

# Internal Changelog
This is the internal changelog content that should be extracted.

# Testing
- [x] Tests pass`,
        },
      });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      expect(result.content).toContain(
        'This is the internal changelog content that should be extracted.'
      );
    });

    it('should handle PRs without Internal Changelog section', async () => {
      mockGithub.rest.repos.listTags.mockResolvedValue({
        data: [
          { name: 'v0.0.2', commit: { sha: 'abc' } },
          { name: 'v0.0.1', commit: { sha: 'def' } },
        ],
      });

      mockGithub.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
        data: {
          commits: [{ sha: 'c1', commit: { message: 'Merge pull request #1 from feature/test' } }],
        },
      });

      mockGithub.rest.pulls.get.mockResolvedValue({
        data: {
          title: 'Add feature',
          merged_at: '2024-01-01T00:00:00Z',
          head: { ref: 'feature/test' },
          body: `# Description
Just a description, no internal changelog`,
        },
      });

      const result = await generateChangelog({
        github: mockGithub,
        context: mockContext,
        currentTag: 'v0.0.2',
      });

      // Should still work, just without the internal changelog content
      expect(result.hasUpdates).toBe(true);
      expect(result.content).toContain('Add feature');
    });
  });
});

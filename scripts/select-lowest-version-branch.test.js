/**
 * Tests for scripts/select-lowest-version-branch.js
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { selectLowestVersionBranch, parseVersion, normalizeBranch } from './select-lowest-version-branch.js';

describe('parseVersion', () => {
  it('parses valid semver string', () => {
    expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
    expect(parseVersion('0.0.4')).toEqual({ major: 0, minor: 0, patch: 4 });
  });

  it('returns null for invalid version', () => {
    expect(parseVersion('1.2')).toBeNull();
    expect(parseVersion('v1.2.3')).toBeNull();
    expect(parseVersion('release/0.1.0')).toBeNull();
    expect(parseVersion('')).toBeNull();
  });
});

describe('normalizeBranch', () => {
  it('accepts release/x.y.z and returns as-is when valid', () => {
    expect(normalizeBranch('release/0.1.0')).toBe('release/0.1.0');
  });

  it('strips origin/ prefix', () => {
    expect(normalizeBranch('origin/release/0.1.0')).toBe('release/0.1.0');
  });

  it('returns null for non-release branch', () => {
    expect(normalizeBranch('main')).toBeNull();
    expect(normalizeBranch('feature/foo')).toBeNull();
  });

  it('returns null for release branch with invalid version', () => {
    expect(normalizeBranch('release/0.1')).toBeNull();
    expect(normalizeBranch('release/foo')).toBeNull();
  });
});

describe('selectLowestVersionBranch', () => {
  it('selects lowest version among multiple release branches', () => {
    const result = selectLowestVersionBranch([
      'release/0.2.0',
      'release/0.1.1',
      'release/0.0.4',
    ]);
    expect(result.branch).toBe('release/0.0.4');
    expect(result.skipped).toEqual([]);
  });

  it('selects lowest when versions are in different order', () => {
    const result = selectLowestVersionBranch([
      'release/1.0.0',
      'release/0.2.0',
      'release/0.10.0',
    ]);
    expect(result.branch).toBe('release/0.2.0');
  });

  it('handles single valid branch', () => {
    const result = selectLowestVersionBranch(['release/0.5.0']);
    expect(result.branch).toBe('release/0.5.0');
  });

  it('handles origin/ prefix in branch names', () => {
    const result = selectLowestVersionBranch([
      'origin/release/0.2.0',
      'origin/release/0.0.4',
    ]);
    expect(result.branch).toBe('release/0.0.4');
  });

  it('returns error and null branch when no valid release branches', () => {
    const result = selectLowestVersionBranch([]);
    expect(result.branch).toBeNull();
    expect(result.error).toContain('No valid release branches');
  });

  it('returns error when only invalid branch names given', () => {
    const result = selectLowestVersionBranch(['main', 'feature/foo', 'release/not-a-version']);
    expect(result.branch).toBeNull();
    expect(result.skipped).toContain('main');
    expect(result.skipped).toContain('feature/foo');
  });

  it('skips invalid names but still returns lowest of valid', () => {
    const result = selectLowestVersionBranch([
      'release/0.2.0',
      'main',
      'release/0.0.4',
    ]);
    expect(result.branch).toBe('release/0.0.4');
    expect(result.skipped).toContain('main');
  });

  it('compares major.minor.patch correctly', () => {
    expect(selectLowestVersionBranch(['release/2.0.0', 'release/10.0.0']).branch).toBe('release/2.0.0');
    expect(selectLowestVersionBranch(['release/0.10.0', 'release/0.2.0']).branch).toBe('release/0.2.0');
  });
});

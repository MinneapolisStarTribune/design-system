/**
 * @vitest-environment node
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { RELEASE_VERIFY_GATES, runReleaseVerify } = require('./release-verify.js');

describe('release-verify', () => {
  let logs;
  let errors;

  beforeEach(() => {
    logs = [];
    errors = [];
  });

  const logger = {
    log: (message) => logs.push(message),
    error: (message) => errors.push(message),
  };

  it('runs every release gate in order when all gates pass', () => {
    const runCommand = vi.fn(() => ({ status: 0 }));

    const passed = runReleaseVerify({
      runCommand,
      log: logger.log,
      error: logger.error,
    });

    expect(passed).toBe(true);
    expect(runCommand).toHaveBeenCalledTimes(RELEASE_VERIFY_GATES.length);
    expect(runCommand.mock.calls.map(([command, args]) => [command, ...args].join(' '))).toEqual(
      RELEASE_VERIFY_GATES.map((gate) => gate.command.join(' '))
    );
    expect(logs.join('\n')).toContain('[release:verify] All release verification gates passed.');
  });

  it('stops at the first failing gate and prints an actionable failure', () => {
    const runCommand = vi
      .fn()
      .mockReturnValueOnce({ status: 0 })
      .mockReturnValueOnce({ status: 1 });

    const passed = runReleaseVerify({
      gates: RELEASE_VERIFY_GATES.slice(0, 3),
      runCommand,
      log: logger.log,
      error: logger.error,
    });

    const output = errors.join('\n');

    expect(passed).toBe(false);
    expect(runCommand).toHaveBeenCalledTimes(2);
    expect(output).toContain('[release:verify] Gate failed: format:check');
    expect(output).toContain('[release:verify] Command: yarn format:check');
    expect(output).toContain('::error title=release:verify failed::format:check failed.');
  });
});

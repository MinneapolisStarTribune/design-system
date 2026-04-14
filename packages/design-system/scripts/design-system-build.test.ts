/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import { execSync } from 'child_process';

const PROJECT_ROOT = process.cwd();
const BUILD_TIMEOUT_MS = 180_000;

function runCommand(command: string, cwd = PROJECT_ROOT): string {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: 'pipe' });
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string };
    const stdout = err.stdout ? `stdout:\n${err.stdout}` : 'stdout: <empty>';
    const stderr = err.stderr ? `stderr:\n${err.stderr}` : 'stderr: <empty>';
    throw new Error(`Command failed: ${command}\n\ncwd: ${cwd}\n\n${stdout}\n\n${stderr}`);
  }
}

describe.sequential('Design System Build Tests', () => {
  describe('Build', () => {
    const builds = [
      { platform: 'web', command: 'yarn build:web' },
      { platform: 'native', command: 'yarn build:native' },
    ];

    it.each(builds)(
      '$platform build succeeds',
      ({ command }) => {
        expect(() => runCommand(command)).not.toThrow();
      },
      BUILD_TIMEOUT_MS
    );
  });
});

#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const RELEASE_VERIFY_GATES = [
  {
    name: 'lint',
    command: ['yarn', 'lint'],
  },
  {
    name: 'format:check',
    command: ['yarn', 'format:check'],
  },
  {
    name: 'typecheck',
    command: ['yarn', 'typecheck'],
  },
  {
    name: 'test:web',
    command: ['yarn', 'test:web'],
  },
  {
    name: 'test:a11y',
    command: ['yarn', 'test:a11y'],
  },
  {
    name: 'test:native',
    command: ['yarn', 'test:native'],
  },
  {
    name: 'build',
    command: ['yarn', 'build'],
  },
];

function formatCommand(command) {
  return command.join(' ');
}

function runReleaseVerify({
  gates = RELEASE_VERIFY_GATES,
  runCommand = spawnSync,
  cwd = process.cwd(),
  env = process.env,
  log = console.log,
  error = console.error,
} = {}) {
  log('[release:verify] Starting enforced release verification.');

  for (const [index, gate] of gates.entries()) {
    const commandText = formatCommand(gate.command);

    log('');
    log(`[release:verify] Gate ${index + 1}/${gates.length}: ${gate.name}`);
    log(`[release:verify] Command: ${commandText}`);

    const result = runCommand(gate.command[0], gate.command.slice(1), {
      cwd,
      env,
      stdio: 'inherit',
    });

    if (result.error) {
      error('');
      error(`[release:verify] Gate failed: ${gate.name}`);
      error(`[release:verify] Command: ${commandText}`);
      error(`[release:verify] Error: ${result.error.message}`);
      error(
        `::error title=release:verify failed::${gate.name} failed to start. Run \`${commandText}\` locally and fix the error above.`
      );
      return false;
    }

    if (result.status !== 0) {
      const exitCode = result.status ?? 'unknown';

      error('');
      error(`[release:verify] Gate failed: ${gate.name}`);
      error(`[release:verify] Command: ${commandText}`);
      error(`[release:verify] Exit code: ${exitCode}`);
      error(
        `::error title=release:verify failed::${gate.name} failed. Run \`${commandText}\` locally and fix the error above.`
      );
      return false;
    }

    log(`[release:verify] Gate passed: ${gate.name}`);
  }

  log('');
  log('[release:verify] All release verification gates passed.');
  return true;
}

if (require.main === module) {
  const passed = runReleaseVerify();
  process.exit(passed ? 0 : 1);
}

module.exports = {
  RELEASE_VERIFY_GATES,
  runReleaseVerify,
};

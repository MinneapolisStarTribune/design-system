/**
 * Conditionally run build scripts only if source files have changed
 * 
 * This script checks if source files are newer than output files,
 * and only runs the build if needed. This prevents unnecessary rebuilds
 * that cause timestamp changes and git conflicts.
 */

const { execSync } = require('child_process');

/**
 * Check if a build command should run by calling should-rebuild.js
 * @param {string} command - The command to check ('tokens', 'tokens:mantine', or 'icons')
 * @returns {boolean} True if rebuild is needed, false otherwise
 */
function shouldRebuild(command) {
  try {
    execSync(`node scripts/should-rebuild.js ${command}`, { stdio: 'pipe' });
    return true; // Exit code 0 = should rebuild
  } catch (error) {
    if (error.status === 1) {
      return false; // Exit code 1 = shouldn't rebuild (this is expected)
    }
    // Other errors should be thrown
    throw error;
  }
}

// Main execution
const commands = [
  { check: 'tokens', build: 'tokens' },
  { check: 'tokens:mantine', build: 'tokens:mantine' },
  { check: 'icons', build: 'icons' },
];

console.log('Checking if rebuilds are needed...\n');

for (const { check, build } of commands) {
  if (shouldRebuild(check)) {
    console.log(`🔄 Rebuilding ${build} (source files changed)...\n`);
    try {
      execSync(`npm run ${build}`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`\n❌ Error building ${build}`);
      process.exit(1);
    }
  } else {
    console.log(`✓ ${build} up to date (skipping rebuild)`);
  }
}

console.log(''); // Empty line for spacing


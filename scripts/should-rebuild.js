/**
 * Check if build scripts should run based on file modification times
 * 
 * This script compares the modification times of source files (tokens, icons)
 * against the output files. If any source file is newer than its corresponding
 * output file, or if output files don't exist, it returns true (should rebuild).
 * 
 * This prevents unnecessary rebuilds that cause timestamp changes and git conflicts
 * when multiple developers work on the codebase.
 */

const fs = require('fs');
const path = require('path');

/**
 * Get the most recent modification time from a list of files
 * @param {string[]} filePaths - Array of file paths to check
 * @returns {number} Most recent modification time in milliseconds, or 0 if no files exist
 */
function getLatestMtime(filePaths) {
  let latestMtime = 0;
  
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.mtimeMs > latestMtime) {
        latestMtime = stats.mtimeMs;
      }
    }
  }
  
  return latestMtime;
}

/**
 * Check if tokens need to be rebuilt
 * @returns {boolean} True if tokens should be rebuilt
 */
function shouldRebuildTokens() {
  const projectRoot = path.join(__dirname, '..');
  
  // Source files: all token JSON files
  const tokenSourceFiles = [
    'tokens/color/base.json',
    'tokens/color/global.json',
    'tokens/color/button-light.json',
    'tokens/color/button-dark.json',
    'tokens/color/brand-startribune-light.json',
    'tokens/color/brand-startribune-dark.json',
    'tokens/color/brand-varsity-light.json',
    'tokens/color/brand-varsity-dark.json',
    'tokens/color/semantic.json',
    'tokens/text.json',
    'tokens/border-radius.json',
    'tokens/spacing.json',
    'tokens/breakpoint.json',
  ].map(file => path.join(projectRoot, file));
  
  // Output files: generated CSS files
  const tokenOutputFiles = [
    'dist/web/themes/startribune-light.css',
    'dist/web/themes/startribune-dark.css',
    'dist/web/themes/varsity-light.css',
    'dist/web/themes/varsity-dark.css',
  ].map(file => path.join(projectRoot, file));
  
  // Check if any output file is missing
  const allOutputsExist = tokenOutputFiles.every(file => fs.existsSync(file));
  if (!allOutputsExist) {
    return true;
  }
  
  // Get latest modification time from source files
  const latestSourceMtime = getLatestMtime(tokenSourceFiles);
  
  // Get latest modification time from output files
  const latestOutputMtime = getLatestMtime(tokenOutputFiles);
  
  // Rebuild if source files are newer than output files
  return latestSourceMtime > latestOutputMtime;
}

/**
 * Check if Mantine tokens need to be rebuilt
 * @returns {boolean} True if Mantine tokens should be rebuilt
 */
function shouldRebuildMantineTokens() {
  const projectRoot = path.join(__dirname, '..');
  
  // Source files: Mantine tokens use fewer files (no base.json, semantic.json, etc.)
  const tokenSourceFiles = [
    'tokens/color/global.json',
    'tokens/color/button-light.json',
    'tokens/color/button-dark.json',
    'tokens/color/brand-startribune-light.json',
    'tokens/color/brand-startribune-dark.json',
    'tokens/color/brand-varsity-light.json',
    'tokens/color/brand-varsity-dark.json',
  ].map(file => path.join(projectRoot, file));
  
  // Output files: generated TypeScript files (note: format is brand.mode.ts, not brand-mode.ts)
  const mantineOutputFiles = [
    'src/generated/themes/startribune.light.ts',
    'src/generated/themes/startribune.dark.ts',
    'src/generated/themes/varsity.light.ts',
    'src/generated/themes/varsity.dark.ts',
  ].map(file => path.join(projectRoot, file));
  
  // Check if any output file is missing
  const allOutputsExist = mantineOutputFiles.every(file => fs.existsSync(file));
  if (!allOutputsExist) {
    return true;
  }
  
  // Get latest modification time from source files
  const latestSourceMtime = getLatestMtime(tokenSourceFiles);
  
  // Get latest modification time from output files
  const latestOutputMtime = getLatestMtime(mantineOutputFiles);
  
  // Rebuild if source files are newer than output files
  return latestSourceMtime > latestOutputMtime;
}

/**
 * Check if icons need to be rebuilt
 * @returns {boolean} True if icons should be rebuilt
 */
function shouldRebuildIcons() {
  const projectRoot = path.join(__dirname, '..');
  const iconsDir = path.join(projectRoot, 'src/icons');
  
  // Check if icons directory exists
  if (!fs.existsSync(iconsDir)) {
    return false;
  }
  
  // Get all SVG files in icons directory
  const svgFiles = fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith('.svg'))
    .map((file) => path.join(iconsDir, file));
  
  if (svgFiles.length === 0) {
    return false;
  }
  
  // Output files: generated TypeScript files
  const iconOutputFiles = [
    'src/components/Icon/iconOptions.ts',
    'src/components/Icon/iconNames.ts',
  ].map(file => path.join(projectRoot, file));
  
  // Check if any output file is missing
  const allOutputsExist = iconOutputFiles.every(file => fs.existsSync(file));
  if (!allOutputsExist) {
    return true;
  }
  
  // Get latest modification time from source files
  const latestSourceMtime = getLatestMtime(svgFiles);
  
  // Get latest modification time from output files
  const latestOutputMtime = getLatestMtime(iconOutputFiles);
  
  // Rebuild if source files are newer than output files
  return latestSourceMtime > latestOutputMtime;
}

// Main execution
// This script is called with a command argument: 'tokens', 'tokens:mantine', or 'icons'
const command = process.argv[2];

if (!command) {
  console.error('Usage: node scripts/should-rebuild.js <command>');
  console.error('Commands: tokens, tokens:mantine, icons');
  process.exit(1);
}

let shouldRebuild = false;

switch (command) {
  case 'tokens':
    shouldRebuild = shouldRebuildTokens();
    break;
  case 'tokens:mantine':
    shouldRebuild = shouldRebuildMantineTokens();
    break;
  case 'icons':
    shouldRebuild = shouldRebuildIcons();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Commands: tokens, tokens:mantine, icons');
    process.exit(1);
}

// Exit with code 0 (should rebuild) or 1 (should not rebuild)
// This allows it to be used in shell conditionals: `node scripts/should-rebuild.js tokens && npm run tokens`
process.exit(shouldRebuild ? 0 : 1);


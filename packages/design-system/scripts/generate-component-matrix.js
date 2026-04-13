/**
 * Generate Component Matrix
 *
 * Reads the web and native barrel files to determine which components are
 * shipped, then merges with manual overrides for subcomponents or
 * components with different export names. Outputs a JSON manifest consumed
 * by the Storybook ComponentRoadmap MDX page.
 *
 * Usage:
 *   node scripts/generate-component-matrix.js
 *
 * Output:
 *   src/stories/GettingStarted/component-matrix.json
 *
 * Sources of truth (in priority order):
 *   1. component-roadmap-planned.json   — master list of components (order + platform scope)
 *   2. component-roadmap-overrides.json — manual per-platform overrides
 *   3. components/index.*.ts + src/index.*.ts — merged barrel + package entry exports
 *      (including `export * from` chains, e.g. Article Toolkit)
 */

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const {
  NATIVE_ENTRY,
  OUTPUT_DIR,
  OUTPUT_FILE,
  OVERRIDES_FILE,
  PACKAGE_ROOT,
  WEB_ENTRY,
  loadOverrides,
  overrideKeys,
  resolveComponentMatrixRows,
  unionBarrelExports,
} = require('./component-matrix-utils');

function generateMatrix() {
  console.log('Reading barrel files and package entrypoints...');
  const webExports = unionBarrelExports(WEB_ENTRY);
  const nativeExports = unionBarrelExports(NATIVE_ENTRY);
  const rows = resolveComponentMatrixRows();
  const overrides = loadOverrides();
  const plannedSet = new Set(rows.map((row) => row.component));

  console.log(`  Web exports found:    ${webExports.size}`);
  console.log(`  Native exports found: ${nativeExports.size}`);
  console.log(`  Manual overrides:     ${overrideKeys(overrides).length}`);

  for (const key of overrideKeys(overrides)) {
    if (!plannedSet.has(key)) {
      console.warn(`⚠ Override key "${key}" not found in component-roadmap-planned.json — is it stale?`);
    }
  }

  const webDone = rows.filter((r) => r.web).length;
  const nativeDone = rows.filter((r) => r.native).length;
  console.log(`\n  Resolved as done → web: ${webDone}, native: ${nativeDone} (of ${rows.length} planned)`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(rows, null, 2) + '\n', 'utf8');
  console.log(`\n✓ Component matrix written to ${path.relative(PACKAGE_ROOT, OUTPUT_FILE)}`);

  if (!fs.existsSync(OVERRIDES_FILE)) {
    const template = {
      _comment:
        'Manual platform overrides. Keys must match "name" in component-roadmap-planned.json. Override wins over barrel auto-detection.',
    };
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(template, null, 2) + '\n', 'utf8');
    console.log(`✓ Created starter overrides file at ${path.relative(PACKAGE_ROOT, OVERRIDES_FILE)}`);
    console.log('  Edit it to mark subcomponents and name-mismatched components as done.');
  }
}

generateMatrix();

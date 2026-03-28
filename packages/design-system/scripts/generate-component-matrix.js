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
 */

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

// Resolve paths from this package root (scripts/ is one level below packages/design-system).
// `yarn generate:component-matrix` runs with cwd = packages/design-system, not the monorepo root.
const PACKAGE_ROOT = path.join(__dirname, '..');

const WEB_BARREL = path.join(PACKAGE_ROOT, 'src', 'components', 'index.web.ts');
const NATIVE_BARREL = path.join(PACKAGE_ROOT, 'src', 'components', 'index.native.ts');
const WEB_ENTRY = path.join(PACKAGE_ROOT, 'src', 'index.web.ts');
const NATIVE_ENTRY = path.join(PACKAGE_ROOT, 'src', 'index.native.ts');

const OUTPUT_DIR = path.join(PACKAGE_ROOT, 'src', 'stories', 'GettingStarted');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'component-matrix.json');
const OVERRIDES_FILE = path.join(OUTPUT_DIR, 'component-roadmap-overrides.json');
const PLANNED_FILE = path.join(OUTPUT_DIR, 'component-roadmap-planned.json');

/**
 * Parse all exported non-type identifiers from a barrel file.
 * Handles both named exports and re-exports:
 *   export { Foo, type FooProps } from './Foo'
 *   export { Bar } from './Bar'
 * Returns a Set of PascalCase component names (types are excluded).
 * @param {string} filePath
 * @returns {Set<string>}
 */
function parseBarrelExports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ Barrel file not found: ${filePath}`);
    return new Set();
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const exports = new Set();

  // Match each export { ... } block
  const blockRegex = /export\s*\{([^}]+)\}/g;
  let block;
  while ((block = blockRegex.exec(source)) !== null) {
    const entries = block[1].split(',');
    for (const entry of entries) {
      const trimmed = entry.trim();
      // Skip `type Foo` and `type FooProps` — we only want runtime exports
      if (trimmed.startsWith('type ')) continue;
      // Strip any alias: `Foo as Bar` → take `Bar` (the public name)
      const name = trimmed.includes(' as ')
        ? trimmed.split(' as ').pop().trim()
        : trimmed.trim();
      // Only include PascalCase identifiers (component names, not hooks/consts)
      if (/^[A-Z][A-Za-z0-9]*$/.test(name)) {
        exports.add(name);
      }
    }
  }

  return exports;
}

/**
 * Union of PascalCase exports from the components barrel and the package entry
 * (providers, icons re-exports, etc. live on the entry, not always on components/index).
 * @param {string} barrelPath
 * @param {string} entryPath
 * @returns {Set<string>}
 */
function mergeBarrelAndEntryExports(barrelPath, entryPath) {
  const merged = new Set(parseBarrelExports(barrelPath));
  for (const name of parseBarrelExports(entryPath)) {
    merged.add(name);
  }
  return merged;
}

/**
 * Load manual overrides from component-roadmap-overrides.json.
 * Schema: { "ComponentName": { "web": true, "native": false }, ... }
 * Missing keys default to undefined (= auto-detect from barrel).
 * @returns {Record<string, { web?: boolean; native?: boolean }>}
 */
function loadOverrides() {
  if (!fs.existsSync(OVERRIDES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  } catch (e) {
    console.error(`✗ Failed to parse overrides file: ${e.message}`);
    return {};
  }
}

/**
 * Load planned component names from component-roadmap-planned.json (same file the
 * TS config imports). Fails the script on missing file, invalid JSON, or duplicate `name`.
 * @returns {string[]}
 */
function loadPlannedNames() {
  if (!fs.existsSync(PLANNED_FILE)) {
    console.error(`✗ Planned list not found: ${PLANNED_FILE}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(PLANNED_FILE, 'utf8'));
  } catch (e) {
    console.error(`✗ Failed to parse planned list: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    console.error('✗ component-roadmap-planned.json must be a JSON array.');
    process.exit(1);
  }

  const names = [];
  const seen = new Set();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || typeof row.name !== 'string' || row.name.length === 0) {
      console.error(`✗ Invalid entry at index ${i}: expected a non-empty "name" string.`);
      process.exit(1);
    }
    if (seen.has(row.name)) {
      console.error(`✗ Duplicate planned component name: "${row.name}"`);
      process.exit(1);
    }
    seen.add(row.name);
    names.push(row.name);
  }

  return names;
}

function generateMatrix() {
  console.log('Reading barrel files and package entrypoints...');
  const webExports    = mergeBarrelAndEntryExports(WEB_BARREL, WEB_ENTRY);
  const nativeExports = mergeBarrelAndEntryExports(NATIVE_BARREL, NATIVE_ENTRY);
  const overrides     = loadOverrides();
  const plannedNames  = loadPlannedNames();

  console.log(`  Web exports found:    ${webExports.size}`);
  console.log(`  Native exports found: ${nativeExports.size}`);
  console.log(`  Manual overrides:     ${Object.keys(overrides).length}`);

  const rows = plannedNames.map((name) => {
    const override = overrides[name] ?? {};

    // For dot-notation names like FormGroup.Label, try the last segment
    // as a fallback lookup (e.g. "Label") — useful if it happens to be
    // individually exported. Usually these will be handled via overrides.
    const lookupName = name.includes('.') ? name.split('.').pop() : name;

    const web    = override.web    ?? webExports.has(lookupName)    ?? false;
    const native = override.native ?? nativeExports.has(lookupName) ?? false;

    return { component: name, web, native };
  });

  // Warn about anything in overrides that isn't in the planned list
  const plannedSet = new Set(plannedNames);
  for (const key of Object.keys(overrides)) {
    if (key.startsWith('_')) continue;
    if (!plannedSet.has(key)) {
      console.warn(`⚠ Override key "${key}" not found in component-roadmap-planned.json — is it stale?`);
    }
  }

  // Report what's detected as done
  const webDone    = rows.filter((r) => r.web).length;
  const nativeDone = rows.filter((r) => r.native).length;
  console.log(`\n  Resolved as done → web: ${webDone}, native: ${nativeDone} (of ${rows.length} planned)`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write flat rows — the MDX page handles grouping via the config
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(rows, null, 2) + '\n', 'utf8');
  console.log(`\n✓ Component matrix written to ${path.relative(PACKAGE_ROOT, OUTPUT_FILE)}`);

  // Create an empty overrides file if one doesn't exist yet
  if (!fs.existsSync(OVERRIDES_FILE)) {
    const template = {
      _comment: "Manual platform overrides. Keys must match \"name\" in component-roadmap-planned.json. Override wins over barrel auto-detection.",
      "FormGroup.Label":       { web: true,  native: false  },
      "FormGroup.Caption":     { web: true,  native: false  },
      "FormGroup.Description": { web: true,  native: false },
    };
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(template, null, 2) + '\n', 'utf8');
    console.log(`✓ Created starter overrides file at ${path.relative(PACKAGE_ROOT, OVERRIDES_FILE)}`);
    console.log('  Edit it to mark subcomponents and name-mismatched components as done.');
  }
}

generateMatrix();
const fs = require('fs');
const path = require('path');

// Resolve paths from this package root (scripts/ is one level below packages/design-system).
// `yarn generate:component-matrix` runs with cwd = packages/design-system, not the monorepo root.
const PACKAGE_ROOT = path.join(__dirname, '..');
const SRC_ROOT = path.join(PACKAGE_ROOT, 'src');

const WEB_BARREL = path.join(PACKAGE_ROOT, 'src', 'components', 'index.web.ts');
const NATIVE_BARREL = path.join(PACKAGE_ROOT, 'src', 'components', 'index.native.ts');
const WEB_ENTRY = path.join(PACKAGE_ROOT, 'src', 'index.web.ts');
const NATIVE_ENTRY = path.join(PACKAGE_ROOT, 'src', 'index.native.ts');

const OUTPUT_DIR = path.join(PACKAGE_ROOT, 'src', 'stories', 'GettingStarted');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'component-matrix.json');
const OVERRIDES_FILE = path.join(OUTPUT_DIR, 'component-roadmap-overrides.json');
const PLANNED_FILE = path.join(OUTPUT_DIR, 'component-roadmap-planned.json');

/**
 * @param {string} filePath
 * @param {string} label for error messages
 * @returns {unknown}
 */
function readJsonRequired(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse ${label}: ${error.message}`);
  }
}

/**
 * @param {string} filePath
 * @returns {Record<string, unknown> | null} null if missing or invalid JSON
 */
function readJsonOptionalObject(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch (error) {
    console.error(`✗ Failed to parse overrides file: ${error.message}`);
    return null;
  }
}

/**
 * Resolve a TS import specifier to an absolute file path (for barrel walking).
 * @param {string} specifier
 * @param {string} fromDir directory of the file containing the export
 * @returns {string | null}
 */
function resolveBarrelModule(specifier, fromDir) {
  let base;
  if (specifier.startsWith('@/')) {
    base = path.join(SRC_ROOT, specifier.slice(2));
  } else {
    base = path.resolve(fromDir, specifier);
  }

  const isFile = (candidatePath) => fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile();

  if (isFile(base)) return base;
  for (const ext of ['.ts', '.tsx']) {
    const candidatePath = base + ext;
    if (isFile(candidatePath)) return candidatePath;
  }
  if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
    for (const indexName of ['index.ts', 'index.tsx']) {
      const candidatePath = path.join(base, indexName);
      if (isFile(candidatePath)) return candidatePath;
    }
  }
  return null;
}

/**
 * PascalCase runtime names from `export { ... }` / `export { ... } from '...'` blocks.
 * Skips `type` exports; supports `Foo as Bar`.
 * @param {string} source
 * @returns {Set<string>}
 */
function parseExportBracesFromSource(source) {
  const names = new Set();
  const blockRegex = /export\s*\{([^}]+)\}/g;
  let block;
  while ((block = blockRegex.exec(source)) !== null) {
    const entries = block[1].split(',');
    for (const entry of entries) {
      const trimmed = entry.trim();
      if (trimmed.startsWith('type ')) continue;
      const exportName = trimmed.includes(' as ')
        ? trimmed.split(' as ').pop().trim()
        : trimmed.trim();
      if (/^[A-Z][A-Za-z0-9]*$/.test(exportName)) {
        names.add(exportName);
      }
    }
  }
  return names;
}

/**
 * Brace exports plus `export * from '...'` (recursively). One read per file.
 * @param {string} filePath
 * @param {Map<string, Set<string>>} memo
 * @param {Set<string>} stack cycle guard
 * @returns {Set<string>}
 */
function parseBarrelExportsWithStars(filePath, memo, stack) {
  const normalizedPath = path.normalize(filePath);
  if (memo.has(normalizedPath)) return memo.get(normalizedPath);
  if (stack.has(normalizedPath)) return new Set();

  stack.add(normalizedPath);

  if (!fs.existsSync(normalizedPath)) {
    console.warn(`⚠ Barrel file not found: ${path.relative(PACKAGE_ROOT, normalizedPath)}`);
    const empty = new Set();
    memo.set(normalizedPath, empty);
    stack.delete(normalizedPath);
    return empty;
  }

  const source = fs.readFileSync(normalizedPath, 'utf8');
  const names = parseExportBracesFromSource(source);
  const directory = path.dirname(normalizedPath);
  const starRegex = /export\s*\*\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  let starMatch;
  while ((starMatch = starRegex.exec(source)) !== null) {
    const resolved = resolveBarrelModule(starMatch[1], directory);
    if (!resolved) {
      console.warn(
        `⚠ Could not resolve export * from "${starMatch[1]}" in ${path.relative(PACKAGE_ROOT, normalizedPath)}`
      );
      continue;
    }
    for (const name of parseBarrelExportsWithStars(resolved, memo, stack)) {
      names.add(name);
    }
  }

  stack.delete(normalizedPath);
  memo.set(normalizedPath, names);
  return names;
}

/**
 * Union of resolved exports from one or more barrel/entry files (shared memo across calls).
 * @param {...string} paths
 * @returns {Set<string>}
 */
function unionBarrelExports(...paths) {
  const memo = new Map();
  const stack = new Set();
  const merged = new Set();
  for (const currentPath of paths) {
    for (const name of parseBarrelExportsWithStars(currentPath, memo, stack)) {
      merged.add(name);
    }
  }
  return merged;
}

/**
 * Load manual overrides from component-roadmap-overrides.json.
 * Schema: { "ComponentName": { "web": true, "native": false }, ... }
 * Missing file or invalid JSON yields {}.
 * @returns {Record<string, { web?: boolean; native?: boolean }>}
 */
function loadOverrides() {
  const data = readJsonOptionalObject(OVERRIDES_FILE);
  return /** @type {Record<string, { web?: boolean; native?: boolean }>} */ (data ?? {});
}

/**
 * Load planned component names from component-roadmap-planned.json (same file the
 * TS config imports). Throws on missing file, invalid JSON, or duplicate `name`.
 * @returns {string[]}
 */
function loadPlannedNames() {
  const data = readJsonRequired(PLANNED_FILE, 'Planned list');

  if (!Array.isArray(data)) {
    throw new Error('component-roadmap-planned.json must be a JSON array.');
  }

  const names = [];
  const seen = new Set();
  for (let index = 0; index < data.length; index++) {
    const row = data[index];
    if (!row || typeof row.name !== 'string' || row.name.length === 0) {
      throw new Error(`Invalid entry at index ${index}: expected a non-empty "name" string.`);
    }
    if (seen.has(row.name)) {
      throw new Error(`Duplicate planned component name: "${row.name}"`);
    }
    seen.add(row.name);
    names.push(row.name);
  }

  return names;
}

/**
 * For dot-notation names like FormGroup.Label, use "Label".
 * @param {string} componentName
 * @returns {string}
 */
function getLookupName(componentName) {
  return componentName.includes('.') ? componentName.split('.').pop() : componentName;
}

/**
 * @returns {Array<{ component: string; native: boolean; web: boolean }>}
 */
function resolveComponentMatrixRows() {
  const webExports = unionBarrelExports(WEB_BARREL, WEB_ENTRY);
  const nativeExports = unionBarrelExports(NATIVE_BARREL, NATIVE_ENTRY);
  const overrides = loadOverrides();
  const plannedNames = loadPlannedNames();

  return plannedNames.map((name) => {
    const override = overrides[name] ?? {};
    const lookupName = getLookupName(name);

    const web = override.web ?? webExports.has(lookupName);
    const native = override.native ?? nativeExports.has(lookupName);

    return { component: name, native, web };
  });
}

function overrideKeys(overrides) {
  return Object.keys(overrides).filter((key) => !key.startsWith('_'));
}

module.exports = {
  NATIVE_BARREL,
  NATIVE_ENTRY,
  OUTPUT_DIR,
  OUTPUT_FILE,
  OVERRIDES_FILE,
  PACKAGE_ROOT,
  PLANNED_FILE,
  WEB_BARREL,
  WEB_ENTRY,
  getLookupName,
  loadOverrides,
  loadPlannedNames,
  overrideKeys,
  resolveComponentMatrixRows,
  unionBarrelExports,
};

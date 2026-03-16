/**
 * Generate Component Matrix
 *
 * Scans component story files (*.stories.tsx and *.native.stories.tsx)
 * to build a manifest of components and their platform availability
 * (Web, Native, or both). The output JSON is consumed by Storybook
 * MDX docs to render a Component Matrix table.
 *
 * Usage:
 *   node scripts/generate-component-matrix.js
 *
 * Output:
 *   src/stories/GettingStarted/component-matrix.json
 */

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(process.cwd());
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src', 'components');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'stories', 'GettingStarted');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'component-matrix.json');

/**
 * Recursively walk a directory and collect file paths that match a predicate.
 * @param {string} dir
 * @param {(filePath: string) => boolean} predicate
 * @returns {string[]}
 */
function collectFiles(dir, predicate) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, predicate));
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract the Storybook title from a CSF story file.
 * Looks for a `title: '...'` or `title: "..."` property in the meta object.
 * @param {string} filePath
 * @returns {string | null}
 */
function extractTitle(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(/title:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

/**
 * Derive hierarchy and component name from a Storybook title.
 * Example: "Components/Actions & Inputs/FormGroup" =>
 *   topLevel: "Components"
 *   subCategory: "Actions & Inputs"
 *   group: ""
 *   categoryFull: "Components/Actions & Inputs"
 *   component: "FormGroup"
 *
 * Example: "Foundations/Typography/Editorial/NewsHeading" =>
 *   topLevel: "Foundations"
 *   subCategory: "Typography"
 *   group: "Editorial"
 *   categoryFull: "Foundations/Typography/Editorial"
 *   component: "NewsHeading"
 *
 * @param {string} title
 */
function splitTitle(title) {
  const parts = title.split('/');

  if (parts.length === 1) {
    return {
      topLevel: '',
      subCategory: '',
      group: '',
      categoryFull: '',
      component: parts[0],
    };
  }

  const component = parts[parts.length - 1];
  const categoryParts = parts.slice(0, -1);

  const topLevel = categoryParts[0] || '';
  const subCategory = categoryParts[1] || '';
  const group = categoryParts.length > 2 ? categoryParts.slice(2).join(' / ') : '';
  const categoryFull = categoryParts.join('/');

  return {
    topLevel,
    subCategory,
    group,
    categoryFull,
    component,
  };
}

/**
 * Infer platform from file path.
 * - Native: paths that include "/native/" or filenames ending with ".native.stories.tsx"
 * - Web: everything else under src/components
 * @param {string} filePath
 */
function inferPlatform(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/native/') || normalized.endsWith('.native.stories.tsx')) {
    return 'native';
  }
  return 'web';
}

function generateMatrix() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Components directory not found: ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const storyFiles = collectFiles(COMPONENTS_DIR, (filePath) =>
    filePath.endsWith('.stories.tsx')
  );

  /** @type {Record<string, { title: string; categoryFull: string; topLevel: string; subCategory: string; group: string; component: string; web: boolean; native: boolean }>} */
  const matrixByTitle = {};

  for (const filePath of storyFiles) {
    const title = extractTitle(filePath);
    if (!title) {
      // Skip files without a title; they won't appear in the sidebar anyway.
      continue;
    }

    const { topLevel, subCategory, group, categoryFull, component } = splitTitle(title);
    const platform = inferPlatform(filePath);

    if (!matrixByTitle[title]) {
      matrixByTitle[title] = {
        title,
        categoryFull,
        topLevel,
        subCategory,
        group,
        component,
        web: false,
        native: false,
      };
    }

    if (platform === 'web') {
      matrixByTitle[title].web = true;
    } else if (platform === 'native') {
      matrixByTitle[title].native = true;
    }
  }

  // Flat, sorted list of unique component entries
  const rows = Object.values(matrixByTitle).sort((a, b) => {
    if (a.topLevel === b.topLevel) {
      if (a.subCategory === b.subCategory) {
        return a.component.localeCompare(b.component);
      }
      return a.subCategory.localeCompare(b.subCategory);
    }
    return a.topLevel.localeCompare(b.topLevel);
  });

  /**
   * Reshape into nested categories:
   * [
   *   {
   *     topLevel: 'Foundations',
   *     subCategory: 'Typography',
   *     groups: [
   *       {
   *         name: 'Editorial',
   *         rows: [{ component, web, native }, ...]
   *       },
   *       ...
   *     ]
   *   },
   *   ...
   * ]
   */
  /** @type {Record<string, Record<string, Record<string, { component: string; web: boolean; native: boolean }[]>>>} */
  const categoriesMap = {};

  for (const row of rows) {
    const top = row.topLevel || 'Other';
    const sub = row.subCategory || '';
    const groupName = row.group || '';

    if (!categoriesMap[top]) categoriesMap[top] = {};
    if (!categoriesMap[top][sub]) categoriesMap[top][sub] = {};
    if (!categoriesMap[top][sub][groupName]) categoriesMap[top][sub][groupName] = [];

    categoriesMap[top][sub][groupName].push({
      component: row.component,
      web: row.web,
      native: row.native,
    });
  }

  const categories = Object.entries(categoriesMap)
    .sort(([aTop], [bTop]) => aTop.localeCompare(bTop))
    .flatMap(([topLevel, subMap]) =>
      Object.entries(subMap)
        .sort(([aSub], [bSub]) => aSub.localeCompare(bSub))
        .map(([subCategory, groupMap]) => ({
          topLevel,
          subCategory,
          groups: Object.entries(groupMap)
            .sort(([aGroup], [bGroup]) => aGroup.localeCompare(bGroup))
            .map(([name, groupRows]) => ({
              name,
              rows: groupRows,
            })),
        }))
    );

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(categories, null, 2) + '\n', 'utf8');

  console.log(`✓ Component matrix written to ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
  console.log(`  Total entries: ${rows.length}`);
}

generateMatrix();


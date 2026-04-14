/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import fs from 'fs';

const {
  NATIVE_ENTRY,
  OUTPUT_FILE,
  WEB_ENTRY,
  getLookupName,
  loadOverrides,
  resolveComponentMatrixRows,
  unionBarrelExports,
} = require('./component-matrix-utils');

function failWithMissingPlatformExports({ platform, missingComponents, heading }) {
  if (missingComponents.length === 0) return;

  const entrypointText =
    platform === 'web'
      ? '`src/index.web.ts` / `src/components/index.web.ts`'
      : '`src/index.native.ts` / `src/components/index.native.ts`';

  throw new Error([
    heading,
    '',
    `Missing from ${platform} package entrypoint exports (${entrypointText}):`,
    ...missingComponents.map((component) => `  - ${component}`),
    '',
    'Fix: export each missing component through the relevant component index and package entrypoint before merging.',
  ].join('\n'));
}

const PLATFORM_CASES = [
  { platform: 'Web', entryFile: WEB_ENTRY },
  { platform: 'Native', entryFile: NATIVE_ENTRY },
];

describe('Package Export Coverage', () => {
  it('Roadmap is in sync with exports', () => {
    const expectedRows = resolveComponentMatrixRows();
    const committedRows = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    expect(committedRows).toEqual(expectedRows);
  });

    it.each(PLATFORM_CASES)(
      '$platform: Component Roadmap is Accurate',
      ({ platform, entryFile }) => {
        const rows = resolveComponentMatrixRows();
        const overrides = loadOverrides();
        const entryExports = unionBarrelExports(entryFile);

        const missingComponents = [];

        for (const row of rows) {
          const override = overrides[row.component] ?? {};
          const lookupName = getLookupName(row.component);
          if (row[platform] && override[platform] === undefined && !entryExports.has(lookupName)) {
            missingComponents.push(row.component);
          }
        }

        failWithMissingPlatformExports({
          platform,
          missingComponents,
          heading: `The roadmap is incorrect. Components marked as done for $platform are not exported.`,
        });
      }
    );
});

/**
 * Component Roadmap Config
 *
 * This is the canonical "master list" of all components that need to exist
 * in the design system. It defines what we're building toward.
 *
 * - `category`  Grouping used on the Component Roadmap page
 * - `name`        Display name (must match keys in component-roadmap-overrides.json)
 * - `platform`    Target platforms: `'web'` and/or `'native'`
 *
 * **Source of truth:** `component-roadmap-planned.json` (imported below). Edit that
 * file to add or reorder planned work. Run `yarn generate:component-matrix` so
 * `component-matrix.json` stays in sync for CI and the roadmap UI.
 *
 * **How "done" is determined:** `scripts/generate-component-matrix.js` compares each
 * planned name to PascalCase runtime exports from the web/native barrels and package
 * entrypoints, then applies `component-roadmap-overrides.json` where auto-detection
 * is wrong (e.g. subcomponents like `FormGroup.Label`). The roadmap treats a slot as
 * built when the generated matrix marks that platform `true`.
 */

import planned from './component-roadmap-planned.json';

export interface PlannedComponent {
  category: string;
  name: string;
  platform: ('web' | 'native')[];
}

export const PLANNED_COMPONENTS = planned as PlannedComponent[];

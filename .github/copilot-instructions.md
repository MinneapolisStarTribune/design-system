# GitHub Copilot code review — design-system

## Source of truth and precedence

- `docs/code-standards.md` is the authority on conventions here. `docs/release-runbook.md`
  owns changeset and release rules, `docs/git-workflow.md` branching,
  `docs/testing-web-and-native.md` the Vitest/Jest split. A documented standard beats any
  heuristic below; cite the doc when a comment rests on one.
- If an `AGENTS.md` or `CLAUDE.md` lands later it takes precedence over this file. Don't
  restate it here.

## Already enforced — do not report

`lint.yml` runs `eslint --max-warnings 0`, `prettier --check`, and `tsc --noEmit`.
`component-tests.yml` runs Vitest + Jest and the component-matrix check.
`changeset-check.yml` requires a changeset and blocks manual version edits. So never report:

- Formatting in TS/TSX/JSON: quotes, semicolons, 100-column width, trailing commas, JSON key
  order — Prettier owns all of it.
- `any`, unused variables, unused imports, `console.log`, `useEffect` dependency arrays, hook
  call order, `.length` truthiness checks, export ordering in `index.web.ts` /
  `index.native.ts`, alphabetization of `COMPONENT_NAMES` — each is an ESLint rule in
  `.eslintrc.cjs`, and `--max-warnings 0` makes even the `warn` ones fail.
- Type errors, missing annotations, bad generics — `tsc --noEmit` has them.
- A missing `.changeset/*.md`, or a hand-edited `"version"` in
  `packages/design-system/package.json`.
- A stale `component-matrix.json`, or failing tests.

## Two axes, neither masking the other

- **Standards** — does the diff conform to `docs/`? A breach is a hard violation.
- **Spec** — does it implement its ticket (SUS-/VAR-/STSA- in the branch or title) and the
  PR's own "Technical Description"? Flag requirements missing or partial, requirements
  implemented wrong, and behaviour nobody asked for. Reviewers here do ask "was this
  deliberate?" — a deliberately scoped-down change is fine when the PR says so, and a
  problem when it doesn't.

## Hard violations

- **Web/native drift.** A component with both `web/` and `native/` implementations must change
  on both sides, or the PR must say the omission is deliberate. Name the counterpart file and
  the diverging value. Precedent: a web-only default-size change left `Caption.native.tsx` at
  44px against web's new 40px.
- **Missing `'use client'`.** Any web component or hook file using `useState`, `useEffect`,
  `useRef`, `useContext`, `window`, or `document` opens with `'use client'` on line 1. Roughly
  fifty files do; consumers server-render this package.
- **SSR-unsafe access.** `window` or `document` touched during render or at module scope
  without a `typeof window === 'undefined'` guard or an effect.
- **Wrong changeset bump.** Per `docs/release-runbook.md`: patch = bug fix, no API change;
  minor = new component/prop/feature; major = breaking. A new public prop shipped as `patch`
  is wrong.
- **Hardcoded design values.** Hex or `rgba()` colour literals in `*.module.scss` or in a
  native `StyleSheet` where a `--color-*` custom property (web) or a `NativeTheme` token
  (native) exists. Same for spacing — `var(--spacing-*)`.
- **Themed native styles outside the two hooks.** Native components get styles from
  `useNativeStyles(factory)` or `useNativeStylesWithDefaults(factory)`
  (`@/hooks/useNativeStyles`), with `StyleSheet.create` inside the factory. Reading theme
  tokens any other way in a native component is a violation.
- **Inline variant arrays.** `it.each([...])` and `argTypes.options: [...]` must use the
  exported const from the component's `*.types.ts` (`BUTTON_SIZES`, `CAPTION_VARIANTS`, …),
  never a literal list.
- **Story shape.** A new `*.stories.tsx` exports exactly two stories: `Configurable` (or
  `Configurable<Component>`) first, `AllVariants` second. Chromatic snapshots `AllVariants`.
- **Missing a11y test.** A new or behaviour-changed web component needs `*.a11y.test.tsx`;
  native needs `*.native.a11y.test.tsx`.
- **Cross-area relative imports.** Use `@/…`. `../ComponentName.types` from inside `web/` or
  `native/` is the documented pattern and fine; `../../hooks/…` or `../../../types` is not.
- **Helpers exported only so a test can reach them.** Assert through the public entry point
  instead — this was raised on `get-style-dictionary-config.js`'s `toReactNativeRgba`.
- **Native runtime dependency in the wrong field.** A React Native package consumers must
  install belongs in `peerDependencies` with `peerDependenciesMeta.<pkg>.optional: true`
  *and* in `devDependencies` — never in `dependencies`, and never devDependencies alone
  (Yarn hoisting from `apps/mobile-storybook` hides the gap in this repo).
- **Docs out of step with the public API.** `docs/code-standards.md` requires it: a new export
  or prop needs `README.md` plus the matching `integration-guides/web.md`,
  `integration-guides/native.md`, or `integration-guides/architecture.md`. Also flag prose
  describing a subpath the `exports` map doesn't have — an invented
  `…/native/code-block` entry point shipped in a README draft.

## Judgement calls — raise for discussion, never a blocker

Any documented standard overrides these.

- Duplicated responsive-breakpoint logic. `useResponsiveSize` exists, yet `Caption.tsx` and
  `ImageGallery.tsx` each re-implement a `window.innerWidth` resize listener with their own
  `1024` literal. Point at the hook.
- Magic numbers where a token or exported constant already exists
  (`DESKTOP_NAV_BREAKPOINT`, `--spacing-*`).
- A style or markup change with no `*.stories.tsx` change. `chromatic.yml` runs only when
  stories or `.storybook/**` change, so that visual diff gets no regression coverage.
  Suggest touching the story.
- Props typed loosely where the component's `*.types.ts` already exports a union.
- Tests inlining `<DesignSystemContext.Provider>` instead of
  `TestWrapperInDesignSystemProvider()` from `@/test-utils/wrappers`.
- Native token modules stubbed with `vi.mock()` / `jest.mock()` instead of
  `nativeTokenFixtures` from `@/test-utils/nativeTokenFixtures`.

## Skip entirely

`yarn.lock`, `packages/design-system/dist/**`, `packages/design-system/build/**`,
`packages/design-system/src/icons/index.ts`, `packages/design-system/src/icons/index.native.ts`,
`packages/design-system/src/types/native-theme.generated.ts`,
`packages/design-system/src/types/mobile-themes.d.ts`,
`packages/design-system/src/types/mobile-typography.d.ts`,
`packages/design-system/src/stories/GettingStarted/component-matrix.json`,
`**/__snapshots__/**`, `**/*.snap`, `packages/design-system/CHANGELOG.md`,
`apps/mobile-storybook/ios/**`, `apps/mobile-storybook/android/**`.

Skip the bot's "chore: version packages" PR entirely.

## Environment

`.github/workflows/copilot-code-review.yml` installs dependencies, so types and imports
resolve across files — use that to check call sites and cross-platform counterparts, not to
re-report lint or type findings CI already posts.

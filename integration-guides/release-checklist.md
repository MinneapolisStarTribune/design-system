# Release Checklist (Web + Native + Multi-Brand)

Use this checklist before publishing `@minneapolisstartribune/design-system` to reduce the chance of breaking consuming apps/brands.

## 1) Baseline quality gates (required)

- [ ] Automated gate in publish workflow passes (`release:verify`)
- [ ] `yarn workspace @minneapolisstartribune/design-system lint`
- [ ] `yarn workspace @minneapolisstartribune/design-system format:check`
- [ ] `yarn workspace @minneapolisstartribune/design-system typecheck`
- [ ] `yarn workspace @minneapolisstartribune/design-system test:coverage -- --exclude "**/*.a11y.test.tsx"`
- [ ] `yarn workspace @minneapolisstartribune/design-system test:a11y --coverage`
- [ ] `yarn workspace @minneapolisstartribune/design-system test:native`
- [ ] `yarn workspace @minneapolisstartribune/design-system build`

## 2) Platform coverage (required)

- [ ] Web integration paths validated (`/web` entry, theme css imports, `components.css`)
- [ ] Native integration paths validated (`/native` entry, provider usage, native peers)
- [ ] Any web-only or native-only changes are clearly called out in PR and release notes

## 3) Multi-brand safety (required for UI/token/theme changes)

- [ ] Validate changed components for each supported brand
- [ ] Validate both light and dark schemes when applicable
- [ ] Confirm no brand token regressions in typography, spacing, color, and icon usage

## 4) Visual regression (required for UI-impacting changes)

- [ ] Storybook stories added/updated for changed UI
- [ ] Chromatic checks reviewed and approved
- [ ] If token/theme changes do not touch stories, run an explicit visual verification pass

## 5) Consumer safety and release notes (required)

- [ ] Breaking changes documented with migration steps
- [ ] Public API/export changes called out explicitly
- [ ] Release notes include impact summary for consuming apps/brands

## 6) Suggested manual smoke checks (recommended)

- [ ] Quick smoke in at least one web consumer app
- [ ] Quick smoke in at least one native consumer app (if native surface changed)
- [ ] Verify key components used heavily by brands (Button, Link, Typography, Form controls)

## 7) Consumer smoke test matrix (recommended)

Use this matrix to decide where to run manual smoke tests based on what changed.

| Change type | Minimum consumer verification |
| --- | --- |
| Web component behavior/UI change | 1 primary web app (e.g. `startribune-web`) + Storybook visual check |
| Token/theme/color/typography change | 1 web app with Star Tribune theme + 1 web app/page with Varsity theme; check light/dark where supported |
| Native component behavior/UI change | 1 primary native app (or mobile-storybook) on iOS and Android surface as applicable |
| Shared type/export/public API change | One web consumer build + one native consumer build (if native exports affected) |
| Build/tooling/config change | Fresh install + clean build in at least one web consumer and one native consumer |
| Icons/fonts asset change | Verify at least one consumer rendering icons and branded fonts in real app context |

## 8) Notes

- Keep README peer dependency install examples aligned with `peerDependencies` in `packages/design-system/package.json`.
- Prefer explicit release notes over implicit assumptions; consuming teams should know exactly what changed.
- The publish workflow runs `yarn workspace @minneapolisstartribune/design-system release:verify` before version bump/publish so release gates are enforced even if a step is missed manually.

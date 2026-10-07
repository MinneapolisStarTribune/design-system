---
name: design-system
description: How to integrate @minneapolisstartribune/design-system into a web (React) or native (React Native) app — entry points, DesignSystemProvider, theme CSS, component usage, analytics wiring, and troubleshooting. Use when adding, importing, configuring, or debugging design-system components in a consuming app.
---

# @minneapolisstartribune/design-system integration

Read the guide that matches the task before writing code:

- **Web (React) app** → [web.md](web.md): peer dependencies, theme CSS imports,
  `DesignSystemProvider`, component-specific setup (Coachmark, Dialog, Drawer,
  popover portal root), icons, fonts.
- **React Native app** → [native.md](native.md): peer dependencies,
  `DesignSystemProvider`, `useNativeStyles` helpers.
- **Analytics / tracking events** → [analytics.md](analytics.md):
  `AnalyticsProvider` setup and per-component event payloads.
- **Something isn't working** (unstyled components, theme not applying, import
  errors, fonts, registry auth) → [troubleshooting.md](troubleshooting.md).

`architecture.md` and `release-checklist.md` are for contributors to the design
system itself; ignore them when working in a consuming app.

## Rules that apply everywhere

- Import from `@minneapolisstartribune/design-system/web` or
  `@minneapolisstartribune/design-system/native`. The package root throws on
  purpose.
- Wrap the app in `DesignSystemProvider` with a `brand` and color scheme.
- Web apps must also import a theme stylesheet
  (`/web/{brand}-{colorScheme}.css`) and `/web/components.css` before
  components render.
- Use the components' props and design tokens (CSS variables) rather than
  overriding their styles with hardcoded values.

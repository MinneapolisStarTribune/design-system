---
'@minneapolisstartribune/design-system': minor
---

Export `useCoachmarkPortalRoot` (web) alongside `Coachmark`: creates/reuses a dedicated, viewport-pinned DOM node to use as `Coachmark`'s `portalRoot` prop, so a consuming app's CSS can target one particular coachmark instance (e.g. to give it a different z-index than the rest) via that root's id. Also fixes the `flip`/`shift` boundary issue a bare, zero-height portal node would otherwise cause.

Moved here from an app that had its own copy of this logic, since any consumer of `Coachmark` with a custom `portalRoot` needs the same safeguards.

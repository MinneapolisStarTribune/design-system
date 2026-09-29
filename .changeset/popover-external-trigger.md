---
'@minneapolisstartribune/design-system': major
---

**Breaking:** Remove the deprecated `TriggerablePopover` component and `useExternalTrigger`/`installExternalTriggerGlobals` hook (plus the `TriggerablePopoverProps`, `UseExternalTriggerOptions` and `UseExternalTriggerResult` types). Use `Popover` with a controlled `open`/`onOpenChange` instead, driven by `@minneapolisstartribune/external-trigger`'s `ExternalTriggerProvider`/`useExternalTriggerState`/`useTriggerExternal`.

Also adds `Popover.ExternalContent`, a `Coachmark` component, and `PianoCoachmark` (with `parsePianoCoachmarkResponseVariables`), which is driven by `@minneapolisstartribune/external-trigger`. That package is a new optional peer dependency, required only if you use `PianoCoachmark`.

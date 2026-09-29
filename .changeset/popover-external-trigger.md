---
'@minneapolisstartribune/design-system': major
---

**Breaking:** Remove everything added in #430 (2.1.0):

- The `TriggerablePopover` component and the `useExternalTrigger`/`installExternalTriggerGlobals` hook, plus the `TriggerablePopoverProps`, `UseExternalTriggerOptions` and `UseExternalTriggerResult` types. For Piano-triggered content, use `PianoCoachmark`.
- `Popover`'s dark-theme styling. Under `[data-theme='dark']`/`.sb-dark`, its wrapper, divider and arrow render with light colors again, as they did before 2.1.0.

Adds a `Coachmark` component and `PianoCoachmark` (with `parsePianoCoachmarkResponseVariables`), which is driven by `@minneapolisstartribune/external-trigger`. That package is a new optional peer dependency, required only if you use `PianoCoachmark`.

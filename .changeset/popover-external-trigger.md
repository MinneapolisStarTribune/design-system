---
'@minneapolisstartribune/design-system': minor
---

Add `triggerId`/`externalContent` props to `Popover`, backed by a new generic `ExternalTriggerProvider`/`useExternalTriggerState`/`useTriggerExternal` (a simpler, payload-carrying alternative to the injection-slot mechanism). `TriggerablePopover` and `useExternalTrigger` are now deprecated in favor of this — they still work as before and aren't being removed in this release.

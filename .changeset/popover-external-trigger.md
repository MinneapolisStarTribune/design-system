---
'@minneapolisstartribune/design-system': major
---

**Breaking:** Remove everything added in #430 (2.1.0):

- The `TriggerablePopover` component and the `useExternalTrigger`/`installExternalTriggerGlobals` hook, plus the `TriggerablePopoverProps`, `UseExternalTriggerOptions` and `UseExternalTriggerResult` types. For Piano-triggered content, see `@minneapolisstartribune/piano-coachmark`.
- `Popover`'s dark-theme styling. Under `[data-theme='dark']`/`.sb-dark`, its wrapper, divider and arrow render with light colors again, as they did before 2.1.0.

Adds a `Coachmark` component — a dismissible, externally-controlled callout for an unprompted single action. Vendor-specific coachmark integrations (e.g. Piano) live outside this package; see `@minneapolisstartribune/piano-coachmark`.

`Tooltip` gains click-triggered rich `content` (switching to `role="dialog"`), a controlled `open`/`onOpenChange` pair, `TooltipCloseContext`/`useTooltipCloseContext` for custom content to close it, `dismissible` to opt out of outside-click/Escape dismissal, and `containerClassName` to override its 280px max-width. `label` is now optional.

---
'@minneapolisstartribune/design-system': minor
---

Add `Dialog` (web): a modal window that's centered on larger screens and rises from the bottom as a sheet on phones.
Also adds `error` color option for Button in order to allow for cancellation buttons, a common pattern on confirmation dialogs.
`Dialog.Actions` stacks its actions full width on phones by default; pass `stackOnMobile={false}` to keep them side by side for longer content like forms.

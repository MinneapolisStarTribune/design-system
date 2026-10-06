---
'@minneapolisstartribune/design-system': minor
---

Add `Dialog` (web): a modal window that's centered on larger screens and rises from the bottom as a sheet on phones.
Also adds `error` color option for Button (web and native) in order to allow for delete/destructive confirmation buttons, a common pattern on confirmation dialogs.
`Dialog.Actions` stacks its actions full width on phones by default; pass `stackOnMobile={false}` to keep them side by side for longer content like forms.
`Dialog.Title` renders an `h2` by default; pass `as` (`'h1' | 'h2' | 'h3' | 'h4' | 'div'`) to change the heading level, or `div` for content that isn't a single heading, like a logo plus a title. Its props are exported as `DialogTitleProps`.

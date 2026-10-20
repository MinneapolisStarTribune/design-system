---
'@minneapolisstartribune/design-system': patch
---

`Select` now renders its listbox in a portal positioned with Floating UI, so a scrollable or `overflow: hidden` ancestor such as a table no longer clips it. Opening the list no longer scrolls the page or its container. The list flips above the trigger when there is no room below, and it shrinks to fit the space available. `Select` on web now needs the `@floating-ui/react` peer dependency.

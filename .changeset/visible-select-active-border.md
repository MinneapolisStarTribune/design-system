---
'@minneapolisstartribune/design-system': patch
---

Keep the web Select's active border visible inside scroll containers such as Popover.Body by drawing its existing 1px focus ring inside the control. Open and focused controls retain their dimensions, design tokens, and existing error and disabled states. Native Select is unchanged because this fixes browser overflow clipping.

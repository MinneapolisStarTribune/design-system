---
'@minneapolisstartribune/design-system': patch
---

Fix `Coachmark` logging "Accessing element.ref was removed in React 19" whenever its child has its own ref. Reads the ref from `element.props.ref` (where React 19 moved it) instead of the deprecated top-level `element.ref` getter -- no behavior change, the child's own ref and `Coachmark`'s floating reference ref still merge exactly as before.

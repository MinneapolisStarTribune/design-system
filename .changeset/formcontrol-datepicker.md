---
'@minneapolisstartribune/design-system': minor
'@minneapolisstartribune/design-system-tanstack-form': minor
---

Add FormControl.Datepicker and the direct FormControlDatepicker export, composing the existing calendar with typed date entry, inclusive limits, native form validation, and a leading calendar icon and trailing expand/collapse chevron. Export validateDateInput for matching form validation.

Add the DateField TanStack adapter with shared label/error handling and reset behavior. Require SUS 4.3.0, which includes the new control.

Use static web FormControl members so Rollup/Vite consumers of other controls can exclude Datepicker code. All documented compound members and direct exports remain available; FormControl itself remains a non-renderable container.

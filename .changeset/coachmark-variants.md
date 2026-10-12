---
'@minneapolisstartribune/design-system': minor
---

`Coachmark` supports every variant in the Core Components design:

- `secondaryCtaText`, `onSecondaryAction`, and `secondaryActionHref` add a ghost secondary action.
- `ctaLayout` (`'stacked'` by default, or `'inline'`) sets how the actions are laid out. Inline puts the secondary action before the primary one, aligned to the end.
- `counter` replaces the close button with step text, such as `'1 of 3'`.
- `showCloseButton={false}` hides the close button.
- `coachmark_cta_click` events now include `cta_role` (`'primary'` or `'secondary'`).

Exports `COACHMARK_CTA_LAYOUTS` and the `CoachmarkCtaLayout` type.

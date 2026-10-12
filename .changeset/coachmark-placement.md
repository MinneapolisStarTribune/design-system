---
'@minneapolisstartribune/design-system': major
---

`Coachmark` replaces `position` with `placement`, which uses the same naming as `Menu` and `Popover` (`'bottom'`, `'top-start'`, `'left'`, and so on) and accepts a value per breakpoint. Coachmark supports 8 of those placements: `top`, `bottom`, and their `-start` and `-end` alignments, plus `left` and `right`. Map old values: `'bottom-left'` is `'bottom-end'`, `'bottom-right'` is `'bottom-start'`, `'bottom-center'` is `'bottom'`, `'center-left'` is `'left'`, `'center-right'` is `'right'`, and the same applies to `'top-*'`. `COACHMARK_POSITIONS` and `CoachmarkPosition` are removed in favor of `COACHMARK_PLACEMENTS` and `CoachmarkPlacement`. Tracking events report `placement` instead of `position`.

`Popover`'s `placement` accepts `-start` and `-end` alignments, such as `'bottom-start'`, for all 12 placements, and a value per breakpoint. The new `PopoverPlacement` type names these values. Its arrow now matches the Core Components design (10×6, was 16×8), sits 2px closer to the trigger as a result, and stays 16px clear of the rounded corners.

`Coachmark`'s arrow now matches the Core Components design (16×12, was 12×6), so the card sits 12px from its anchor (was 6px).

`Coachmark` now shares its open state, portal, focus handling, and arrow with `Popover` and `Menu`. Its positioning, dismiss behavior, and other analytics fields are unchanged.

---
'@minneapolisstartribune/design-system': minor
---

Add `Coachmark`'s `trackReferenceMovement` prop (web): repositions on every animation frame instead of only on scroll/resize events. Defaults to false (unchanged behavior). Turn on when `children` scrolls within the page (e.g. a table row) rather than staying fixed on screen (e.g. a sticky header icon) -- event-based repositioning can visibly lag behind a reference that's continuously moving, since browsers can throttle/coalesce scroll event dispatch during a fast or flung scroll.

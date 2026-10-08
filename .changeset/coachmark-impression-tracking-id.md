---
'@minneapolisstartribune/design-system': minor
---

Add `Coachmark`'s `impressionTrackingId` prop (web): renders an empty, inert element with that id inside the floating panel itself, sized and positioned to exactly cover it.

For a third party (e.g. Piano) that tracks impressions by watching whether *its own* element intersects the viewport, rather than anything this component exposes directly. That element needs to actually move and resize with the panel to reflect the coachmark's real on-screen visibility -- a tracking element placed anywhere else on the page (e.g. appended to `document.body`) can't accurately reflect that.

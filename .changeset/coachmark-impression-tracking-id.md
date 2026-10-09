---
'@minneapolisstartribune/design-system': minor
---

Add `Coachmark`'s `impressionTrackingId` prop (web): renders an empty, inert element with that id inside the floating panel itself, sized and positioned to exactly cover it.

For a third party (e.g. Piano) that tracks impressions by watching whether _its own_ element intersects the viewport, rather than anything this component exposes directly. That element needs to actually move and resize with the panel to reflect the coachmark's real on-screen visibility -- a tracking element placed anywhere else on the page (e.g. appended to `document.body`) can't accurately reflect that.

Given a local `zIndex: -1`, so whatever a third party injects there (e.g. an iframe) stays visually behind the panel's own title/description/CTA instead of covering them -- a positioned element with no z-index of its own otherwise paints above normal in-flow content regardless of DOM order. Also carries the HTML `inert` attribute, not just `aria-hidden`, so injected focusable content (e.g. that same iframe) can't still be reached by keyboard even though it's hidden from screen readers and click-through.

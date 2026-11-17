---
'@minneapolisstartribune/design-system': patch
---

Dialog and Drawer scroll fades use an IntersectionObserver instead of scroll-driven animations, so visual snapshot tools no longer catch the bottom fade on content that doesn't scroll.

---
'@minneapolisstartribune/design-system': patch
---

Bumped `react-native-svg` from 15.12.1 to 15.15.3. This resolves the 'Unable to resolve module buffer' error when trying to upgrade the design system package in the mobile repo.

Consumers must rebuild native (`pod install` / new dev client) — this changes a native module version, so a JS-only update will not pick it up. Apps pinning `react-native-svg` should move to 15.15.3 in lockstep to avoid two copies resolving against one native build.

[Missing buffer dependency - software-mansion/react-native-svg#2701](https://github.com/software-mansion/react-native-svg/issues/2701).

---
'@minneapolisstartribune/design-system': major
---

Move `react-native-svg` and `react-native-webview` from `dependencies` to optional
`peerDependencies` so web consumers no longer install React Native packages transitively.

**Breaking for native consumers.** Every native consumer must now declare `react-native-svg`
directly (it backs `Icon`/`Toast`), as well as `react-native-webview` (used by code block components).

```bash
npx expo install react-native-svg react-native-webview
```

# Mobile Usage

Complete guide for using the design system in React Native applications.

## DesignSystemProvider

The `DesignSystemProvider` is required for React Native apps to provide brand and color scheme context. It enables:

- **Brand support**: Components can access the current brand (startribune/varsity)
- **Dark/Light mode**: Toggle between light and dark color schemes
- **Token consumption**: Components automatically use the correct tokens for the selected brand and color scheme

```tsx
import { DesignSystemProvider } from '@minneapolisstartribune/design-system/native';

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  return (
    <DesignSystemProvider brand="startribune" forceColorScheme={colorScheme}>
      {/* Your app components */}
      <Button onPress={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))} />
    </DesignSystemProvider>
  );
}
```

## React Native Components

Import components from the native entry point:

```tsx
import { DesignSystemProvider, Button } from '@minneapolisstartribune/design-system/native';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Click me" onPress={() => {}} />
    </DesignSystemProvider>
  );
}
```

Components use design tokens internally - you don't need to import tokens directly. The library handles all token consumption based on the brand and color scheme provided by `DesignSystemProvider`.

## Hooks

### `useNativeStyles`

The recommended way to create theme-aware `StyleSheet` styles in native components. It memoises the result of a factory function against the current theme, so styles are only re-created when the brand or color scheme changes.

Define the factory at **module level** (outside the component) so its reference is stable across renders.

```tsx
import { Text, StyleSheet } from 'react-native';
import { useNativeStyles } from '@minneapolisstartribune/design-system/native';

export const Greeting = () => {
  const styles = useNativeStyles(createStyles);
  return <Text style={styles.heading}>Hello</Text>;
};

const createStyles = (theme) =>
  StyleSheet.create({
    heading: {
      color: theme.colorBackgroundBrand,
      fontSize: theme.typographyArticleQuoteLarge.fontSize,
    },
  });
```

### `useNativeTokens`

Lower-level hook that gives direct access to the current brand, color scheme, and the full theme token object. Use this when you need the raw tokens outside of `StyleSheet.create` — for example, passing a token value as a prop or computing a derived value.

```tsx
import { View, Text } from 'react-native';
import { useNativeTokens } from '@minneapolisstartribune/design-system/native';

function MyComponent() {
  const { brand, colorScheme, theme } = useNativeTokens();

  return (
    <View style={{ borderRadius: theme.semanticPhotoLayoutBorderRadius }}>
      <Text>Brand: {brand}, Scheme: {colorScheme}</Text>
    </View>
  );
}
```

> **Tip**: Prefer `useNativeStyles` for stylesheet creation — it wraps `useNativeTokens` and adds memoisation automatically. Reach for `useNativeTokens` directly only when you need `brand`, `colorScheme`, or individual token values outside of a stylesheet.

## Troubleshooting

See [Troubleshooting](troubleshooting.md#mobile-issues) for common mobile-specific issues.

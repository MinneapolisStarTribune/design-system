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

## Hooks and Helpers

### `useNativeStyles`

Base hook for theme-aware styles.

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

### `useNativeStylesWithDefaults`

Preferred one-stop hook for typography-heavy native components. It combines:
- theme-aware memoization from `useNativeStyles`
- defaults (like typography color)
- `StyleSheet.create` under the hood

```tsx
import { Text } from 'react-native';
import {
  useNativeStylesWithDefaults,
} from '@minneapolisstartribune/design-system/native';

export const Quote = () => {
  const styles = useNativeStylesWithDefaults(createStyles);
  return <Text style={styles.large}>Quote text</Text>;
};

const createStyles = (theme) =>
  ({
    small: { ...theme.typographyArticleQuoteSmall },
    large: { ...theme.typographyArticleQuoteLarge },
  });
```

> **Tip**: Use `useNativeStylesWithDefaults` for text/typography components and `useNativeStyles` for everything else.

## Troubleshooting

See [Troubleshooting](troubleshooting.md#mobile-issues) for common mobile-specific issues.

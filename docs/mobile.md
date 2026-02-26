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

## Troubleshooting

See [Troubleshooting Guide](troubleshooting.md#mobile-issues) for common mobile-specific issues.

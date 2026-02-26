# Web Usage

Complete guide for using the design system in web (React) applications.

## Design Tokens

This design system uses [Style Dictionary](https://amzn.github.io/style-dictionary/) to manage design tokens across multiple brands.

### Available Themes

Theme files are organized by brand and color scheme:

- **Star Tribune Light** - `dist/themes/startribune-light.css`
- **Star Tribune Dark** - `dist/themes/startribune-dark.css`
- **Varsity Light** - `dist/themes/varsity-light.css`
- **Varsity Dark** - `dist/themes/varsity-dark.css`

### Using Themes

**Step 1: Choose Your Brand and Color Scheme**

You need to load the correct CSS file based on your brand and whether you're using light or dark mode, then wrap your app with `DesignSystemProvider`.

**Option A: Static import (if you know the brand/theme at build time)**

```tsx
// In your main entry file (e.g., main.tsx or App.tsx)
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';
// or
import '@minneapolisstartribune/design-system/dist/themes/startribune-dark.css';

// Then wrap your app with DesignSystemProvider
import { DesignSystemProvider } from '@minneapolisstartribune/design-system/web';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      {/* Your app */}
    </DesignSystemProvider>
  );
}
```

**Option B: Dynamic loading (if you need to switch themes at runtime)**

```tsx
import { useEffect, useState } from 'react';
import { DesignSystemProvider } from '@minneapolisstartribune/design-system/web';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const brand = 'startribune'; // or 'varsity'

  useEffect(() => {
    // Remove any existing theme link
    const existingLink = document.getElementById('design-system-theme');
    if (existingLink) {
      existingLink.remove();
    }

    // Load the correct theme CSS
    // Note: Adjust this path based on how your bundler resolves node_modules
    // For Vite: `/node_modules/@minneapolisstartribune/design-system/dist/themes/${brand}-${theme}.css`
    // For Webpack/CRA: You may need to use a dynamic import or copy files to public folder
    const link = document.createElement('link');
    link.id = 'design-system-theme';
    link.rel = 'stylesheet';
    link.href = `/node_modules/@minneapolisstartribune/design-system/dist/themes/${brand}-${theme}.css`;
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => {
      const linkToRemove = document.getElementById('design-system-theme');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [brand, theme]);

  return (
    <DesignSystemProvider brand={brand} forceColorScheme={theme}>
      {/* Your app with theme switcher */}
      <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
        Toggle Theme
      </button>
    </DesignSystemProvider>
  );
}
```

**Using CSS variables in your styles:**

All themes include the same token names, so you can use CSS variables in your CSS modules or inline styles:

```css
/* In your CSS module or stylesheet */
.my-component {
  background: var(--color-brand-primary-strib-emerald-green);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-subtle);
}
```

### Using React Components

If you're using the design system's React components, you need to:

1. **Load the theme CSS file** (see above)
2. **Wrap your app with `DesignSystemProvider`**
3. **Import and use components**

**Basic Example**

```tsx
import { DesignSystemProvider, Button } from '@minneapolisstartribune/design-system/web';
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Click me" onClick={() => {}} />
    </DesignSystemProvider>
  );
}
```

**Typography Components Example**

```tsx
import {
  DesignSystemProvider,
  NewsHeading,
  ArticleBodyText,
  SectionHeading,
} from '@minneapolisstartribune/design-system/web';
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';

function Article() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <article>
        <NewsHeading importance={1}>Article Title</NewsHeading>
        <SectionHeading importance={2}>Section Title</SectionHeading>
        <ArticleBodyText>
          This is the article body text with proper typography styling.
        </ArticleBodyText>
      </article>
    </DesignSystemProvider>
  );
}
```

**Form Components Example**

```tsx
import {
  DesignSystemProvider,
  FormGroup,
  FormControl,
  TextInput,
} from '@minneapolisstartribune/design-system/web';
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';

function ContactForm() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <FormGroup>
        <FormControl>
          <TextInput label="Name" placeholder="Enter your name" />
        </FormControl>
        <FormControl>
          <TextInput label="Email" type="email" placeholder="Enter your email" />
        </FormControl>
      </FormGroup>
    </DesignSystemProvider>
  );
}
```

**Important notes:**

- The `brand` prop must match the CSS file you imported (`'startribune'` or `'varsity'`)
- The `forceColorScheme` prop must match the CSS file (`'light'` or `'dark'`)
- If you want to switch themes dynamically, use the dynamic loading approach shown above
- The CSS file must be loaded **before** components render, or CSS variables will be undefined
- Fonts are automatically loaded by `DesignSystemProvider` - no manual font loading needed

## Font Loading

Fonts are automatically loaded by `DesignSystemProvider` when your app renders. The provider handles brand-specific font loading internally.

If you need manual font loading (e.g., for non-React usage), you can use the exported utilities:

```tsx
import { getBrandFontPath, loadBrandFonts } from '@minneapolisstartribune/design-system/web';

// Load fonts for a specific brand
loadBrandFonts('startribune');

// Get the font path for a brand
const fontPath = getBrandFontPath('startribune');
```

## Setup Checklist

**For React apps using Mantine components:**

- [ ] Import the correct theme CSS file: `{brand}-{colorScheme}.css`
- [ ] Wrap your app with `<DesignSystemProvider brand="..." forceColorScheme="...">`
- [ ] Ensure `brand` prop matches the CSS file brand (`'startribune'` or `'varsity'`)
- [ ] Ensure `forceColorScheme` prop matches the CSS file (`'light'` or `'dark'`)
- [ ] Load CSS **before** components render (import at top of entry file)

**For CSS-only usage:**

- [ ] Import the correct theme CSS file: `{brand}-{colorScheme}.css`
- [ ] Use CSS variables in your styles: `var(--color-*)`
- [ ] Switch themes by changing the import path

**Verifying it works:**

1. Open browser DevTools
2. Check that CSS variables exist: `getComputedStyle(document.documentElement).getPropertyValue('--color-icon-on-light-primary')`
3. Should return a color value (not empty string)
4. For React apps, check that components render with correct colors
5. Inspect the `<html>` element in DevTools - you should see CSS custom properties (variables) defined
6. Check the Network tab to ensure the theme CSS file loaded successfully

## Troubleshooting

See [Troubleshooting Guide](troubleshooting.md#web-issues) for common web-specific issues.

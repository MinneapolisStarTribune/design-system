# design-system

A React component library built with TypeScript and Mantine, with a comprehensive design token system.

## Installation

This package is published to GitHub Packages. To install it, you'll need to configure npm/yarn to authenticate with GitHub.

### Step 1: Configure npm/yarn Authentication

**For npm:**

Create or edit `.yarnrc.yml` in your project root:

```
npmScopes:
  minneapolisstartribune:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAlwaysAuth: true
    npmAuthToken: "${{ secrets.NPM_AUTH_TOKEN_FOR_SUS }}"
```

**Security Note:** Never commit your token to version control! Use environment variables:

### Step 2: Install the Package

```bash
# Using yarn
yarn add @minneapolisstartribune/design-system
```

### Step 4: Install Peer Dependencies

This package requires Mantine and React as peer dependencies:

```bash
# Using yarn
yarn add @mantine/core@^7.15.0 @mantine/hooks@^7.15.0 react@^18.0.0 react-dom@^18.0.0
```

## Quick Start

1. **Install the package** (see [Installation](#installation) above)
2. **Import a theme CSS file** in your app entry point
3. **Wrap your app** with `DesignSystemProvider`
4. **Import and use components**

```tsx
// main.tsx or App.tsx
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';
import { DesignSystemProvider, Button } from '@minneapolisstartribune/design-system';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Hello World" onClick={() => {}} />
    </DesignSystemProvider>
  );
}
```

See [Using Themes](#using-themes) and [Available Components](#available-components) for more details.

### TypeScript configuration (tsconfig files)

This repo intentionally has **three** `tsconfig` files, each with a specific role:

- **`tsconfig.json`** – main project config used for builds and type-checking the library source in `src/`.
- **`.storybook/.tsconfig.json`** – Storybook config that extends the main one and adds Storybook-specific types and options.
- **`src/tsconfig.json`** – stories-only config so editors type-check `*.stories.tsx` files with the same settings as Storybook, avoiding false-positive JSX/`React` errors in some IDEs while keeping stories out of the main build.

## Available Components

Browse all components interactively in [Storybook](https://design-system-8bmbp4q1g-startribune-team-one.vercel.app).

### Component Categories

**Core Components:**

- `Button` - Interactive button component with multiple variants and colors
- `Icon` - SVG icon component with 200+ available icons
- `Popover` - Popover component with heading, body, and description

**Typography Components:**

_Editorial Headings:_

- `NewsHeading` - For news article headlines
- `NonNewsHeading` - For non-news editorial content
- `EnterpriseHeading` - For enterprise/long-form articles
- `OpinionHeading` - For opinion pieces
- `EditorialSponsoredText` - Sponsored content text styling

_Article Body:_

- `ArticleBodyText` - Main article body text
- `ArticleBodySponsoredText` - Sponsored article body text

_Utility Typography:_

- `UtilityLabel` - Labels and small text
- `UtilityBody` - Body text for utility contexts
- `SectionHeading` - Section-level headings (h1-h6)
- `PageHeading` - Page-level headings

**Form Components:**

- `FormGroup` - Form field group container
- `FormControl` - Form control wrapper
- `TextInput` - Text input field

### TypeScript Support

This package includes full TypeScript type definitions. All components and their props are fully typed.

#### Export Pattern

All component exports follow a consistent pattern:

```typescript
export { Component, type ComponentProps } from './path';
```

This means each component is exported alongside its main Props type. For example:

- `Button` and `ButtonProps`
- `NewsHeading` and `NewsHeadingProps`
- `Icon` and `IconProps`

#### Importing Types

You can import TypeScript types from the package for use in your own code. All types are exported from the main package entry point.

**Component Prop Types:**

```typescript
import type {
  ButtonProps,
  FormGroupProps,
  FormControlProps,
  TextInputProps,
  NewsHeadingProps,
  // ... and many more
} from '@minneapolisstartribune/design-system';
```

**Using Components:**

You can use components directly without importing types - TypeScript will infer the types automatically:

```typescript
import { Button } from '@minneapolisstartribune/design-system';

// Using the component directly - no types needed!
<Button
  label="Click me"
  onClick={() => console.log('clicked')}
  color="brand"           // TypeScript knows this is 'neutral' | 'brand' | 'brand-accent'
  variant="filled"        // TypeScript knows this is 'filled' | 'outlined' | 'ghost'
  size="large"           // TypeScript knows this is 'small' | 'medium' | 'large'
  icon="camera-filled"   // TypeScript knows valid icon names
  iconPosition="start"    // TypeScript knows this is 'start' | 'end'
  isDisabled={false}
  className="my-class"
  data-testid="my-button"
  aria-label="Custom label"
  // ... any other HTML button attributes
/>
```

**When You Need to Import Types:**

You only need to import prop types when you're:

- Typing function parameters or variables
- Creating wrapper components or HOCs
- Extending component props
- Accessing nested types for type annotations

**Accessing Nested Types:**

Nested types (like `ButtonColor`, `NewsHeadingImportance`, etc.) are accessible via TypeScript indexed access types:

```typescript
import type { ButtonProps, NewsHeadingProps } from '@minneapolisstartribune/design-system';

// Access nested types using indexed access
type ButtonColor = ButtonProps['color']; // 'neutral' | 'brand' | 'brand-accent' | undefined
type ButtonVariant = ButtonProps['variant']; // 'filled' | 'outlined' | 'ghost' | undefined
type NewsHeadingImportance = NewsHeadingProps['importance']; // 1 | 2 | 3 | 4 | 5 | 6
```

**Example: Using Types in Your Code**

```typescript
import { Button } from '@minneapolisstartribune/design-system';
import type { ButtonProps, Brand } from '@minneapolisstartribune/design-system';

// Type function parameters
function createButton(props: ButtonProps) {
  return <Button {...props} />;
}

// Access nested types for function parameters
function setButtonColor(color: ButtonProps['color']) {
  // color is typed as 'neutral' | 'brand' | 'brand-accent' | undefined
}

// Use brand type
const currentBrand: Brand = 'startribune';

// Extend component props
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}
```

### Versioning

This package follows [semantic versioning](https://semver.org/). Check your installed version:

```bash
npm list @minneapolisstartribune/design-system
# or
yarn list --pattern @minneapolisstartribune/design-system
```

To update to the latest version:

```bash
npm install @minneapolisstartribune/design-system@latest
# or
yarn add @minneapolisstartribune/design-system@latest
```

## Design Tokens

This design system uses [Style Dictionary](https://amzn.github.io/style-dictionary/) to manage design tokens across multiple brands.

### Available Themes

Theme files are organized by brand and color scheme:

- **Star Tribune Light** - `dist/themes/startribune-light.css`
- **Star Tribune Dark** - `dist/themes/startribune-dark.css`
- **Varsity Light** - `dist/themes/varsity-light.css`
- **Varsity Dark** - `dist/themes/varsity-dark.css`

### Using Themes

#### Step 1: Choose Your Brand and Color Scheme

You need to load the correct CSS file based on your brand and whether you're using light or dark mode, then wrap your app with `DesignSystemProvider`.

**Option A: Static import (if you know the brand/theme at build time)**

```tsx
// In your main entry file (e.g., main.tsx or App.tsx)
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';
// or
import '@minneapolisstartribune/design-system/dist/themes/startribune-dark.css';

// Then wrap your app with DesignSystemProvider
import { DesignSystemProvider } from '@minneapolisstartribune/design-system';

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
import { DesignSystemProvider } from '@minneapolisstartribune/design-system';

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

#### Basic Example

```tsx
import { DesignSystemProvider, Button } from '@minneapolisstartribune/design-system';
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Click me" onClick={() => {}} />
    </DesignSystemProvider>
  );
}
```

#### Typography Components Example

```tsx
import {
  DesignSystemProvider,
  NewsHeading,
  ArticleBodyText,
  SectionHeading,
} from '@minneapolisstartribune/design-system';
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

#### Form Components Example

```tsx
import {
  DesignSystemProvider,
  FormGroup,
  FormControl,
  TextInput,
} from '@minneapolisstartribune/design-system';
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

### Quick Reference: Setup Checklist

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

## Font Loading

Fonts are automatically loaded by `DesignSystemProvider` when your app renders. The provider handles brand-specific font loading internally.

If you need manual font loading (e.g., for non-React usage), you can use the exported utilities:

```tsx
import { getBrandFontPath, loadBrandFonts } from '@minneapolisstartribune/design-system';

// Load fonts for a specific brand
loadBrandFonts('startribune');

// Get the font path for a brand
const fontPath = getBrandFontPath('startribune');
```

## Troubleshooting

### CSS Variables Not Loading

**Symptoms:** Components appear unstyled or with default browser styles.

**Solutions:**

1. Verify the theme CSS file is imported before components render
2. Check the Network tab to ensure the CSS file loaded (look for `{brand}-{colorScheme}.css`)
3. Ensure the import path is correct: `@minneapolisstartribune/design-system/dist/themes/{brand}-{colorScheme}.css`
4. For dynamic loading, verify the link element is added to `<head>` before React renders

### Theme Not Applying

**Symptoms:** Components render but don't match the expected theme colors.

**Solutions:**

1. Verify `brand` prop matches the CSS file brand (`'startribune'` or `'varsity'`)
2. Verify `forceColorScheme` prop matches the CSS file (`'light'` or `'dark'`)
3. Check that `DesignSystemProvider` wraps all components that need theming
4. Inspect computed styles in DevTools to see if CSS variables are defined

### Component Styling Issues

**Symptoms:** Components render but styling looks wrong.

**Solutions:**

1. Ensure `DesignSystemProvider` is wrapping your components
2. Verify you're using the correct brand/theme combination
3. Check that Mantine peer dependencies are installed and compatible
4. Clear your build cache and rebuild: `rm -rf node_modules/.cache && yarn build` (or `npm run build`)

### Build/Bundler Configuration Issues

**Symptoms:** Import errors or CSS not being processed.

**Solutions:**

1. **Vite:** No special configuration needed - CSS imports work out of the box
2. **Webpack/CRA:** May need to configure CSS loader. Ensure CSS files in `node_modules` are processed
3. **TypeScript:** Ensure `@minneapolisstartribune/design-system` is in your `tsconfig.json` types
4. **Module resolution:** Verify your bundler can resolve packages from GitHub Packages registry

### Authentication Issues

**Symptoms:** `npm install` or `yarn add` fails with 404 or authentication errors.

**Solutions:**

1. Verify your `.npmrc` or `.yarnrc` is configured correctly (see [Installation](#installation))
2. Check that your GitHub token has `read:packages` scope
3. Ensure the token hasn't expired
4. For CI/CD, verify the token is set as a secret/environment variable

### Still Having Issues?

- Check the [Storybook](https://design-system-8bmbp4q1g-startribune-team-one.vercel.app) for working examples
- Review component source code in the repository
- Open an issue on GitHub with details about your setup and error messages

# design-system

A React component library built with TypeScript, Tamagui, and a comprehensive design token system. Supports both web (React) and mobile (React Native) platforms.

## Installation

This package is published to GitHub Packages. To install it, you'll need to configure npm/yarn to authenticate with GitHub.

### Step 1: Create a Personal Access Token (PAT) on GitHub

**Prerequisites:** You must be a developer in the MinneapolisStarTribune GitHub organization.

[GitHub Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

1. Go to https://github.com/settings/profile
2. Click "Developer Settings" in the left navigation
3. Click "Personal Access Tokens" → "Tokens (Classic)"
4. Click "Generate New Token" → "Generate New Token (classic)"
5. Configure your token:
   - Name your token (e.g., "Design System Package Access")
   - Set the expiration to one year from now
   - Check the `read:packages` checkbox
6. Click "Generate Token"
7. **Copy the token immediately** — you will only see it once!
8. Save the token in your `.env.local` file in the repository where you're installing this design system:
   ```
   NPM_AUTH_TOKEN_FOR_SUS=your_token_here
   ```
   This token will be used in Step 2 below.

### Step 2: Configure npm/yarn Authentication

**For yarn:**

Create or edit `.yarnrc.yml` in your project root:

```
injectEnvironmentFiles:
  - .env.local?

npmScopes:
  minneapolisstartribune:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAlwaysAuth: true
    npmAuthToken: "${NPM_AUTH_TOKEN_FOR_SUS}"
```

**Security Note:** Never commit your token to version control! Use environment variables:

### Step 3: Install the Package

```bash
# Using yarn
yarn add @minneapolisstartribune/design-system
```

### Step 4: Install Peer Dependencies

This package requires React, React DOM, React Native (for native usage), and Tamagui core as peer dependencies:

```bash
# Using yarn
yarn add @tamagui/core@^1.100.0 react@^19.0.0 react-dom@^19.0.0 react-native@>=0.73.0
```

## Quick Start

### Web (React)

1. **Install the package** (see [Installation](#installation) above)
2. **Import components from the web entry point**
3. **Wrap your app** with `DesignSystemProvider`
4. **Import and use components**

```tsx
// main.tsx or App.tsx
// Single import includes both typography classes and CSS variables
import '@minneapolisstartribune/design-system/web/startribune-light.css';
import { DesignSystemProvider, Button } from '@minneapolisstartribune/design-system/web';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Hello World" onClick={() => {}} />
    </DesignSystemProvider>
  );
}
```

See [Web Usage Documentation](docs/web.md) for more details.

### Mobile (React Native)

1. **Install the package** (see [Installation](#installation) above)
2. **Import components from the native entry point**
3. **Wrap your app** with `DesignSystemProvider` to enable brand and color scheme support
4. **Use components in your React Native app**

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

See [Mobile Usage Documentation](docs/mobile.md) for more details.

## Available Components

Browse all components interactively in [Storybook](https://design-system-8bmbp4q1g-startribune-team-one.vercel.app).

## TypeScript Support

This package includes full TypeScript type definitions. All components and their props are fully typed.

### Export Pattern

All component exports follow a consistent pattern:

```typescript
export { Component, type ComponentProps } from './path';
```

This means each component is exported alongside its main Props type. For example:

- `Button` and `ButtonProps`
- `NewsHeading` and `NewsHeadingProps`
- `Icon` and `IconProps`

### Importing Types

You can import TypeScript types from the package for use in your own code. All types are exported from the main package entry point.

**Component Prop Types (web):**

```typescript
import type {
  ButtonProps,
  FormGroupProps,
  FormControlProps,
  TextInputProps,
  NewsHeadingProps,
  // ... and many more
} from '@minneapolisstartribune/design-system/web';
```

**Using Components (web):**

You can use components directly without importing types - TypeScript will infer the types automatically:

```typescript
import { Button } from '@minneapolisstartribune/design-system/web';

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
import type { ButtonProps, NewsHeadingProps } from '@minneapolisstartribune/design-system/web';

// Access nested types using indexed access
type ButtonColor = ButtonProps['color']; // 'neutral' | 'brand' | 'brand-accent' | undefined
type ButtonVariant = ButtonProps['variant']; // 'filled' | 'outlined' | 'ghost' | undefined
type NewsHeadingImportance = NewsHeadingProps['importance']; // 1 | 2 | 3 | 4 | 5 | 6
```

**Example: Using Types in Your Code**

```typescript
import { Button } from '@minneapolisstartribune/design-system/web';
import type { ButtonProps, Brand } from '@minneapolisstartribune/design-system/web';

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

## Versioning

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

## Documentation

- **[Web Usage](docs/web.md)** - Complete guide for using the design system in web (React) applications
- **[Mobile Usage](docs/mobile.md)** - Complete guide for using the design system in React Native applications
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

## Still Having Issues?

- Check the [Storybook](https://design-system-8bmbp4q1g-startribune-team-one.vercel.app) for working examples
- Review component source code in the repository
- Open an issue on GitHub with details about your setup and error messages

# design-system

A React component library built with TypeScript and Mantine, with a comprehensive design token system.

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

**Available token categories:**

- `--color-icon-*` - Icon colors (e.g., `--color-icon-on-light-primary`)
- `--color-text-*` - Text colors
- `--color-background-*` - Background colors
- `--color-border-*` - Border colors
- `--color-button-*` - Button-specific colors
- `--color-control-*` - Control component colors
- Full primitive palettes (`--color-emerald-500`, `--color-lime-300`, etc.)

### Using React Components with Mantine

If you're using the design system's React components (Button, Icon, etc.), you need to:

1. **Load the theme CSS file** (see above)
2. **Wrap your app with `DesignSystemProvider`**

```tsx
import { DesignSystemProvider } from '@minneapolisstartribune/design-system';
import { Button } from '@minneapolisstartribune/design-system';
import '@minneapolisstartribune/design-system/dist/themes/startribune-light.css';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Click me" onClick={() => {}} />
    </DesignSystemProvider>
  );
}
```

**Important notes:**

- The `brand` prop must match the CSS file you imported (`'startribune'` or `'varsity'`)
- The `forceColorScheme` prop must match the CSS file (`'light'` or `'dark'`)
- If you want to switch themes dynamically, use the dynamic loading approach shown above
- The CSS file must be loaded **before** components render, or CSS variables will be undefined

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
4. For React apps, check that Mantine components render with correct colors

### Token Categories

- **Global Colors** (`tokens/color/global.json`) - Base color palettes (cobalt-blue, emerald, lime, etc.)
- **Brand Colors** (`tokens/color/brand-{brand}-{scheme}.json`) - Brand-specific colors for each brand and color scheme
- **Semantic Colors** (`tokens/color/semantic.json`) - Purpose-based colors (text-primary, bg-primary, etc.)
- **Typography** (`tokens/text.json`) - Font families and text sizes

### Modifying Tokens

1. Edit JSON files in `/tokens`
2. Run `yarn tokens` to regenerate outputs
3. Generated files go to `/build` (development)
4. Run `yarn build` to include in `/dist` (published package)

## Development

### Linting & Formatting

This project uses ESLint for linting and Prettier for code formatting.

```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Check formatting
yarn format:check
```

**Pre-commit hooks:** Linting and formatting run automatically on staged files before each commit.

### CI/CD Workflows

GitHub Actions automatically run on pull requests:

- **Lint** - Runs ESLint, Prettier checks, and TypeScript type checking
- **Unit Tests** - Runs component tests and uploads coverage to Codecov
- **Accessibility Tests** - Runs a11y tests with axe-core and uploads coverage

Test reports are generated as JUnit XML files:

- Unit tests: `reports/unit-junit.xml`
- A11y tests: `reports/a11y-junit.xml`

These paths are configurable via the `VITEST_JUNIT_OUTPUT` environment variable:

```bash
# Generate a custom report path
VITEST_JUNIT_OUTPUT=./reports/my-test-report.xml yarn test

# Example: Generate separate reports locally
VITEST_JUNIT_OUTPUT=./reports/unit-junit.xml yarn test -- --exclude "**/*.a11y.test.tsx"
VITEST_JUNIT_OUTPUT=./reports/a11y-junit.xml yarn test:a11y
```

### Storybook Deployments

This project uses [Vercel](https://vercel.com) to automatically deploy Storybook:

**Production Deployment** (main branch):

- Located at [design-system-8bmbp4q1g-startribune-team-one.vercel.app](design-system-8bmbp4q1g-startribune-team-one.vercel.app)
- Deploys automatically when code is merged to `main`
- Stable, always-available URL for the latest components
- Share this URL with your team and stakeholders

**Preview Deployments** (pull requests):

- Every PR gets a unique preview URL posted as a comment
- Test changes before merging
- Perfect for designer/stakeholder review
- Auto-updates on every commit

**Version Dropdown**:

- The Storybook header includes a version selector to switch between released versions
- The list is synced from Vercel production deployments (daily at 9am CST, after tag deploys, or manually)
- See [docs/storybook-version-sync.md](docs/storybook-version-sync.md) for details

## Releases

This project uses [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) for versioning and publishing.

### Creating a Release

1. **Merge your PRs to `main`** - All changes you want in the release
2. **Go to GitHub** → Releases → **"Draft a new release"**
3. **Create a new tag** following [semver](https://semver.org/):
   - `v1.0.0` - Major version (breaking changes)
   - `v0.1.0` - Minor version (new features)
   - `v0.0.8` - Patch version (bug fixes)
4. **Write release notes** - Describe what changed
5. **Click "Publish release"**

### What Happens Automatically

When you publish a release, GitHub Actions will:

1. ✅ Extract version from your tag (e.g., `v0.1.0` → `0.1.0`)
2. ✅ Update `package.json` with the new version
3. ✅ Build the package (includes token generation)
4. ✅ Publish to GitHub Packages
5. ✅ Commit the version bump back to `main`

**No local `yarn publish` needed!** Everything happens in CI/CD.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing, along with [React Testing Library](https://testing-library.com/react) for component testing and [axe](https://github.com/dequelabs/axe-core) for accessibility testing.

### Running Tests

```bash
# Run all tests (unit + a11y)
yarn test

# Run a specific test
yarn test path/to/test.test.tsx

# Run tests in watch mode
yarn test:watch

# Run only accessibility tests
yarn test:a11y

# Generate coverage report
yarn test:coverage
```

### Test Organization

Tests are colocated alongside components:

- `*.test.tsx` - Unit tests for component logic and behavior
- `*.a11y.test.tsx` - Accessibility tests using axe-core

Use the `@/test-utils/a11y` helpers for cleaner a11y tests:

```tsx
import { expectNoA11yViolations } from '@/test-utils/a11y';

it('has no a11y violations', async () => {
  await expectNoA11yViolations(<Button label="Test" onClick={() => {}} />);
});
```

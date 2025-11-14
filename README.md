# design-system

A React component library built with TypeScript and Tailwind CSS, with a comprehensive design token system.

## Design Tokens

This design system uses [Style Dictionary](https://amzn.github.io/style-dictionary/) to manage design tokens across multiple brands.

### Available Themes

- **Star Tribune** - `dist/themes/startribune.css`
- **Varsity** - `dist/themes/varsity.css`

### Using Themes

**Import the theme for your brand:**

```css
/* In your main CSS file */
@import '@minneapolisstartribune/design-system/dist/themes/startribune.css';
/* or */
@import '@minneapolisstartribune/design-system/dist/themes/varsity.css';
```

**Use brand tokens in your CSS:**

```css
.my-component {
  background: var(--color-brand-primary); /* Changes per theme! */
  color: var(--color-text-primary);
  border: 1px solid var(--color-brand-secondary);
}
```

**All themes include the same token names:**

- `--color-brand-primary-*` (e.g., `strib-emerald-green`, `sv-black`)
- `--color-brand-secondary-*` (e.g., `core-yellow`, `core-navy`)
- `--color-text-primary`, `--color-bg-primary`, `--color-border-subtle`
- Full primitive palettes (`--color-emerald-500`, `--color-lime-300`, etc.)

### Integration Examples

#### Using with Tailwind CSS v4

Tailwind v4 has native CSS variable support. Just import the theme:

```css
/* app.css */
@import '@minneapolisstartribune/design-system/dist/themes/startribune.css';
@import 'tailwindcss';
```

Use design tokens directly as Tailwind utilities (v4 auto-generates utilities from CSS variables):

```jsx
// All design system tokens are available as utilities!
<div className="bg-brand-primary-strib-emerald-green text-base-white">
  Star Tribune branded content
</div>

<button className="bg-brand-secondary-core-yellow
                   hover:bg-brand-primary-strib-spring-green
                   px-4 py-2 rounded">
  Call to Action
</button>
```

That's it! No config needed. Tailwind v4 automatically creates utilities from all `--color-*` CSS variables.

#### Using with Tailwind CSS v3

For v3, use arbitrary value syntax with CSS variables:

```css
/* app.css */
@import '@minneapolisstartribune/design-system/dist/themes/startribune.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```jsx
// Use CSS variables with arbitrary values
<div className="bg-[var(--color-brand-primary-strib-emerald-green)] text-white">
  Star Tribune branded content
</div>

<button className="bg-[var(--color-brand-secondary-core-yellow)]
                   hover:bg-[var(--color-brand-primary-strib-spring-green)]
                   px-4 py-2 rounded">
  Call to Action
</button>
```

**Or add to your Tailwind config** for shorter class names:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary-strib-emerald-green)',
        'brand-secondary': 'var(--color-brand-secondary-core-yellow)',
        'brand-accent': 'var(--color-brand-primary-strib-spring-green)',
      },
    },
  },
};
```

```jsx
// Now use like regular Tailwind utilities
<div className="bg-brand-primary text-white">Much cleaner!</div>
```

#### Using with Svelte (or any other framework)

Import the theme CSS and use CSS variables directly:

```svelte
<!-- App.svelte -->
<script>
  import '@minneapolisstartribune/design-system/dist/themes/startribune.css';
</script>

<div class="hero">
  <h1>Welcome to Star Tribune</h1>
  <button class="cta-button">Get Started</button>
</div>

<style>
  .hero {
    background: var(--color-brand-primary-strib-emerald-green);
    color: var(--color-base-white);
    padding: 2rem;
  }

  .cta-button {
    background: var(--color-brand-secondary-core-yellow);
    color: var(--color-base-black);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
    cursor: pointer;
  }

  .cta-button:hover {
    background: var(--color-brand-primary-strib-spring-green);
  }
</style>
```

**Switching brands:** Just change the import path:

```javascript
// Star Tribune
import '@minneapolisstartribune/design-system/dist/themes/startribune.css';

// Varsity
import '@minneapolisstartribune/design-system/dist/themes/varsity.css';
```

### Token Categories

- **Primitives** (`tokens/color/primitives.json`) - Base color palettes (cobalt-blue, emerald, lime, etc.)
- **Brand Colors** (`tokens/color/brand.json`) - Star Tribune brand colors
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

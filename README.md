# design-system

A React component library built with TypeScript and Tailwind CSS, with a comprehensive design token system.

## Design Tokens

This design system uses [Style Dictionary](https://amzn.github.io/style-dictionary/) to manage design tokens. Tokens are defined in `/tokens` and automatically generate multiple output formats for different use cases.

### Using Tokens

**In your Tailwind config:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Import Star Tribune brand colors
        'brand-emerald': '#00ac63',
        'brand-spring': '#65cc5c',
      },
    },
  },
};
```

**As CSS variables:**

```css
@import '@minneapolisstartribune/design-system/dist/tokens/variables.css';

.my-component {
  background: var(--color-brand-emerald-green);
  color: var(--color-text-primary);
}
```

**As JavaScript/TypeScript:**

```tsx
import { tokens } from '@minneapolisstartribune/design-system/tokens';

const MyComponent = () => (
  <div style={{ color: tokens.color.brand.emeraldGreen }}>Themed content</div>
);
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

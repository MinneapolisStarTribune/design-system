# Getting Started

### Prerequisites

- **Node.js v22** - This project requires Node.js version 22 (check with `node --version`). Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions: `nvm install 22 && nvm use 22`
- **Yarn package manager** - Version 1.22.22 or compatible (this project uses Yarn Classic, not Yarn Berry)
- **Git** - For version control and workflow commands
- **GitHub account** - With access to the [MinneapolisStarTribune/design-system](https://github.com/MinneapolisStarTribune/design-system) repository

### Initial Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MinneapolisStarTribune/design-system.git
   cd design-system
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up Git workflow helpers:**

   This repo uses a release-based branching workflow with helpful commands. These commands (`setrelease`, `newbranch`, `syncmybranch`, etc.) simplify working with release branches. Set them up by following the instructions in [docs/git-workflow.md](docs/git-workflow.md).

   **Why this matters:** The design system uses a release branch workflow where features are developed on release branches (e.g., `release/v1.0`), not directly on `main`. The workflow helpers make it easy to create branches, sync with releases, and push changes. If you skip this step, you'll need to manually manage branches and may encounter merge conflicts.

4. **Verify your setup:**

   ```bash
   # Run tests to make sure everything works
   yarn test

   # Start Storybook to see components
   yarn storybook
   ```

   If everything works, you should see:
   - Tests pass without errors
   - Storybook opens at `http://localhost:6006` showing all components

## Project Structure

Understanding the project structure helps you navigate the codebase:

```
design-system/
├── src/
│   ├── components/          # React components
│   │   ├── Button/         # Component directories (PascalCase)
│   │   ├── Icon/
│   │   ├── Typography/     # Typography components organized by category
│   │   │   ├── Editorial/  # Editorial headings (News, Enterprise, etc.)
│   │   │   ├── ArticleBody/# Article body text components
│   │   │   └── Utility/    # Utility typography (labels, headings)
│   │   ├── FormGroup/      # Form components
│   │   └── Popover/         # Popover component
│   ├── providers/           # Context providers (DesignSystemProvider)
│   ├── styles/             # Global styles, fonts, theme helpers
│   ├── types/              # TypeScript type definitions
│   ├── test-utils/         # Testing utilities (a11y helpers, render helpers)
│   └── index.ts            # Public API exports
├── tokens/                 # Design token JSON files
│   ├── colors/             # Color tokens by brand
│   ├── fonts/              # Font tokens
│   └── ...
├── build/                  # Generated files (tokens, not committed)
├── dist/                   # Built package (published to npm)
├── scripts/                # Build scripts (tokens, icons, etc.)
├── .storybook/             # Storybook configuration
└── docs/                   # Documentation files
```

**Key Directories:**

- `src/components/` - All React components live here, organized by category
- `tokens/` - Design token source files (JSON)
- `build/` - Generated token files (development, not committed)
- `dist/` - Final built package (what gets published)
- `scripts/` - Build and generation scripts

## Development Workflow

### Typical Development Cycle

1. **Create a feature branch:**

   ```bash
   setrelease                    # Pin the current release branch
   newbranch my-feature-name     # Create branch from release
   ```

2. **Make your changes:**
   - Edit component files in `src/components/`
   - Modify tokens in `tokens/` if needed
   - Add tests in `*.test.tsx` files

3. **Develop with Storybook:**

   ```bash
   yarn storybook                # Start Storybook
   # Make changes, see them hot-reload in Storybook
   ```

4. **Run tests:**

   ```bash
   yarn test:watch              # Run tests in watch mode
   # Or run once:
   yarn test
   ```

5. **When modifying tokens:**

   ```bash
   yarn tokens                  # Regenerate tokens
   yarn storybook               # Restart Storybook to see changes
   ```

6. **Before committing:**

   ```bash
   yarn lint:fix                # Fix linting issues
   yarn format                  # Format code
   yarn test                    # Ensure tests pass
   yarn typecheck               # Verify TypeScript types
   ```

7. **Commit and push:**

   ```bash
   git add .
   git commit -m "feat: add new component"
   gitpushmybranch              # Sync and push to remote
   ```

8. **Create a Pull Request:**
   - PR will trigger CI checks (lint, tests, type checking)
   - Storybook preview will be deployed automatically
   - Get code review and merge when approved

### Follow Code Standards

Refer to [docs/code-standards.md](docs/code-standards.md) for:

- TypeScript patterns (interfaces, types, no `any`)
- React component patterns (factory functions, `displayName`)
- File naming conventions
- Import path aliases (`@/*` instead of relative imports)

### Available Commands

**Development:**

- `yarn dev` - Start development server (if configured)
- `yarn storybook` - Start Storybook development server on port 6006. Automatically builds tokens/icons if needed. Use this for visual component development.
- `yarn build` - Build the package for production. Runs token generation, icon mapping, and Mantine token generation, then builds both web and native bundles to `/dist/web` and `/dist/mobile` respectively.
- `yarn build:web` - Build only the web bundle to `/dist/web`
- `yarn build:native` - Build only the native bundle to `/dist/mobile`
- `yarn test` - Run all tests (unit + accessibility) once
- `yarn test:watch` - Run tests in watch mode (re-runs on file changes)
- `yarn test:coverage` - Run tests with coverage report
- `yarn test:a11y` - Run only accessibility tests
- `yarn lint` - Check code for linting errors
- `yarn lint:fix` - Automatically fix linting errors
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check if code is formatted (used in CI)
- `yarn typecheck` - Run TypeScript type checking without building

**Token & Asset Generation:**

- `yarn tokens` - Generate design tokens from JSON files in `/tokens` to `/build`
- `yarn tokens:mantine` - Generate Mantine-specific token files
- `yarn icons` - Generate icon mapping files from SVG files
- `yarn fonts:fetch` - Attempt to fetch fonts from CDN (optional)

**Git Workflow:**

- `setrelease` - Pin the current release branch (sets which release branch you're working on)
- `whichrelease` - Show which release branch is currently pinned
- `newbranch <name>` - Create a new feature branch from the pinned release branch
- `syncmybranch` - Sync your current branch with the release branch (fetches and merges, no push)
- `gitpushmybranch` - Sync your branch and push to remote

See [docs/git-workflow.md](docs/git-workflow.md) for complete Git workflow documentation.

**Common Command Combinations:**

```bash
# Typical development workflow
yarn storybook          # Start Storybook to see your changes
yarn test:watch         # Run tests in watch mode in another terminal

# Before committing
yarn lint:fix           # Fix linting issues
yarn format             # Format code
yarn test               # Run all tests
yarn typecheck          # Verify TypeScript types

# When adding/modifying tokens
yarn tokens              # Regenerate tokens
yarn storybook          # Restart Storybook to see token changes

# When adding new icons
yarn icons              # Regenerate icon mapping
yarn storybook          # Restart Storybook to see new icons
```

## Design Tokens

This design system uses [Style Dictionary](https://amzn.github.io/style-dictionary/) to manage design tokens across multiple brands. Tokens are defined as JSON files and transformed into CSS variables, TypeScript types, and Mantine theme configurations.

### Token File Structure

Tokens are organized in `/tokens` by category and brand:

```
tokens/
├── colors/
│   ├── startribune.json    # Star Tribune color tokens
│   └── varsity.json        # Varsity color tokens
├── fonts/
│   └── fonts.json          # Font definitions
└── ...
```

### How Tokens Map to CSS Variables

Style Dictionary transforms token JSON into CSS custom properties:

**Token JSON:**

```json
{
  "color": {
    "brand": {
      "primary": {
        "strib": {
          "emerald-green": { "value": "#00A651" }
        }
      }
    }
  }
}
```

**Generated CSS:**

```css
:root {
  --color-brand-primary-strib-emerald-green: #00a651;
}
```

**Usage in code:**

```css
.my-component {
  color: var(--color-brand-primary-strib-emerald-green);
}
```

### Token Naming Conventions

- Use kebab-case for token names
- Organize hierarchically: `category.subcategory.brand.variant`
- Brand-specific tokens include the brand name (e.g., `strib-emerald-green`)
- Shared tokens omit brand names

### Available Themes

Theme files are generated from tokens and organized by brand and color scheme:

- **Star Tribune Light** - `dist/themes/startribune-light.css`
- **Star Tribune Dark** - `dist/themes/startribune-dark.css`
- **Varsity Light** - `dist/themes/varsity-light.css`
- **Varsity Dark** - `dist/themes/varsity-dark.css`

Each theme file contains all CSS variables for that brand/color scheme combination.

### Font Tokens

Font tokens have special requirements:

- **@font-face declaration** uses the single font name (e.g., `'Popular'`, `'Nohemi'`)
- **Usage in CSS** uses the full font stack (e.g., `Popular, sans-serif`)
- **Critical:** The first font name in the stack must match the `@font-face` name, or fonts won't render

**Font file locations:**

- Font files should be placed in `dist/fonts/assets/{brand}/` (e.g., `dist/fonts/assets/startribune/`)
- If font URLs return **403** or are blocked: manually place woff2 files in the appropriate directory, then run `yarn tokens`
- Optional: `yarn fonts:fetch` attempts to fetch fonts from the CDN

See [tokens/fonts/README.md](tokens/fonts/README.md) for complete font token details.

### Modifying Tokens

1. **Edit JSON files** in `/tokens` directory
2. **Run `yarn tokens`** to regenerate token outputs to `/build`
   - This generates CSS files, TypeScript types, and other outputs
   - Files go to `/build` for development use
3. **For Mantine tokens**, also run `yarn tokens:mantine`
   - Generates Mantine-specific theme configuration
4. **Restart Storybook** to see token changes: `yarn storybook`
5. **Run `yarn build`** to include tokens in `/dist` (published package)
   - Only needed before publishing or to verify the full build
6. **Make sure to get a review from UX in Github in your PR!**

**Development workflow:**

```bash
# Edit tokens/tokens/colors/startribune.json
yarn tokens              # Regenerate tokens
yarn storybook          # See changes in Storybook
```

## Storybook Development

Storybook is the primary tool for developing and testing components visually.

### Starting Storybook

```bash
yarn storybook
```

This command:

- Automatically runs `yarn tokens` and `yarn icons` if needed
- Starts the Storybook dev server on `http://localhost:6006`
- Watches for file changes and hot-reloads

### Configurable Story Pattern

Every component story file must have "Configurable" as the first story. This provides an interactive playground for:

- UX designers to experiment with component options
- PMs to see all component variations
- Engineers to understand component API

See [docs/code-standards.md](docs/code-standards.md) for complete Storybook requirements.

### Visual Testing

Use Storybook to:

- Verify component appearance across brands/themes
- Test responsive behavior
- Check accessibility with Storybook's a11y addon
- Share component states with designers/stakeholders

## Development

### Storybook Deployments

This project uses [Vercel](https://vercel.com) to automatically deploy Storybook:

**Production Deployment** (main branch):

- Located at [https://design-system.startribune.com](https://design-system.startribune.com)
- Deploys automatically when code is merged to `main`
- Stable, always-available URL for the latest components
- Share this URL with your team and stakeholders

**Stage Deployment** (latest release branch):

- Located at [https://design-system-env-stage-startribune-team-one.vercel.app/](https://design-system-env-stage-startribune-team-one.vercel.app/)
- Deploys automatically when code is merged to the lowest `release/` branch
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

**Who can create releases:** Anyone with write access to the repository can create releases.

**When to create a release:**

- After merging significant features or bug fixes
- When you want to publish a new version for consuming apps to use
- Follow semantic versioning based on the types of changes

**Steps:**

1. **Merge your PRs to `main`** - Ensure all changes you want in the release are merged
2. **Go to GitHub** → Releases → **"Draft a new release"**
3. **Create a new tag** following [semver](https://semver.org/):
   - `v1.0.0` - Major version (breaking changes that require consuming apps to update)
   - `v0.1.0` - Minor version (new features, backward compatible)
   - `v0.0.8` - Patch version (bug fixes, backward compatible)
4. **Write release notes** - Describe what changed:
   - List new components or features
   - Document breaking changes
   - Note bug fixes
   - Reference relevant PRs or issues
5. **Click "Publish release"**

### What Happens Automatically

When you publish a release, GitHub Actions will:

1. ✅ Extract version from your tag (e.g., `v0.1.0` → `0.1.0`)
2. ✅ Update `package.json` with the new version
3. ✅ Build the package (includes token generation, icon mapping, Mantine tokens)
4. ✅ Publish to GitHub Packages (consuming apps can then install this version)
5. ✅ Commit the version bump back to `main`

**No local `yarn publish` needed!** Everything happens in CI/CD.

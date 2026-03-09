# Getting Started

## Prerequisites

- **Node.js 22** (`nvm install 22 && nvm use 22`)
- **Yarn 4.x** (Berry) — version pinned in root `package.json` `packageManager`
- Access to the [MinneapolisStarTribune/design-system](https://github.com/MinneapolisStarTribune/design-system) GitHub repo

## Initial Setup

```bash
git clone https://github.com/MinneapolisStarTribune/design-system.git
cd design-system
yarn install
yarn tokens        # generates CSS (web) + JS (native) from token JSON
yarn test          # verify everything works
yarn storybook:web     # opens web Storybook at localhost:6006
```

**Git workflow helpers** — this repo uses release branches (`release/*`), not direct work on `main`. Run `./scripts/bootstrap-git-aliases.sh` and follow the printed instructions, or see [git-workflow.md](git-workflow.md) for full details. This gives you `setrelease`, `newbranch`, `syncmybranch`, and `gitpushmybranch`.

**Native (iOS/Android) first-time build** — if you need mobile Storybook, build the dev client once after cloning:

```bash
yarn build:ios      # requires Xcode
yarn build:android  # requires Android Studio
```

Then start development with `yarn storybook:native` (or `:ios` / `:android`). See [native-development.md](native-development.md) and [apps/mobile-storybook/README.md](../apps/mobile-storybook/README.md) for prerequisites and full walkthrough.

## Project Structure

```
design-system/                          # Repo root (Yarn workspaces + Turbo)
├── docs/                               # Internal developer docs (you are here)
├── integration-guides/                 # Guides for consuming-app developers
├── apps/
│   └── mobile-storybook/               # Expo dev-client app for native Storybook
├── packages/
│   └── design-system/                  # The library
│       ├── src/
│       │   ├── components/             # React components (PascalCase dirs)
│       │   ├── providers/              # DesignSystemProvider, AnalyticsProvider
│       │   ├── styles/                 # Global styles, fonts, theme helpers
│       │   ├── types/                  # Shared TypeScript types
│       │   ├── test-utils/             # Test wrappers and mocks
│       │   └── index.ts                # Public API
│       ├── tokens/                     # Design token JSON source files
│       ├── architecture/               # Architecture decision docs
│       ├── scripts/                    # Build scripts (tokens, icons, git helpers)
│       ├── .storybook/                 # Storybook configuration
│       ├── build/                      # Generated token output (not committed)
│       └── dist/                       # Published package output
└── turbo.json
```

## Development Workflow

```bash
setrelease                    # Pin the active release branch (one-time)
newbranch my-feature-name     # Branch from pinned release
yarn storybook                # Develop with hot-reload
yarn test:watch               # Tests in watch mode (separate terminal)
```

When you're done, commit as usual. [Lefthook](https://github.com/evilmartians/lefthook) runs Prettier, ESLint, typecheck, and related Vitest tests on staged files automatically — if anything fails, the commit is blocked.

```bash
gitpushmybranch               # Rebase onto release + push
```

Open a PR. CI runs lint, tests, typecheck, and deploys a Storybook preview automatically.

**Token changes:** Run `yarn tokens` then restart Storybook.

See [code-standards.md](code-standards.md) for TypeScript, component, and naming conventions.

### Available Commands

| Command | What it does |
|---------|-------------|
| `yarn storybook:web` | Web Storybook on `:6006` (auto-builds tokens/icons) |
| `yarn storybook:ios` | IOS Storybook |
| `yarn build` | Production build → `/dist/web` + `/dist/mobile` |
| `yarn build:web` | Web bundle only |
| `yarn build:native` | Native bundle only |
| `yarn test` | Unit + a11y tests (once) |
| `yarn test:watch` | Tests in watch mode |
| `yarn test:a11y` | Accessibility tests only |
| `yarn lint:fix` | Auto-fix ESLint errors |
| `yarn format` | Prettier |
| `yarn typecheck` | TypeScript check (no emit) |
| `yarn tokens` | Regenerate tokens from JSON |
| `yarn icons` | Regenerate icon mappings from SVGs |

Git workflow helpers (after [setup](git-workflow.md)):

| Command | What it does |
|---------|-------------|
| `setrelease` | Pin current branch as your release target |
| `whichrelease` | Show pinned release branch |
| `newbranch <name>` | Branch from pinned release |
| `syncmybranch` | Rebase onto release (no push) |
| `gitpushmybranch` | Rebase + push |

## TypeScript Configuration

Three `tsconfig` files, each with a specific scope:

- **`tsconfig.json`** — library source (`src/`)
- **`.storybook/.tsconfig.json`** — extends root, adds Storybook types
- **`src/tsconfig.json`** — `*.stories.tsx` files only (keeps stories out of the main build while giving IDEs correct types)

## Design Tokens

Tokens are JSON files in `tokens/` (organized by category and brand) transformed by [Style Dictionary](https://amzn.github.io/style-dictionary/) into CSS custom properties (web) and JS modules (native).

### Modifying Tokens

```bash
# 1. Edit JSON in tokens/
# 2. Regenerate
yarn tokens
# 3. Verify in Storybook
yarn storybook
```

Get UX review on token PRs.

### Font Tokens

- `@font-face` name must match the first entry in the font stack
- Font files live in `dist/fonts/assets/{brand}/`
- If CDN URLs 403: place `.woff2` files manually, then `yarn tokens`
- See `tokens/fonts/README.md` for details

## Storybook

```bash
yarn storybook   # localhost:6006, auto-builds tokens/icons, hot-reloads
```

Every story file has exactly two stories: **"Configurable"** (interactive controls) and **"AllVariants"** (Chromatic regression). See [code-standards.md](code-standards.md).

### Deployments (Vercel)

| Environment | URL | Trigger |
|-------------|-----|---------|
| Production | [design-system.startribune.com](https://design-system.startribune.com) | Merge to `main` |
| Stage | [stage](https://design-system-env-stage-startribune-team-one.vercel.app/) | Merge to lowest `release/*` |
| Preview | Unique URL per PR (posted as comment) | Every PR push |

## Releases

Published via [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository). Anyone with write access can create one.

1. Merge PRs to `main`
2. GitHub → Releases → "Draft a new release"
3. Create a semver tag (`v0.1.0`, `v0.0.8`, etc.)
4. Write release notes (new features, breaking changes, fixes)
5. Publish

CI automatically extracts the version, updates `package.json`, builds, publishes to GitHub Packages, and commits the version bump back to `main`. No local `yarn publish` needed.

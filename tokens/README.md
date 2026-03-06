# Design Tokens

This directory contains all design tokens for the design system, organized by type and brand specificity.

## Token Structure

The token system is organized to clearly separate **global primitives** from **brand-specific tokens**:

```
tokens/
├── primitives/          # Global, brand-agnostic tokens (used by all brands)
├── color/               # Brand-specific and mode-specific color tokens
├── semantic/            # Brand-specific semantic styling tokens
├── fonts/               # Brand-specific font definitions
└── typography/          # Brand-specific typography tokens
```

## Primitives (`primitives/`)

**Global, brand-agnostic tokens** that are shared across all brands and modes. These are the foundational design system values.

### Files

- `color.json` - Global color palettes (neutral, red, blue, green, yellow, etc.) - brand-agnostic color primitives
- `spacing.json` - Spacing scale (0px, 2px, 4px, etc.)
- `border-radius.json` - Border radius values (2px, 4px, 8px, full, none, etc.)
- `breakpoint.json` - Responsive breakpoint definitions (small, medium, large)
- `text.json` - Font family definitions and text sizing

### Usage

Primitive tokens can be referenced in other token files:

```json
{
  "semantic": {
    "photo-layout-border-radius": {
      "description": "References the primitive radius.4 token",
      "value": "{radius.4}"
    }
  }
}
```

In CSS, they're available as CSS variables:

```scss
.my-component {
  padding: var(--spacing-16);
  border-radius: var(--radius-12);
  color: var(--color-neutral-500);
}
```

## Color Tokens (`color/`)

**Brand-specific and mode-specific color tokens** that define how colors are used in components.

### Files

- `button-{mode}.json` - Mode-specific button color tokens (light/dark)
- `brand-{brand}-{mode}.json` - Brand-specific color tokens for each brand and mode
  - `brand-startribune-light.json`
  - `brand-startribune-dark.json`
  - `brand-varsity-light.json`
  - `brand-varsity-dark.json`

### Usage

Color tokens reference primitive color palettes and define semantic color usage:

```json
{
  "color": {
    "background": {
      "brand": {
        "value": "{color.emerald-green.600}"
      }
    }
  }
}
```

## Semantic Tokens (`semantic/`)

**Brand-specific semantic tokens** for styling decisions that differ between brands but aren't about color or fonts.

### Purpose

Semantic tokens provide a way to define brand-specific styling choices that translate design system primitives (like border radius, spacing, etc.) into component-specific values based on brand identity.

### Examples

- **Photo Layout Border Radius**: Star Tribune uses pointy corners (`radius.none`), Varsity uses rounded corners (`radius.12`)
- **Card Border Radius**: Different brands might prefer different corner styles
- **Component Spacing**: Brand-specific spacing preferences for certain components

### File Structure

Each brand has its own semantic token file:

- `startribune.json` - Star Tribune semantic tokens
- `varsity.json` - Varsity semantic tokens

### Token Format

Semantic tokens reference primitive tokens and provide brand-specific overrides:

```json
{
  "semantic": {
    "photo-layout-border-radius": {
      "description": "Border radius for photo layout components - Star Tribune uses pointy corners",
      "value": "{radius.none}"
    }
  }
}
```

### Usage in Components

Semantic tokens are automatically included in the generated CSS variables:

```scss
.photoLayout {
  border-radius: var(--semantic-photo-layout-border-radius);
}
```

The ThemeProvider will automatically apply the correct brand-specific value based on the active brand.

### Adding New Semantic Tokens

1. Add the token to the appropriate brand file(s) in `tokens/semantic/`
2. Reference primitive tokens using the `{token.path}` syntax
3. Run `yarn tokens` to regenerate CSS variables
4. Use the token in your component styles as `var(--semantic-{token-name})`

### Token Naming Convention

- Use kebab-case for token names
- Prefix with the component or feature name (e.g., `photo-layout-`, `card-`, `modal-`)
- Be descriptive about what the token controls

## Font Tokens (`fonts/`)

**Brand-specific font definitions** that define which fonts are available for each brand.

### Files

- `startribune.json` - Star Tribune font definitions
- `varsity.json` - Varsity font definitions

### Font-Family Matching

For any font to render, the **@font-face name** and the **first token of the font-family in CSS** must match.

- **@font-face** uses the single name (e.g. `'Popular'`, `'Nohemi'`, `'Graphik'`) — the build derives this from `tokens/primitives/text.json` so it matches usage.
- **Usage** (utility/editorial CSS) uses the full stack (e.g. `Popular, sans-serif`). The browser matches the first token to the @font-face name.
- In each font entry, keep `name` and the first token of `family` in sync.

**Example (Popular):**

| Where            | Value                               |
| ---------------- | ----------------------------------- |
| Token `name`     | `"Popular"`                         |
| Token `family`   | `"Popular, sans-serif"`             |
| Built @font-face | `font-family: 'Popular';`           |
| Usage in CSS     | `font-family: Popular, sans-serif;` |

The first token of the stack (`Popular`) matches the @font-face name → font renders.

### If Fonts Don't Load (403 / CORS)

The built CSS points at `https://fonts.startribune.com/...` for woff2 files. If those URLs return **403** or are blocked (e.g. CORS), use local files:

1. Put woff2 files in **`dist/fonts/assets/{brand}/`** (same filenames as in the tokens).
2. Run **`yarn tokens`** so the font-face build uses local URLs for any file that exists there.
3. Optional: **`yarn fonts:fetch`** tries to fetch from the CDN; if you get 403 for some paths, add those files manually (e.g. from design team).

## Typography Tokens (`typography/`)

**Brand-specific typography tokens** that define typography styles for editorial and utility text.

### Structure

- `editorial/` - Editorial typography (headings, body text for articles)
  - `index.json` - Base editorial typography
  - `startribune.json` - Star Tribune editorial overrides
  - `varsity.json` - Varsity editorial overrides
- `utility/` - Utility typography (labels, small text, UI elements)
  - `index.json` - Base utility typography
  - `shared.json` - Shared utility typography
  - `startribune.json` - Star Tribune utility overrides
  - `varsity.json` - Varsity utility overrides

## Building Tokens

Run `yarn tokens` to build all tokens from these source files. This generates:

- CSS variables for web (`dist/web/themes/{brand}-{mode}.css`)
- JavaScript tokens for mobile (`dist/mobile/themes/{brand}-{mode}.js`)
- TypeScript theme files for Tamagui (`src/generated/themes/{brand}.{mode}.ts`)

## Token Loading Order

The build system loads tokens in this order:

1. Primitives (color, spacing, border-radius, breakpoint, text)
2. Mode-specific button tokens (`button-{mode}.json`)
3. Brand-specific color tokens (`brand-{brand}-{mode}.json`)
4. Brand-specific semantic tokens (`semantic/{brand}.json`)
5. Typography tokens (editorial and utility)

Later files can reference earlier files using the `{token.path}` syntax.

# Semantic Brand-Specific Tokens

This directory contains brand-specific semantic tokens for styling decisions that differ between brands but aren't about color or fonts.

## Purpose

Semantic tokens provide a way to define brand-specific styling choices that translate design system primitives (like border radius, spacing, etc.) into component-specific values based on brand identity.

## Examples

- **Photo Layout Border Radius**: Star Tribune uses pointy corners (`radius.none`), Varsity uses rounded corners (`radius.12`)
- **Card Border Radius**: Different brands might prefer different corner styles
- **Component Spacing**: Brand-specific spacing preferences for certain components

## File Structure

Each brand has its own semantic token file:

- `startribune.json` - Star Tribune semantic tokens
- `varsity.json` - Varsity semantic tokens

## Token Format

Semantic tokens reference shared tokens and provide brand-specific overrides:

```json
{
  "semantic": {
    "photo-layout-border-radius": {
      "description": "Border radius for photo layout components - Star Tribune uses pointy corners",
      "value": "{radius.4}"
    }
  }
}
```

## Usage in Components

Semantic tokens are automatically included in the generated CSS variables and can be used in component styles:

```scss
.photoLayout {
  border-radius: var(--semantic-photo-layout-border-radius);
}
```

The ThemeProvider will automatically apply the correct brand-specific value based on the active brand.

## Adding New Semantic Tokens

1. Add the token to the appropriate brand file(s) in this directory
2. Reference shared tokens using the `{token.path}` syntax
3. Run `yarn tokens` to regenerate CSS variables
4. Use the token in your component styles as `var(--semantic-{token-name})`

## Token Naming Convention

- Use kebab-case for token names
- Prefix with the component or feature name (e.g., `photo-layout-`, `card-`, `modal-`)
- Be descriptive about what the token controls

# Semantic Tokens

This folder contains **component-level semantic tokens** — per-brand design decisions expressed in terms of primitive tokens.

## Purpose

Semantic tokens bridge the gap between raw design primitives (`radius.*`, `spacing.*`, `color.*`) and specific component styling. They allow component CSS to reference a single, intention-named variable instead of brand-conditional selector logic:

```scss
/* ❌ Don't do this */
.my-component[data-brand='brand-a'] {
  border-radius: 4px;
}
.my-component[data-brand='brand-b'] {
  border-radius: 16px;
}
```

```scss
/* ✅ Do this */
.my-component {
  border-radius: var(--my-component-border-radius);
}
```

## File Structure

Each brand has its own file:

- `startribune.json` — Star Tribune semantic token values
- `varsity.json` — Varsity semantic token values

Both files must define the **same set of token keys**. Adding a token in one brand file requires adding it in the other.

## Naming Convention

Token keys are scoped by component name to avoid collisions:

```
{component-name}.{property}
```

Examples:

- `my-component.border-radius`
- `my-component.spacing-inline`

These become CSS variables like `--my-component-border-radius` and `--my-component-spacing-inline`.

## How They Work

These files are loaded by Style Dictionary as part of the per-brand build in `scripts/builders/get-style-dictionary-config.js`. Token references like `{radius.16}` resolve to actual values from the primitive token files, so the output CSS contains fully resolved values — no runtime variable chaining required.

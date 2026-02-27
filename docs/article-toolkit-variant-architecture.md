# Article Toolkit: Variant & Brand Architecture

Guidance based on **code standards** (`docs/code-standards.md`) for when to use one file vs two files, and how to handle multiple brands.

---

## 1. One File vs Two Files: Decision Rule

### Use **one file** when:

- **Same DOM structure** – Standard and immersive render the same elements (e.g. figure, images, caption)
- **Same props** – Both variants accept the same props; only styling/layout differs
- **Variant = CSS difference** – Constrained vs full-bleed, padding, max-width, border-radius

**Pattern:** Single component with `variant?: 'standard' | 'immersive'` prop.

**Code standards alignment:**

- File naming: `ComponentName.tsx` (one file per component)
- Existing examples: `Button` (filled/outlined/ghost), `FormGroup.Caption` (info/error/success)

### Use **two files** when:

- **Different DOM structure** – Variants render different elements or composition
- **Different props** – One variant needs props the other does not
- **Different behavior** – Logic or interactions differ significantly, not just styling

**Pattern:** `ComponentNameStandard.tsx` and `ComponentNameImmersive.tsx` (or similar), only when the above applies.

---

## 2. Article Toolkit: One File Per Component

For Article Toolkit components (PhotoLayout, PullQuote, ImageGallery, InlineVideo, CodeBlock, SocialEmbeds):

| Component    | One file? | Reason                                                             |
| ------------ | --------- | ------------------------------------------------------------------ |
| PhotoLayout  | Yes       | Same DOM (figure, grid, images, caption); variant = layout/padding |
| PullQuote    | Yes       | Same DOM (blockquote); variant = width/constraint                  |
| ImageGallery | Yes       | Same DOM (gallery); variant = full-bleed vs constrained            |
| InlineVideo  | Yes       | Same DOM (video player); variant = layout                          |
| CodeBlock    | Yes       | Same DOM (pre/code); variant = width/overflow                      |
| SocialEmbeds | Yes       | Same DOM; may not need variant (parent controls layout)            |

**Conclusion:** All Article Toolkit components should be **one file** with a `variant` prop. Standard vs immersive is a layout/styling concern, not a different component.

---

## 3. Handling Multiple Brands (Startribune, Varsity)

### Brand vs variant

| Concern     | Handled by           | Where set |
| ----------- | -------------------- | --------- |
| **Brand**   | DesignSystemProvider | App root  |
| **Variant** | Component prop       | Per usage |

Brand and variant are independent. Brand = which design system (colors, fonts, tokens). Variant = article layout context (standard vs immersive).

### Brand theming

1. **App root:** Wrap the app with `DesignSystemProvider brand="startribune" | "varsity"`.
2. **Theme:** Provider injects brand-specific Mantine theme (colors, typography).
3. **`data-brand`:** Provider renders `<div data-brand={brand}>` for CSS selectors.
4. **Tokens:** Components use theme tokens (e.g. `var(--color-brand-01)`) that vary by brand.

### Brand-specific layout (when needed)

If a brand needs different layout (e.g. padding, corner radius):

```scss
// Component.module.scss
.container {
  padding: var(--article-padding, 16px);
  border-radius: var(--article-radius, 8px);
}

// Brand overrides via data-brand (in theme or component CSS)
[data-brand='startribune'] .container {
  --article-radius: 0; /* sharp edges */
  --article-padding: 0; /* full-bleed mobile */
}

[data-brand='varsity'] .container {
  --article-radius: 8px; /* rounded */
  --article-padding: 16px; /* padded mobile */
}
```

Or define brand-specific tokens in theme build and reference them in components.

### No brand prop on components

Components do **not** take a `brand` prop. Brand comes from context (`DesignSystemProvider`). This keeps the API simple and avoids prop drilling.

---

## 4. Summary

| | |
| ** One file per component. Use two only when DOM, props, or behavior differ. |
| **Article Toolkit components?** | All one file with `variant` prop. |  
| ** `DesignSystemProvider` at app root; theme + `data-brand` for styling. |
| ** CSS with `[data-brand="…"]` or brand-specific design tokens. |
| **`variant?: 'standard' \| 'immersive'` from `ArticleToolkitBaseProps`; no `brand` prop. |

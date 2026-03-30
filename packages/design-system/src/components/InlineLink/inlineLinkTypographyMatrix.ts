/**
 * Reference for product + brand teams: how Figma “inline link in typography” maps to **parent**
 * components. **`InlineLink` has no `size` prop** — it always inherits from whatever wraps it.
 *
 * Use this file for discovery and copy-paste; nothing here is imported by **`InlineLink`** at runtime.
 */

/** Use in Storybook so `:visited` rarely triggers during review */
export const INLINE_LINK_STORYBOOK_PREVIEW_HREF =
  'https://example.org/design-system-inline-link-preview';

/**
 * How consuming apps / brands pick typography for copy that includes **`InlineLink`**:
 *
 * 1. **Choose the Figma text style** (e.g. `editorial/text/regular/md` or `utility/text/medium/small`).
 * 2. **Map it to the DS parent** using the table in **`INLINE_LINK_TYPOGRAPHY_FAMILIES`** / Storybook **All variants** (same `size` / `weight` props as standalone typography).
 * 3. **Wrap the sentence** in that component and put **`InlineLink`** around the link phrase only; pass **`brand="startribune"`** or **`"varsity"`** so **`color.link`** matches the product (must align with loaded theme CSS).
 * 4. **Do not** put font size/weight on **`InlineLink`** — it only sets link color (`brand`) and anchor behavior.
 */
export const HOW_BRANDS_CHOOSE_INLINE_PARENT_TYPOGRAPHY = `How brands pick typography with InlineLink:
1. Match Figma style name to a Typography component + props (see INLINE_LINK_TYPOGRAPHY_FAMILIES).
2. Wrap running text in that component; nest InlineLink for the hyperlink only.
3. Pass brand="startribune" | "varsity" on InlineLink; load matching theme CSS in the app.
4. InlineLink never receives size/weight — inheritance only.`;

/** Figma shorthand (xxs…xl) → `EditorialText` / `EditorialSponsoredText` `size` prop */
export const FIGMA_EDITORIAL_SIZE_TO_DS = {
  xxs: 'xx-small',
  xs: 'x-small',
  sm: 'small',
  md: 'medium',
  lg: 'large',
  xl: 'x-large',
} as const;

export type FigmaEditorialSizeToken = keyof typeof FIGMA_EDITORIAL_SIZE_TO_DS;

/** Figma shorthand → `UtilityBody` `size` prop (same six steps) */
export const FIGMA_UTILITY_SIZE_TO_DS = FIGMA_EDITORIAL_SIZE_TO_DS;

/**
 * One row per **typography family** that can wrap `InlineLink`. Variants = sizes or weights to
 * combine with that parent; see each component’s props in code.
 */
export const INLINE_LINK_TYPOGRAPHY_FAMILIES = [
  {
    id: 'editorial-text-regular',
    figmaTokenPrefix: 'editorial/text/regular',
    figmaSizes: 'xxs, xs, sm, md, lg, xl',
    parentComponent: 'EditorialText',
    parentPropsSummary: 'weight="regular" size="<DS size>" (see FIGMA_EDITORIAL_SIZE_TO_DS)',
  },
  {
    id: 'editorial-article-body',
    figmaTokenPrefix: 'editorial/article/body',
    figmaSizes: 'regular, italic, bold, bold-italic',
    parentComponent: 'ArticleBodyText',
    parentPropsSummary: 'weight="regular" | "italic" | "bold" | "bold-italic"',
  },
  {
    id: 'editorial-text-sponsored-regular',
    figmaTokenPrefix: 'editorial/text/sponsored/regular',
    figmaSizes: 'xxs–xl (same six as editorial regular)',
    parentComponent: 'EditorialSponsoredText',
    parentPropsSummary: 'weight="regular" size="<DS size>"',
  },
  {
    id: 'editorial-article-body-sponsored',
    figmaTokenPrefix: 'editorial/article/body/sponsored',
    figmaSizes: 'regular, italic, bold / bold-italic (see DS)',
    parentComponent: 'ArticleBodySponsoredText',
    parentPropsSummary:
      'weight="regular" | "italic" | "semibold" | "semibold-italic" (DS uses semibold where Figma may say bold)',
  },
  {
    id: 'utility-text-regular',
    figmaTokenPrefix: 'utility/text/regular',
    figmaSizes: 'xx-small–x-large',
    parentComponent: 'UtilityBody',
    parentPropsSummary: 'weight="regular" size="<DS size>"',
  },
  {
    id: 'utility-text-medium',
    figmaTokenPrefix: 'utility/text/medium',
    figmaSizes: 'xx-small–x-large',
    parentComponent: 'UtilityBody',
    parentPropsSummary: 'weight="medium" size="<DS size>"',
  },
  {
    id: 'utility-text-semibold',
    figmaTokenPrefix: 'utility/text/semibold',
    figmaSizes: 'xx-small–x-large',
    parentComponent: 'UtilityBody',
    parentPropsSummary: 'weight="semibold" size="<DS size>"',
  },
] as const;

export type InlineLinkTypographyFamilyId = (typeof INLINE_LINK_TYPOGRAPHY_FAMILIES)[number]['id'];

/** Article body copy weights that support inline links (exclude dropcap). */
export const ARTICLE_BODY_TEXT_WEIGHTS_FOR_INLINE = [
  'regular',
  'italic',
  'bold',
  'bold-italic',
] as const;

/** Utility “text” families for links: regular / medium / semibold × six sizes */
export const UTILITY_BODY_WEIGHTS_FOR_INLINE = ['regular', 'medium', 'semibold'] as const;

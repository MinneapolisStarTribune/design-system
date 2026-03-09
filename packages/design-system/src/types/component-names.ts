/**
 * List of all component names in the design system.
 *
 * All component names must be reflected here.
 * @remarks Used for brand validation and enforcement.
 */
// @eslint-sort-array
export const COMPONENT_NAMES = [
  'ArticleBodyHeading',
  'ArticleBodySponsoredHeading',
  'ArticleBodySponsoredText',
  'ArticleBodyText',
  'ArticleQuote',
  'CodeBlock',
  'EditorialSponsoredText',
  'EditorialText',
  'EnterpriseHeading',
  'FormControl',
  'FormGroup',
  'ImageGallery',
  'InlineVideo',
  'NewsHeading',
  'NonNewsHeading',
  'OpinionHeading',
  'PhotoLayout',
  'PullQuote',
  'SocialEmbeds',
  'SponsoredHeading',
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

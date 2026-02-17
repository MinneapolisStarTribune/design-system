/**
 * Editorial heading factory and shared types.
 * Use createEditorialHeading to define new heading variants (NewsHeading, etc.).
 */
export { createEditorialHeading } from './createEditorialHeading';
export type {
  CreateEditorialHeadingOptions,
  EditorialHeadingImportance,
  EditorialHeadingProps,
} from './types';

export { EditorialText, type EditorialTextProps } from './EditorialText/EditorialText';
export {
  EditorialSponsoredText,
  type EditorialSponsoredTextProps,
} from './EditorialSponsoredText/EditorialSponsoredText';

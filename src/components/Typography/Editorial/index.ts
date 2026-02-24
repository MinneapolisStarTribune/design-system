/**
 * Editorial heading factory and shared types.
 * Use createEditorialHeading to define new heading variants (NewsHeading, etc.).
 */
export { createEditorialHeading } from './createEditorialHeading';
export type * from './types';

export { EnterpriseHeading } from './EnterpriseHeading/EnterpriseHeading';
export type {
  EnterpriseHeadingImportance,
  EnterpriseHeadingProps,
} from './EnterpriseHeading/EnterpriseHeading';

export { EditorialText, type EditorialTextProps } from './EditorialText/EditorialText';

export {
  EditorialSponsoredText,
  type EditorialSponsoredTextProps,
} from './EditorialSponsoredText/EditorialSponsoredText';

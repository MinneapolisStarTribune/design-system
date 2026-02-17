/**
 * Editorial heading factory and shared types.
 * Use createEditorialHeading to define new heading variants (NewsHeading, etc.).
 */
export { createEditorialHeading } from './createEditorialHeading';
export { EnterpriseHeading } from './EnterpriseHeading/EnterpriseHeading';
export type {
  CreateEditorialHeadingOptions,
  EditorialHeadingImportance,
  EditorialHeadingProps,
} from './types';
export type {
  EnterpriseHeadingImportance,
  EnterpriseHeadingProps,
} from './EnterpriseHeading/EnterpriseHeading';

import { createEditorialHeading } from '../EditorialHeading/createEditorialHeading';

export const SponsoredHeading = createEditorialHeading({
  componentName: 'SponsoredHeading',
  classNamePrefix: 'sponsored',
});

export type { EditorialHeadingImportance as SponsoredHeadingImportance } from '../EditorialHeading/createEditorialHeading';
export type { EditorialHeadingProps as SponsoredHeadingProps } from '../EditorialHeading/createEditorialHeading';

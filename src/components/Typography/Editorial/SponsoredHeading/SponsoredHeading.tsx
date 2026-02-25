import { createEditorialHeading } from '..';

export const SponsoredHeading = createEditorialHeading({
  componentName: 'SponsoredHeading',
  classNamePrefix: 'sponsored',
});

// Export types for consumers
export type { EditorialHeadingImportance as SponsoredHeadingImportance } from '..';

export type { EditorialHeadingProps as SponsoredHeadingProps } from '..';

import { createEditorialHeading } from '../EditorialHeading/createEditorialHeading';

export const NonNewsHeading = createEditorialHeading({
  componentName: 'NonNewsHeading',
  classNamePrefix: 'non-news',
});

export type { EditorialHeadingImportance as NonNewsHeadingImportance } from '../EditorialHeading/createEditorialHeading';
export type { EditorialHeadingProps as NonNewsHeadingProps } from '../EditorialHeading/createEditorialHeading';

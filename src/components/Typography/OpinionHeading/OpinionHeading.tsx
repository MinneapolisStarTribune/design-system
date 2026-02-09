import { createEditorialHeading } from '../EditorialHeading/createEditorialHeading';

export const OpinionHeading = createEditorialHeading({
  componentName: 'OpinionHeading',
  classNamePrefix: 'opinion',
});

export type { EditorialHeadingImportance as OpinionHeadingImportance } from '../EditorialHeading/createEditorialHeading';
export type { EditorialHeadingProps as OpinionHeadingProps } from '../EditorialHeading/createEditorialHeading';

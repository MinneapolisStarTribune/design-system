import { createEditorialHeading } from '../EditorialHeading/createEditorialHeading';

export const NewsHeading = createEditorialHeading({
  componentName: 'NewsHeading',
  classNamePrefix: 'news',
});

export type { EditorialHeadingImportance as NewsHeadingImportance } from '../EditorialHeading/createEditorialHeading';
export type { EditorialHeadingProps as NewsHeadingProps } from '../EditorialHeading/createEditorialHeading';

import { createEditorialHeading } from '../editorial';

export const NewsHeading = createEditorialHeading({
  componentName: 'NewsHeading',
  classNamePrefix: 'news',
});

export type { EditorialHeadingImportance as NewsHeadingImportance } from '../editorial';
export type { EditorialHeadingProps as NewsHeadingProps } from '../editorial';

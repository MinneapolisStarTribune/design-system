import { createEditorialHeading } from '..';

export const NewsHeading = createEditorialHeading({
  componentName: 'NewsHeading',
  classNamePrefix: 'editorial-news',
});

export type { EditorialHeadingImportance as NewsHeadingImportance } from '..';
export type { EditorialHeadingProps as NewsHeadingProps } from '..';

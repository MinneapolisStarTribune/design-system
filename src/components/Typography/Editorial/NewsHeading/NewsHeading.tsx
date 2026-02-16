import { createEditorialHeading } from '../createEditorialHeading';

export const NewsHeading = createEditorialHeading({
  componentName: 'NewsHeading',
  classNamePrefix: 'news',
});

export type {
  EditorialHeadingImportance as NewsHeadingImportance,
  EditorialHeadingProps as NewsHeadingProps,
} from '../types';

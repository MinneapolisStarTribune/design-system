import { createEditorialHeading } from '../createEditorialHeading';

export const NonNewsHeading = createEditorialHeading({
  componentName: 'NonNewsHeading',
  classNamePrefix: 'editorial-non-news',
});

export type {
  EditorialHeadingImportance as NonNewsHeadingImportance,
  EditorialHeadingProps as NonNewsHeadingProps,
} from '../types';

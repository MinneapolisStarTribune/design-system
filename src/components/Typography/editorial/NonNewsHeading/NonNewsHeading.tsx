import { createEditorialHeading } from '../createEditorialHeading';

export const NonNewsHeading = createEditorialHeading({
  componentName: 'NonNewsHeading',
  classNamePrefix: 'non-news',
});

export type {
  EditorialHeadingImportance as NonNewsHeadingImportance,
  EditorialHeadingProps as NonNewsHeadingProps,
} from '../index';

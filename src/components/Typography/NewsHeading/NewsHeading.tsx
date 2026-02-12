import { createEditorialHeading } from '@/components/Typography/Editorial';

export const NewsHeading = createEditorialHeading({
  componentName: 'NewsHeading',
  classNamePrefix: 'news',
});

export type { EditorialHeadingImportance as NewsHeadingImportance } from '../Editorial';
export type { EditorialHeadingProps as NewsHeadingProps } from '../Editorial';

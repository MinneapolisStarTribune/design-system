import { createEditorialHeading } from '@/components/Typography/Editorial';

export const ArticleBodyHeading = createEditorialHeading({
  componentName: 'ArticleBodyHeading',
  classNamePrefix: 'article-body',
});

export type { EditorialHeadingImportance as ArticleBodyHeadingImportance } from '@/components/Typography/Editorial';
export type { EditorialHeadingProps as ArticleBodyHeadingProps } from '@/components/Typography/Editorial';

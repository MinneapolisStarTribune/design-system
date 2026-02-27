import { createArticleBodyHeading } from '../createArticleBodyHeading';

export const ArticleBodySponsoredHeading = createArticleBodyHeading({
  componentName: 'ArticleBodySponsoredHeading',
  classNamePrefix: 'sponsored',
});

export type { EditorialHeadingImportance as ArticleBodySponsoredHeadingImportance } from '../../Editorial';
export type { EditorialHeadingProps as ArticleBodySponsoredHeadingProps } from '../../Editorial';

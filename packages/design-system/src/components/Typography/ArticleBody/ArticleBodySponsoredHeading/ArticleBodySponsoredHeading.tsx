import { createArticleBodyHeading } from '../createArticleBodyHeading';

export const ArticleBodySponsoredHeading = createArticleBodyHeading({
  componentName: 'ArticleBodySponsoredHeading',
  classNamePrefix: 'sponsored',
});

export type {
  EditorialHeadingImportance as ArticleBodySponsoredHeadingImportance,
  EditorialHeadingProps as ArticleBodySponsoredHeadingProps,
} from '@/components/Typography/Editorial';

import type { LinkInlineProps } from '@/components/Link/Link.types';

export type InlineLinkProps = Omit<LinkInlineProps, 'variant'>;

export type { InlineLinkBrand } from '@/components/Link/Link.types';
export { INLINE_LINK_BRANDS } from '@/components/Link/Link.types';

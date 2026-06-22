import { DEFAULT_PURCHASE_LINK_LABEL } from '@/components/Caption/Caption.constants';
import type { CtaLinkProps } from '@/types';

export type ResolvedPurchaseLink = {
  label: string;
  link: string;
};

export const hasPurchaseLink = (purchaseLink?: CtaLinkProps): boolean => {
  return Boolean(purchaseLink?.link?.trim());
};

export const resolvePurchaseLink = (
  purchaseLink?: CtaLinkProps
): ResolvedPurchaseLink | undefined => {
  const link = purchaseLink?.link?.trim();
  const label = purchaseLink?.label?.trim() || DEFAULT_PURCHASE_LINK_LABEL;

  if (!link) {
    return undefined;
  }

  return {
    label,
    link,
  };
};

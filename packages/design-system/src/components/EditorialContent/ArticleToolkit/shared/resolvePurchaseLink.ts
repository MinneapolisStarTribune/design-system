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

  if (!link) {
    return undefined;
  }

  const label = purchaseLink?.label?.trim();

  return {
    label: label || 'Buy Reprint',
    link,
  };
};

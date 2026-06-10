import type { CtaLinkProps } from '@/types';

export type ResolvedPurchaseLink = {
  label: string;
  link: string;
};

export const hasPurchaseLink = (purchaseLink?: CtaLinkProps): boolean => {
  return Boolean(purchaseLink?.label?.trim() && purchaseLink?.link?.trim());
};

export const resolvePurchaseLink = (
  purchaseLink?: CtaLinkProps
): ResolvedPurchaseLink | undefined => {
  const link = purchaseLink?.link?.trim();
  const label = purchaseLink?.label?.trim();

  if (!link || !label) {
    return undefined;
  }

  return {
    label,
    link,
  };
};

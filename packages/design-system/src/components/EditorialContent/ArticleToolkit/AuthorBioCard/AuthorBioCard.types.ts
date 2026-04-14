// AuthorBioCard.types.ts

import { BaseProps, AccessibilityProps, HeadingLevels, CtaLinkProps } from '@/types/globalTypes';

export interface AuthorBioCardProps extends BaseProps, AccessibilityProps {
  label?: string;
  name?: string;
  description: string;
  thumbnailIcon?: string;
  thumbnailIconAlt?: string;
  ctaLink?: CtaLinkProps;
  position?: string;
  headingLevel?: HeadingLevels;
  hasTopBorder?: boolean;
  hasBottomBorder?: boolean;
}

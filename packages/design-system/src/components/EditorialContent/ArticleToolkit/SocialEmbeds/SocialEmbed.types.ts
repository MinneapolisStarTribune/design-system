import type { StyleProp, ViewStyle } from 'react-native';
import type { BaseProps } from '@/types';

export const SOCIAL_EMBED_PLATFORMS = ['instagram', 'facebook', 'twitter', 'threads'] as const;

export type SocialEmbedPlatform = (typeof SOCIAL_EMBED_PLATFORMS)[number];

export const SOCIAL_EMBEDS_VARIANTS = ['standard', 'inline', 'full'] as const;

export type SocialEmbedsVariant = (typeof SOCIAL_EMBEDS_VARIANTS)[number];

/* base props for article toolkit components */
export interface ArticleToolkitBaseProps extends BaseProps {
  variant?: SocialEmbedsVariant;
}

/* remove conflicting props from HTMLAttributes */
type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

/* component props */
export interface SocialEmbedsProps extends ArticleToolkitBaseProps, DivProps {
  platform?: SocialEmbedPlatform;
  children: React.ReactNode;
}

/**
 * Native props for SocialEmbeds.
 * Uses RN `style` and `testID`-compatible `dataTestId`.
 */
type SocialEmbedsNativeSharedProps = Pick<SocialEmbedsProps, 'platform' | 'variant' | 'dataTestId'>;

export interface SocialEmbedsNativeProps extends SocialEmbedsNativeSharedProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

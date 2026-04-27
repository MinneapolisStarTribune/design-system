import React from 'react';
import { View } from 'react-native';
import type { SocialEmbedsNativeProps } from '../SocialEmbed.types';

/**
 * SocialEmbeds — Native container
 *
 * Native apps render platform embeds with app-specific SDK/webview integrations.
 * This DS component provides a typed wrapper and consistent container contract.
 */
export const SocialEmbeds: React.FC<SocialEmbedsNativeProps> = ({
  children,
  dataTestId = 'social-embeds',
  style,
  accessibilityLabel,
}) => {
  return (
    <View testID={dataTestId} accessibilityLabel={accessibilityLabel} style={style}>
      <View>{children}</View>
    </View>
  );
};

SocialEmbeds.displayName = 'SocialEmbeds';

export type { SocialEmbedsNativeProps, SocialEmbedsProps } from '../SocialEmbed.types';

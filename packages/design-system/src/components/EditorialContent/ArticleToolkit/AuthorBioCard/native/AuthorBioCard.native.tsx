// AuthorBioCard.native.tsx

import React, { useContext } from 'react';
import { View, Image, Pressable, Linking } from 'react-native';

import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';

import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { createDesignSystemError } from '@/utils/errorPrefix';

import { AuthorBioCardProps } from '../AuthorBioCard.types';
import { StyleSheet } from 'react-native';
import { ChevronRightIcon } from '@/index.native';

function createStyles(theme: NativeTheme) {
  return StyleSheet.create({
    root: {
      width: '100%',
      maxWidth: 528,
    },

    borderTop: {
      borderTopWidth: 1,
      borderTopColor: theme.colorBorderOnLightSubtle01,
      paddingTop: theme.spacing8,
    },

    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colorBorderOnLightSubtle01,
      paddingBottom: theme.spacing8,
    },

    label: {
      marginTop: theme.spacing8,
      color: theme.colorTextOnLightPrimary,
    },

    container: {
      flexDirection: 'row',
      gap: theme.spacing12,
      marginVertical: theme.spacing16,
    },

    imageWrapper: {
      width: 60,
      height: 60,
      overflow: 'hidden',
    },

    imageCircle: {
      borderRadius: theme.radiusFull,
    },

    image: {
      width: '100%',
      height: '100%',
    },

    content: {
      flex: 1,
      flexDirection: 'column',
    },

    name: {
      marginBottom: theme.spacing4,
      color: theme.colorTextOnLightPrimary,
    },

    position: {
      color: theme.colorNeutral700,
    },

    description: {
      marginVertical: theme.spacing12,
      color: theme.colorTextOnLightSecondary,
    },

    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing4,
    },

    ctaText: {
      color: theme.colorTextOnLightPrimary,
    },
  });
}

export const AuthorBioCard: React.FC<AuthorBioCardProps> = ({
  label = 'ABOUT THE AUTHOR',
  name,
  description,
  thumbnailIcon,
  thumbnailIconAlt,
  ctaLink,
  position,

  hasTopBorder = false,
  hasBottomBorder = false,

  dataTestId = 'author-bio-card',
}) => {
  const designSystemContext = useContext(DesignSystemContext);

  if (!designSystemContext) {
    throw new Error(
      createDesignSystemError('AuthorBioCardNative', 'must be used within a DesignSystemProvider.')
    );
  }

  const styles = useNativeStyles(createStyles);
  const ctaLabel = ctaLink?.label?.trim() ? ctaLink.label : 'See More';

  const showCTA = Boolean(ctaLink && (ctaLink.link || ctaLink.onPress));

  const handlePress = () => {
    if (ctaLink?.onPress) return ctaLink.onPress();
    if (ctaLink?.link) return Linking.openURL(ctaLink.link);
  };

  return (
    <View
      style={[
        styles.root,
        hasTopBorder && styles.borderTop,
        hasBottomBorder && styles.borderBottom,
      ]}
      testID={dataTestId}
      accessibilityLabel={label}
    >
      {label && (
        <UtilityLabel size="small" weight="semibold" style={styles.label}>
          {label}
        </UtilityLabel>
      )}

      <View style={styles.container}>
        {thumbnailIcon && (
          <View style={[styles.imageWrapper, styles.imageCircle]}>
            <Image
              source={{ uri: thumbnailIcon }}
              accessibilityLabel={thumbnailIconAlt ?? 'Author thumbnail'}
              style={styles.image}
            />
          </View>
        )}

        <View style={styles.content}>
          {name && (
            <UtilityLabel size="large" weight="semibold" style={styles.name}>
              {name}
            </UtilityLabel>
          )}

          {position && (
            <UtilityLabel size="small" weight="semibold" style={styles.position}>
              {position}
            </UtilityLabel>
          )}

          <UtilityBody size="small" style={styles.description}>
            {description}
          </UtilityBody>

          {showCTA && ctaLink && (
            <Pressable
              onPress={handlePress}
              accessibilityRole="link"
              accessibilityLabel={ctaLabel}
              testID="author-bio-cta"
              style={styles.cta}
            >
              <UtilityBody size="small" style={styles.ctaText}>
                {ctaLabel}
              </UtilityBody>
              <UtilityBody size="small" style={styles.ctaText}>
                <ChevronRightIcon size="medium" />
              </UtilityBody>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

AuthorBioCard.displayName = 'AuthorBioCard';

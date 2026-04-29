import React, { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
} from 'react-native';
import { CameraIcon, CloseIcon, ExpandIcon } from '@/icons';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import type { InlineImageProps } from '../InlineImage.types';

const DEFAULT_TEST_ID = 'inline-image';

const parseTokenNumber = (value: number | string): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return undefined;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseAspectRatioToken = (value: string): number => {
  const trimmed = value.trim();
  if (trimmed.includes('/')) {
    const [w, h] = trimmed.split('/').map((part) => Number.parseFloat(part.trim()));
    if (Number.isFinite(w) && Number.isFinite(h) && h > 0) {
      return w / h;
    }
  }
  const numeric = Number.parseFloat(trimmed);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 16 / 9;
};

const buildImageUri = (src: string, imgixParams?: string): string => {
  if (!imgixParams) {
    return src;
  }
  return `${src}${src.includes('?') ? '&' : '?'}${imgixParams}`;
};

const createStyles = (theme: NativeTheme, variant: NonNullable<InlineImageProps['variant']>) => {
  const standardMaxWidth = theme.semanticArticleToolkitMaxWidthStandardFullDesktop;
  const immersiveMaxWidth = theme.semanticArticleToolkitMaxWidthImmersiveLargeDesktop;
  const borderRadius = parseTokenNumber(theme.semanticInlineImageBorderRadius) ?? 0;
  const aspectRatio = parseAspectRatioToken(theme.semanticInlineImageAspectRatio);

  return StyleSheet.create({
    root: {
      width: '100%',
      gap: theme.spacing8,
      maxWidth: variant === 'immersive' ? immersiveMaxWidth : standardMaxWidth,
      alignSelf: 'center',
    },
    imageWrapper: {
      width: '100%',
      overflow: 'hidden',
      borderRadius,
      aspectRatio,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    captionText: {
      color: theme.colorTextOnLightSecondary,
    },
    purchaseLinkSeparator: {
      marginHorizontal: theme.spacing4,
    },
    purchaseLinkText: {
      color: theme.colorLinkTextDefault,
      textDecorationLine: 'underline',
      textDecorationColor: theme.colorLinkUnderlineDefault,
    },
    expandButton: {
      position: 'absolute',
      right: theme.spacing8,
      bottom: theme.spacing8,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(34, 34, 34, 0.5)',
    },
    dialogOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing16,
      paddingVertical: theme.spacing24,
      gap: theme.spacing12,
    },
    dialogClose: {
      alignSelf: 'flex-end',
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(34, 34, 34, 0.5)',
    },
    dialogImageWrapper: {
      width: '100%',
      maxHeight: '75%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogImage: {
      width: '100%',
      maxHeight: '100%',
      aspectRatio,
    },
    dialogCaption: {
      gap: theme.spacing8,
    },
    dialogCaptionText: {
      color: theme.colorTextOnDarkPrimary,
    },
    dialogCreditRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing4,
    },
    dialogCreditText: {
      color: theme.colorTextOnDarkSecondary,
      flexShrink: 1,
    },
  });
};

export const InlineImage: React.FC<InlineImageProps> = ({
  expandable = false,
  image,
  caption,
  className: _className,
  credit,
  dataTestId = DEFAULT_TEST_ID,
  imgixParams,
  objectFit = 'cover',
  style,
  variant = 'standard',
  purchaseLink,
  ...accessibilityProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = useNativeStyles((theme) => createStyles(theme, variant));
  const imageUri = useMemo(() => buildImageUri(image.src, imgixParams), [image.src, imgixParams]);
  const captionText = [caption, credit && `(${credit})`].filter(Boolean).join(' ');
  const hasDialogText = Boolean(caption?.trim()) || Boolean(credit?.trim());
  const imageStyle = (style ?? {}) as ImageStyle;

  const openPurchaseLink = async () => {
    if (!purchaseLink) {
      return;
    }

    try {
      const canOpenPurchaseLink = await Linking.canOpenURL(purchaseLink);

      if (!canOpenPurchaseLink) {
        return;
      }

      await Linking.openURL(purchaseLink);
    } catch (error) {
      console.warn('Failed to open purchase link', error);
    }
  };

  return (
    <>
      <View
        testID={dataTestId}
        style={styles.root}
        accessibilityLabel={accessibilityProps['aria-label']}
        accessibilityElementsHidden={accessibilityProps['aria-hidden']}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, imageStyle]}
            resizeMode={objectFit}
            accessibilityRole="image"
            accessibilityLabel={image.altText}
            testID={`${dataTestId}-image`}
          />
          {expandable ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Expand image"
              accessibilityHint="Opens expanded image view"
              onPress={() => setIsOpen(true)}
              style={styles.expandButton}
              testID={`${dataTestId}-expand-button`}
            >
              <ExpandIcon color="on-dark-primary" size="large" />
            </Pressable>
          ) : null}
        </View>

        {captionText ? (
          <View testID={`${dataTestId}-caption`}>
            <UtilityLabel size="small" weight="regular" style={styles.captionText}>
              {captionText}
              {purchaseLink ? (
                <>
                  <Text
                    style={styles.purchaseLinkSeparator}
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                  >
                    •
                  </Text>
                  <Text
                    style={styles.purchaseLinkText}
                    accessibilityRole="link"
                    accessibilityLabel="Buy Reprint"
                    onPress={openPurchaseLink}
                    testID={`${dataTestId}-purchase-link`}
                  >
                    Buy Reprint
                  </Text>
                </>
              ) : null}
            </UtilityLabel>
          </View>
        ) : null}
      </View>

      <Modal
        visible={isOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View
          style={styles.dialogOverlay}
          testID={`${dataTestId}-dialog`}
          accessibilityViewIsModal
          accessibilityLabel="Expanded image view"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close expanded image"
            onPress={() => setIsOpen(false)}
            style={styles.dialogClose}
            testID={`${dataTestId}-dialog-close-button`}
          >
            <CloseIcon color="on-dark-primary" size="large" />
          </Pressable>

          <View style={styles.dialogImageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={[styles.dialogImage, imageStyle]}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel={image.altText}
            />
          </View>

          {hasDialogText ? (
            <View style={styles.dialogCaption}>
              {caption?.trim() ? (
                <UtilityLabel size="small" weight="regular" style={styles.dialogCaptionText}>
                  {caption}
                </UtilityLabel>
              ) : null}
              {credit?.trim() ? (
                <View style={styles.dialogCreditRow}>
                  <CameraIcon color="on-dark-primary" size="medium" />
                  <UtilityLabel size="small" weight="regular" style={styles.dialogCreditText}>
                    {credit}
                  </UtilityLabel>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
};

InlineImage.displayName = 'InlineImage';

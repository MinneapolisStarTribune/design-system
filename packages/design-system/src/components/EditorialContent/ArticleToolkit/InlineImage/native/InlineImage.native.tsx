import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View, type ImageStyle } from 'react-native';
import { CloseIcon, ExpandIcon } from '@/icons';
import { Caption } from '@/components/Caption/native/Caption.native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { resolvePurchaseLink } from '../../shared/resolvePurchaseLink';
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
    expandButton: {
      position: 'absolute',
      right: theme.spacing16,
      top: theme.spacing16,
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
      width: '100%',
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
  const imageStyle = (style ?? {}) as ImageStyle;
  const resolvedPurchaseLink = resolvePurchaseLink(purchaseLink);
  const hasDialogCaptionContent =
    Boolean(caption?.trim()) || Boolean(credit?.trim()) || Boolean(resolvedPurchaseLink);

  return (
    <>
      <View
        testID={dataTestId}
        style={styles.root}
        accessibilityLabel={accessibilityProps['aria-label']}
        accessibilityElementsHidden={accessibilityProps['aria-hidden']}
        importantForAccessibility={
          accessibilityProps['aria-hidden'] ? 'no-hide-descendants' : 'auto'
        }
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

        <Caption
          caption={caption}
          credit={credit}
          purchaseLink={resolvedPurchaseLink}
          variant="inline"
          dataTestId={`${dataTestId}-caption`}
        />
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

          {hasDialogCaptionContent ? (
            <Caption
              caption={caption}
              credit={credit}
              purchaseLink={resolvedPurchaseLink}
              variant="lightbox"
              style={styles.dialogCaption}
              dataTestId={`${dataTestId}-dialog-caption`}
            />
          ) : null}
        </View>
      </Modal>
    </>
  );
};

InlineImage.displayName = 'InlineImage';

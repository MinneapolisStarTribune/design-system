import React, { useRef, useState, useCallback, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  AccessibilityInfo,
  Platform,
  Text,
  Modal,
  Pressable,
  Image,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  type LayoutChangeEvent,
  type ImageStyle,
} from 'react-native';

import {
  ImageGalleryNativeProps as ImageGalleryProps,
  type ImageItem,
  Variant,
} from '../ImageGallery.types';
import {
  Button,
  CameraFilledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
} from '@/index.native';
import { Caption } from '@/components/Caption/native/Caption.native';
import {
  Image as DSImage,
  ImageProps as NativeImageProps,
} from '@/components/Image/native/Image.native';
import type { CtaLinkProps } from '@/types';

import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { createDesignSystemError } from '@/utils/errorPrefix';

const BREAKPOINTS = {
  small: 640,
  medium: 1024,
};

const getSpaceBetween = (width: number): number => {
  if (width < BREAKPOINTS.small) return 8;
  if (width < BREAKPOINTS.medium) return 16;
  return 24;
};

const getMaxWidth = (width: number, variant: Variant): number => {
  if (variant === 'immersive') {
    if (width < BREAKPOINTS.small) return 390;
    if (width < BREAKPOINTS.medium) return 535;
    return 1080;
  }
  if (width < BREAKPOINTS.small) return 390;
  if (width < BREAKPOINTS.medium) return 535;
  return 712;
};

const getButtonSize = (width: number): 'small' | 'large' =>
  width < BREAKPOINTS.medium ? 'small' : 'large';

const buildImageUri = (src: string, imgixParams?: string): string => {
  if (!imgixParams) {
    return src;
  }
  return `${src}${src.includes('?') ? '&' : '?'}${imgixParams}`;
};

/** Maps a carousel slide index (including loop clones) to an index in `images`. */
const toLogicalImageIndex = (slideIndex: number, hasLoop: boolean, total: number): number => {
  if (!hasLoop) {
    return slideIndex;
  }
  if (slideIndex === 0) {
    return total - 1;
  }
  if (slideIndex === total + 1) {
    return 0;
  }
  return slideIndex - 1;
};

type GalleryStyles = ReturnType<typeof createStyles>;

type ImageGalleryExpandModalProps = {
  visible: boolean;
  image: ImageItem | null;
  purchaseLink?: CtaLinkProps;
  currentIndex?: number;
  totalItems?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  styles: GalleryStyles;
  dataTestId: string;
  onClose: () => void;
};

const ImageGalleryExpandModal: React.FC<ImageGalleryExpandModalProps> = ({
  visible,
  image,
  purchaseLink,
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  styles,
  dataTestId,
  onClose,
}) => {
  if (!image) {
    return null;
  }

  const uri = buildImageUri(image.src, image.imgixParams);
  const aspectRatio = (image.width ?? 1080) / (image.height ?? 720);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View
        style={styles.dialogOverlay}
        testID={`${dataTestId}-dialog`}
        accessibilityViewIsModal
        accessibilityLabel="Expanded image view"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close expanded image"
          onPress={onClose}
          style={styles.dialogClose}
          testID={`${dataTestId}-dialog-close-button`}
        >
          <CloseIcon color="on-dark-primary" size="large" />
        </Pressable>

        <View style={styles.dialogImageWrapper}>
          <Image
            source={{ uri }}
            style={[styles.dialogImage, { aspectRatio }]}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel={image.altText}
          />
        </View>

        <Caption
          caption={image.caption}
          credit={image.credit}
          purchaseLink={purchaseLink}
          variant="lightbox"
          currentIndex={currentIndex}
          totalItems={totalItems}
          onPrevious={onPrevious}
          onNext={onNext}
          style={styles.dialogCaption}
          dataTestId={`${dataTestId}-dialog-caption`}
        />
      </View>
    </Modal>
  );
};

function createStyles(theme: NativeTheme) {
  return {
    gallery: { width: '100%' } as ViewStyle,
    innerContainer: { width: '100%', position: 'relative' } as ViewStyle,
    slide: {
      overflow: 'hidden',
      borderRadius: theme.semanticPhotoLayoutBorderRadius,
    } as ViewStyle,
    imageWrapper: {
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
    } as ViewStyle,
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
    } as ViewStyle,
    dialogOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing16,
      paddingVertical: theme.spacing24,
      gap: theme.spacing12,
    } as ViewStyle,
    dialogClose: {
      alignSelf: 'flex-end',
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(34, 34, 34, 0.5)',
    } as ViewStyle,
    dialogImageWrapper: {
      width: '100%',
      maxHeight: '75%',
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    dialogImage: {
      width: '100%',
      maxHeight: '100%',
    } as ImageStyle,
    dialogCaption: {
      width: '100%',
    } as ViewStyle,
    image: {
      width: '100%',
      height: '100%',
    } as ImageStyle,
    mediaTag: {
      position: 'absolute',
      bottom: theme.spacing16,
      left: theme.spacing16,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing4,
      paddingHorizontal: theme.spacing6,
      borderRadius: theme.radius6,
      backgroundColor: 'rgba(0,0,0,0.3)',
    } as ViewStyle,
    mediaTagText: {
      color: theme.colorBaseWhite,
    } as TextStyle,
    bottomSection: {
      marginTop: theme.spacing8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing20,
    } as ViewStyle,
    captionContainer: { flex: 1 } as ViewStyle,
    caption: { color: theme.colorTextOnLightSecondary } as TextStyle,
    controls: {
      flexDirection: 'row',
      gap: theme.spacing4,
      marginLeft: theme.spacing16,
    } as ViewStyle,
    navButton: {
      borderWidth: 1,
      borderColor: theme.colorBorderOnDarkSubtle01,
    } as ViewStyle,
  };
}

export const ImageGallery: React.FC<ImageGalleryProps<NativeImageProps>> = ({
  images,
  variant = 'standard',
  expandable = false,
  purchaseLink,
  loop,
  ImageComponent,
  style,
  imageStyle,
  wrapperStyle,
  captionStyle,
  controlsStyle,
  dataTestId = 'image-gallery',
  'aria-label': ariaLabel,
}) => {
  const designSystemContext = useContext(DesignSystemContext);

  if (!designSystemContext) {
    throw new Error(
      createDesignSystemError('ImageGallery', 'must be used within DesignSystemProvider')
    );
  }

  const styles = useNativeStyles(createStyles);
  const scrollRef = useRef<ScrollView>(null);

  const [dimensions, setDimensions] = useState(() => {
    const { width } = Dimensions.get('window');
    return { width, height: 0 };
  });

  const isImmersive = variant === 'immersive';
  const total = images.length;

  const shouldLoop = loop !== undefined ? loop : isImmersive;
  const hasLoop = shouldLoop && total > 1;

  const loopedImages = hasLoop ? [images[total - 1], ...images, images[0]] : images;

  const [index, setIndex] = useState(hasLoop ? 1 : 0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const Img: React.ComponentType<NativeImageProps> = ImageComponent ?? DSImage;

  const spaceBetween = getSpaceBetween(dimensions.width);
  const maxWidth = getMaxWidth(dimensions.width, variant);
  const buttonSize = getButtonSize(dimensions.width);

  const BASE_WIDTH = 390;
  const scale = dimensions.width / BASE_WIDTH;

  const slideWidth = isImmersive ? Math.min(358 * scale, maxWidth) : dimensions.width;
  const sideSpacing = isImmersive ? Math.max((dimensions.width - slideWidth) / 2, 0) : 0;
  const interval = slideWidth + spaceBetween;

  useEffect(() => {
    if (!isImmersive || !hasLoop) return;

    scrollRef.current?.scrollTo({
      x: interval,
      animated: false,
    });
  }, [isImmersive, interval, hasLoop]);

  useEffect(() => {
    if (!isImmersive) return;

    scrollRef.current?.scrollTo({
      x: index * interval,
      animated: false,
    });
  }, [interval, isImmersive, index]);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      let nextIndex = Math.floor((offsetX + interval / 2) / interval);

      if (hasLoop) {
        if (nextIndex === 0) {
          scrollRef.current?.scrollTo({ x: total * interval, animated: false });
          nextIndex = total;
        } else if (nextIndex === total + 1) {
          scrollRef.current?.scrollTo({ x: interval, animated: false });
          nextIndex = 1;
        }
      }

      const logicalIndex = toLogicalImageIndex(nextIndex, hasLoop, total);

      setIndex(nextIndex);

      if (expandedIndex !== null && logicalIndex !== expandedIndex) {
        setExpandedIndex(null);
      }

      if (Platform.OS !== 'web') {
        AccessibilityInfo.announceForAccessibility(`Image ${logicalIndex + 1} of ${total}`);
      }
    },
    [expandedIndex, interval, total, hasLoop]
  );

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({
      x: i * interval,
      animated: true,
    });
  };

  const handlePrev = () => {
    if (!hasLoop && index === 0) return;
    scrollTo(index - 1);
  };

  const handleNext = () => {
    if (!hasLoop && index === total - 1) return;
    scrollTo(index + 1);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  /** Moves the expanded (lightbox) view to a logical image index and keeps the carousel in sync. */
  const goToExpandedImage = (nextLogicalIndex: number) => {
    if (nextLogicalIndex < 0 || nextLogicalIndex >= total) {
      return;
    }

    setExpandedIndex(nextLogicalIndex);

    const slideIndex = hasLoop ? nextLogicalIndex + 1 : nextLogicalIndex;
    setIndex(slideIndex);
    scrollTo(slideIndex);
  };

  const handleExpandedPrevious = () => {
    if (expandedIndex === null) return;
    goToExpandedImage(expandedIndex - 1);
  };

  const handleExpandedNext = () => {
    if (expandedIndex === null) return;
    goToExpandedImage(expandedIndex + 1);
  };

  const activeImageIndex = total > 0 ? toLogicalImageIndex(index, hasLoop, total) : 0;
  const currentImage = total > 0 ? images[activeImageIndex] : undefined;
  const expandedImage =
    expandedIndex !== null && total > 0 ? (images[expandedIndex] ?? null) : null;

  const expandedPurchaseLink: CtaLinkProps | undefined =
    expandedImage?.purchaseLink ??
    (purchaseLink ? { label: 'Buy Reprint', link: purchaseLink } : undefined);

  if (!total) return null;

  return (
    <>
      <View
        style={[styles.gallery, style as StyleProp<ViewStyle>]}
        testID={dataTestId}
        accessibilityLabel={ariaLabel}
        onLayout={handleLayout}
      >
        <View style={styles.innerContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            snapToInterval={interval}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={false}
            contentContainerStyle={{
              alignItems: 'center',
              gap: spaceBetween,
              paddingHorizontal: sideSpacing,
            }}
          >
            {loopedImages.map((img, i) => {
              const width = img.width ?? 1080;
              const height = img.height ?? 720;
              const aspectRatio = width / height;
              const logicalIndex = toLogicalImageIndex(i, hasLoop, total);
              const slideLabel = `Image ${logicalIndex + 1} of ${total}`;

              return (
                <View
                  key={`${img.src}-${i}`}
                  style={[styles.slide, { width: slideWidth }]}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={`${img.altText}. ${slideLabel}`}
                >
                  <View style={[styles.imageWrapper, { aspectRatio }, wrapperStyle]}>
                    <Img
                      src={img.src}
                      alt={img.altText}
                      imgixParams={img.imgixParams}
                      style={[styles.image, imageStyle]}
                    />
                    {expandable ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Expand image ${logicalIndex + 1} of ${total}`}
                        accessibilityHint="Opens expanded image view"
                        onPress={() => setExpandedIndex(logicalIndex)}
                        style={styles.expandButton}
                        testID={`${dataTestId}-expand-button-${logicalIndex}`}
                      >
                        <ExpandIcon color="on-dark-primary" size="large" />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {!isImmersive && (
            <View style={styles.mediaTag}>
              <CameraFilledIcon color="on-dark-primary" size="medium" />
              <Text style={styles.mediaTagText}>
                {activeImageIndex + 1}/{total}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.captionContainer}>
            {(currentImage?.caption || currentImage?.credit) && (
              <Text style={[styles.caption, captionStyle]}>
                {currentImage.caption}
                {currentImage.credit ? ` ${currentImage.credit}` : ''}
              </Text>
            )}
          </View>

          {total > 1 && (
            <View style={[styles.controls, controlsStyle]}>
              <Button
                variant="ghost"
                size={buttonSize}
                icon={<ChevronLeftIcon />}
                onPress={handlePrev}
                style={styles.navButton}
              />
              <Button
                variant="ghost"
                size={buttonSize}
                icon={<ChevronRightIcon />}
                onPress={handleNext}
                style={styles.navButton}
              />
            </View>
          )}
        </View>
      </View>

      {expandable ? (
        <ImageGalleryExpandModal
          visible={expandedIndex !== null}
          image={expandedImage}
          purchaseLink={expandedPurchaseLink}
          currentIndex={expandedIndex === null ? undefined : expandedIndex + 1}
          totalItems={total}
          onPrevious={handleExpandedPrevious}
          onNext={handleExpandedNext}
          styles={styles}
          dataTestId={dataTestId}
          onClose={() => setExpandedIndex(null)}
        />
      ) : null}
    </>
  );
};

ImageGallery.displayName = 'ImageGallery';

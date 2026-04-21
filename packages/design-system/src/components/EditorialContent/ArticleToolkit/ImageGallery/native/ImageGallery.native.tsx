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
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  type LayoutChangeEvent,
} from 'react-native';

import { ChevronLeftIcon, ChevronRightIcon, CameraFilledIcon } from '@/icons';
import { ImageGalleryProps, Variant } from '../ImageGallery.types';
import { Button } from '@/index.native';
import {
  Image as DSImage,
  ImageProps as NativeImageProps,
} from '@/components/Image/native/Image.native';

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

function createStyles(theme: NativeTheme) {
  return {
    gallery: { width: '100%' as const } satisfies ViewStyle,
    innerContainer: { width: '100%' as const, position: 'relative' as const } satisfies ViewStyle,
    slide: {
      overflow: 'hidden' as const,
      borderRadius: theme.semanticPhotoLayoutBorderRadius,
    } satisfies ViewStyle,
    imageWrapper: {
      width: '100%' as const,
      overflow: 'hidden' as const,
    } satisfies ViewStyle,
    image: {
      width: '100%' as const,
      height: '100%' as const,
    } satisfies ViewStyle,
    mediaTag: {
      position: 'absolute' as const,
      bottom: theme.spacing16,
      left: theme.spacing16,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing4,
      paddingHorizontal: theme.spacing6,
      borderRadius: theme.radius6,
      backgroundColor: 'rgba(0,0,0,0.3)',
    } satisfies ViewStyle,
    mediaTagText: {
      color: theme.colorBaseWhite,
    } satisfies TextStyle,
    bottomSection: {
      marginTop: theme.spacing8,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      gap: theme.spacing20,
    } satisfies ViewStyle,
    captionContainer: { flex: 1 } satisfies ViewStyle,
    caption: { color: theme.colorTextOnLightSecondary } satisfies TextStyle,
    controls: {
      flexDirection: 'row' as const,
      gap: theme.spacing4,
      marginLeft: theme.spacing16,
    } satisfies ViewStyle,
    navButton: {
      borderWidth: 1,
      borderColor: theme.colorBorderOnDarkSubtle01,
    } satisfies ViewStyle,
  };
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  variant = 'standard',
  ImageComponent,
  style,
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

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>(() => {
    const { width } = Dimensions.get('window');
    return { width, height: 0 };
  });

  const isImmersive = variant === 'immersive';
  const total = images.length;

  const loopedImages = total > 1 ? [images[total - 1], ...images, images[0]] : images;

  const [index, setIndex] = useState<number>(1);

  const Img = (ImageComponent ?? DSImage) as React.ComponentType<NativeImageProps>;

  const spaceBetween = getSpaceBetween(dimensions.width);
  const maxWidth = getMaxWidth(dimensions.width, variant);
  const buttonSize = getButtonSize(dimensions.width);

  const BASE_WIDTH = 390;
  const scale = dimensions.width / BASE_WIDTH;

  const slideWidth = isImmersive ? Math.min(358 * scale, maxWidth) : dimensions.width;

  const sideSpacing = isImmersive ? Math.max((dimensions.width - slideWidth) / 2, 0) : 0;

  // initial positioning to center first real slide (skip cloned first)
  useEffect(() => {
    if (!isImmersive) return;

    scrollRef.current?.scrollTo({
      x: slideWidth + spaceBetween,
      animated: false,
    });
  }, [isImmersive, slideWidth, spaceBetween]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / (slideWidth + spaceBetween));

      if (nextIndex === index) return;

      setIndex(nextIndex);

      if (Platform.OS !== 'web') {
        const normalized = nextIndex === 0 ? total : nextIndex === total + 1 ? 1 : nextIndex;

        AccessibilityInfo.announceForAccessibility(`Image ${normalized} of ${total}`);
      }
    },
    [index, slideWidth, spaceBetween, total]
  );

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({
      x: i * (slideWidth + spaceBetween),
      animated: true,
    });
  };

  const handlePrev = () => scrollTo(index - 1);
  const handleNext = () => scrollTo(index + 1);

  // loop correction without animation to avoid flicker
  useEffect(() => {
    if (!isImmersive) return;

    if (index === 0) {
      scrollRef.current?.scrollTo({
        x: total * (slideWidth + spaceBetween),
        animated: false,
      });
    } else if (index === total + 1) {
      scrollRef.current?.scrollTo({
        x: slideWidth + spaceBetween,
        animated: false,
      });
    }
  }, [index, isImmersive, total, slideWidth, spaceBetween]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  if (!images?.length) return null;

  const realIndex = index === 0 ? total - 1 : index === total + 1 ? 0 : index - 1;

  const currentImage = images[realIndex];

  return (
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={slideWidth + spaceBetween}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
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

            return (
              <View key={`${img.src}-${i}`} style={[styles.slide, { width: slideWidth }]}>
                <View style={[styles.imageWrapper, { aspectRatio }]}>
                  <Img
                    src={img.src}
                    alt={img.altText}
                    imgixParams={img.imgixParams}
                    style={styles.image}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>

        {!isImmersive && (
          <View style={styles.mediaTag}>
            <CameraFilledIcon color="on-dark-primary" size="medium" />
            <Text style={styles.mediaTagText}>
              {realIndex + 1}/{total}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.captionContainer}>
          {(currentImage?.caption || currentImage?.credit) && (
            <Text style={styles.caption}>
              {currentImage.caption}
              {currentImage.credit ? ` ${currentImage.credit}` : ''}
            </Text>
          )}
        </View>

        {total > 1 && (
          <View style={styles.controls}>
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
  );
};

ImageGallery.displayName = 'ImageGallery';

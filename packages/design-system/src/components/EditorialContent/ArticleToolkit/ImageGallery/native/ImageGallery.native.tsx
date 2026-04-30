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
  type ImageStyle,
} from 'react-native';

import { ImageGalleryProps, Variant } from '../ImageGallery.types';
import { Button, CameraFilledIcon, ChevronLeftIcon, ChevronRightIcon } from '@/index.native';
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
    gallery: { width: '100%' } as ViewStyle,
    innerContainer: { width: '100%', position: 'relative' } as ViewStyle,
    slide: {
      overflow: 'hidden',
      borderRadius: theme.semanticPhotoLayoutBorderRadius,
    } as ViewStyle,
    imageWrapper: {
      width: '100%',
      overflow: 'hidden',
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

      setIndex(nextIndex);

      if (Platform.OS !== 'web') {
        const normalized = hasLoop ? nextIndex : nextIndex + 1;
        AccessibilityInfo.announceForAccessibility(`Image ${normalized} of ${total}`);
      }
    },
    [interval, total, hasLoop]
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

  if (!images?.length) return null;

  let realIndex = index;
  if (hasLoop) {
    if (index === 0) realIndex = total - 1;
    else if (index === total + 1) realIndex = 0;
    else realIndex = index - 1;
  }

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

            return (
              <View
                key={`${img.src}-${i}`}
                style={[styles.slide, { width: slideWidth }]}
                accessible
                accessibilityRole="image"
                accessibilityLabel={`${img.altText}. Image ${realIndex + 1} of ${total}`}
              >
                <View style={[styles.imageWrapper, { aspectRatio }, wrapperStyle]}>
                  <Img
                    src={img.src}
                    alt={img.altText}
                    imgixParams={img.imgixParams}
                    style={[styles.image, imageStyle]}
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
  );
};

ImageGallery.displayName = 'ImageGallery';

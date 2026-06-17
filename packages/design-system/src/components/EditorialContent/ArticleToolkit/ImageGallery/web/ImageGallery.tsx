import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import classNames from 'classnames';
import { Caption } from '@/components/Caption/web/Caption';
import { CameraFilledIcon } from '@/icons';
import { Image as DSImage, ImageProps } from '@/components/Image/web/Image';

import { ExpandButton } from '../../shared/ExpandButton/ExpandButton';
import { ImageDialog } from '../../shared/ImageDialog/ImageDialog';
import { resolvePurchaseLink } from '../../shared/PurchaseLink/resolvePurchaseLink';

import styles from './ImageGallery.module.scss';
import { ImageGalleryProps, ImageItem } from '../ImageGallery.types';

const TABLET_SPACE_BETWEEN = 16;
const DESKTOP_SPACE_BETWEEN = 24;

const getDefaultSpaceBetween = (): number => {
  if (typeof window === 'undefined') return DESKTOP_SPACE_BETWEEN;
  const width = window.innerWidth;
  if (width < 640) return 8;
  if (width < 1024) return TABLET_SPACE_BETWEEN;
  return DESKTOP_SPACE_BETWEEN;
};

const getImageFit = (img: ImageItem): 'cover' | 'contain' => {
  if (
    typeof img.width === 'number' &&
    typeof img.height === 'number' &&
    img.width > 0 &&
    img.height > 0
  ) {
    const ratio = img.width / img.height;
    return ratio < 1 ? 'contain' : 'cover';
  }
  return 'cover';
};

const normalizeCredit = (credit?: string): string | undefined => {
  const trimmed = credit?.trim();
  if (!trimmed) return undefined;
  const match = trimmed.match(/^\((.*)\)$/);
  return match?.[1] ?? trimmed;
};

export const ImageGallery: React.FC<ImageGalleryProps<ImageProps>> = ({
  images,
  variant = 'standard',
  expandable = false,
  aspectRatio,
  spaceBetween: spaceBetweenOverride,
  onIndexChange,
  purchaseLink,
  ImageComponent,
  className,
  imageClassName,
  wrapperClassName,
  captionClassName,
  controlsClassName,
  dataTestId = 'image-gallery',
  loop,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [currentImageProgress, setCurrentImageProgress] = useState<number>(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [responsiveSpaceBetween, setResponsiveSpaceBetween] =
    useState<number>(getDefaultSpaceBetween());
  const spaceBetween =
    typeof spaceBetweenOverride === 'number' ? spaceBetweenOverride : responsiveSpaceBetween;

  const isImmersive = variant === 'immersive';
  const total = images.length;
  const hasMultipleImages = total > 1;
  const activeImage = images[currentImageProgress - 1];
  const dialogImage = images[expandedIndex ?? 0];

  const wrapperAspectRatio = aspectRatio?.trim() || undefined;

  const activePurchaseLink = resolvePurchaseLink(activeImage?.purchaseLink ?? purchaseLink);
  const dialogPurchaseLink = resolvePurchaseLink(dialogImage?.purchaseLink ?? purchaseLink);

  const Img: React.ComponentType<ImageProps> = ImageComponent ?? DSImage;

  // Keep slide spacing responsive to window resizes.
  useEffect(() => {
    if (typeof spaceBetweenOverride === 'number') {
      return;
    }

    const handleResize = (): void => setResponsiveSpaceBetween(getDefaultSpaceBetween());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [spaceBetweenOverride]);

  // Notify consumers when the visible image index changes.
  useEffect(() => {
    onIndexChange?.(currentImageProgress);
  }, [currentImageProgress, onIndexChange]);

  const onExpand = (index: number, el: HTMLButtonElement): void => {
    lastTriggerRef.current = el;
    setExpandedIndex(index);
  };

  const onCloseDialog = (): void => {
    setExpandedIndex(null);
    lastTriggerRef.current?.focus();
  };

  const handleSlideChange = (swiper: SwiperType): void => {
    const normalizedIndex = isImmersive ? swiper.realIndex : swiper.activeIndex;
    setCurrentImageProgress(normalizedIndex + 1);

    if (expandedIndex !== null && expandedIndex !== normalizedIndex) {
      setExpandedIndex(normalizedIndex);
    }
  };

  const handlePreviousSlide = (): void => {
    swiperRef.current?.slidePrev();
  };
  const handleNextSlide = (): void => {
    swiperRef.current?.slideNext();
  };

  const navigationProps = {
    currentIndex: hasMultipleImages ? currentImageProgress : undefined,
    totalItems: hasMultipleImages ? total : undefined,
    onPrevious: hasMultipleImages ? handlePreviousSlide : undefined,
    onNext: hasMultipleImages ? handleNextSlide : undefined,
    loopNavigation: isImmersive,
  };

  const mediaTagTypography = 'typography-utility-label-semibold-large';

  if (!images?.length) return null;

  const swiperModules = isImmersive
    ? [Navigation, A11y, Pagination, EffectCoverflow]
    : [Navigation, A11y, Pagination];

  const swiperProps = isImmersive
    ? {
        effect: 'coverflow' as const,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 0,
          modifier: 1,
          slideShadows: true,
        },
        centeredSlides: true,
        slidesPerView: 'auto' as const,
      }
    : {
        centeredSlides: false,
        slidesPerView: 1 as const,
      };

  return (
    <>
      <div
        data-testid={dataTestId}
        className={classNames(styles.gallery, styles[variant], className)}
      >
        <span aria-live="polite" aria-atomic="true" className={styles.srOnly}>
          {`Image ${currentImageProgress} of ${total}`}
        </span>

        <div className={styles.innerContainer}>
          <Swiper
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            modules={swiperModules}
            spaceBetween={spaceBetween}
            loop={loop !== undefined ? loop : isImmersive}
            allowTouchMove
            onSlideChange={handleSlideChange}
            className={styles.swiper}
            {...swiperProps}
          >
            {images.map((img, index) => {
              if (!img.altText?.trim()) {
                console.warn('ImageGallery: missing altText for image', img.src);
              }

              const imageFit = getImageFit(img);
              const isContain = imageFit === 'contain';
              const isCover = imageFit === 'cover';

              return (
                <SwiperSlide
                  key={`${img.src}-${index}`}
                  className={classNames(styles.slide, {
                    [styles.immersiveSlide]: isImmersive,
                  })}
                >
                  <div
                    className={classNames(
                      styles.imageWrapper,
                      {
                        [styles.containWrapper]: isContain,
                      },
                      wrapperClassName
                    )}
                    style={wrapperAspectRatio ? { aspectRatio: wrapperAspectRatio } : undefined}
                  >
                    <Img
                      src={img.src}
                      alt={img.altText}
                      imgixParams={img.imgixParams}
                      width={isCover ? 0 : img.width}
                      height={isCover ? 0 : img.height}
                      loading="lazy"
                      decoding="async"
                      className={classNames(
                        styles.image,
                        {
                          [styles.coverImage]: isCover,
                          [styles.containImage]: isContain,
                        },
                        imageClassName
                      )}
                    />
                    {expandable && (
                      <ExpandButton
                        onClick={(e) => onExpand(index, e.currentTarget)}
                        ariaLabel={`Expand image ${index + 1} of ${total}`}
                        dataTestId={`${dataTestId}-expand-button-${index}`}
                      />
                    )}
                    s
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {!isImmersive && (
            <div className={styles.mediaTag}>
              <CameraFilledIcon color="on-dark-primary" size="medium" />
              <span className={mediaTagTypography}>
                {currentImageProgress}/{total}
              </span>
            </div>
          )}
        </div>

        <div className={classNames(styles.bottomSection, controlsClassName)}>
          <Caption
            caption={activeImage?.caption}
            credit={normalizeCredit(activeImage?.credit)}
            variant="inline"
            purchaseLink={activePurchaseLink}
            {...navigationProps}
            className={classNames(styles.caption, captionClassName)}
            dataTestId="image-gallery-caption"
          />
        </div>
      </div>

      {expandable && dialogImage && (
        <ImageDialog
          image={{
            src: dialogImage.src,
            altText: dialogImage.altText,
            width: dialogImage.width,
            height: dialogImage.height,
          }}
          caption={dialogImage.caption}
          credit={normalizeCredit(dialogImage.credit)}
          aspectRatio={wrapperAspectRatio}
          imgixParams={dialogImage.imgixParams}
          purchaseLink={dialogPurchaseLink}
          dialogRef={dialogRef}
          isOpen={expandedIndex !== null}
          {...navigationProps}
          onClose={onCloseDialog}
          dataTestId={`${dataTestId}-dialog`}
        />
      )}
    </>
  );
};

ImageGallery.displayName = 'ImageGallery';

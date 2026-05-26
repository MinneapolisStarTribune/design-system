'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import classNames from 'classnames';

import { Caption } from '@/components/Caption/web/Caption';
import { Image as DSImage, ImageProps } from '@/components/Image/web/Image';
import { ExpandButton } from '../../shared/ExpandButton/ExpandButton';
import { ImageDialog } from '../../shared/ImageDialog/ImageDialog';

import styles from './ImageGallery.module.scss';
import { ImageGalleryProps } from '../ImageGallery.types';

/**
 * SSR-safe spacing helper
 */
const getSpaceBetween = (): number => {
  if (typeof window === 'undefined') return 24;

  const width = window.innerWidth;
  if (width < 640) return 8;
  if (width < 1024) return 16;
  return 24;
};

const normalizeCredit = (credit?: string): string | undefined => {
  const trimmedCredit = credit?.trim();

  if (!trimmedCredit) {
    return undefined;
  }

  const match = trimmedCredit.match(/^\((.*)\)$/);
  return match?.[1] ?? trimmedCredit;
};

export const ImageGallery: React.FC<ImageGalleryProps<ImageProps>> = ({
  images,
  variant = 'standard',
  expandable = false,
  ImageComponent,
  className,
  imageClassName,
  wrapperClassName,
  captionClassName,
  controlsClassName,
  dataTestId = 'image-gallery',
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [currentImageProgress, setCurrentImageProgress] = useState<number>(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isDialogOpen = expandedIndex !== null;
  const [spaceBetween, setSpaceBetween] = useState<number>(getSpaceBetween);

  const isImmersive = variant === 'immersive';
  const total = images.length;
  const activeImage = images[currentImageProgress - 1];
  const dialogImage = images[expandedIndex ?? 0];

  const Img: React.ComponentType<ImageProps> = ImageComponent ?? DSImage;

  /**
   * Single resize listener (optimized + SSR safe)
   */
  useEffect(() => {
    const handleResize = (): void => {
      setSpaceBetween(getSpaceBetween());
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToGalleryIndex = (nextIndex: number): void => {
    if (nextIndex < 0 || nextIndex >= total) {
      return;
    }

    const swiper = swiperRef.current;

    if (!swiper) {
      setCurrentImageProgress(nextIndex + 1);
      return;
    }

    if (isImmersive) {
      swiper.slideToLoop(nextIndex);
      return;
    }

    swiper.slideTo(nextIndex);
  };

  const next = (): void => {
    if (!isImmersive && currentImageProgress >= total) {
      return;
    }

    goToGalleryIndex(isImmersive ? currentImageProgress % total : currentImageProgress);
  };

  const prev = (): void => {
    if (!isImmersive && currentImageProgress <= 1) {
      return;
    }

    goToGalleryIndex(
      isImmersive ? (currentImageProgress - 2 + total) % total : currentImageProgress - 2
    );
  };

  const goToDialogIndex = (nextIndex: number): void => {
    setExpandedIndex(nextIndex);
    goToGalleryIndex(nextIndex);
  };

  const goToPreviousDialogImage = (): void => {
    if (expandedIndex === null) {
      return;
    }

    goToDialogIndex(expandedIndex - 1);
  };

  const goToNextDialogImage = (): void => {
    if (expandedIndex === null) {
      return;
    }

    goToDialogIndex(expandedIndex + 1);
  };

  const onExpand = (index: number, el: HTMLButtonElement): void => {
    lastTriggerRef.current = el;
    goToDialogIndex(index);
  };

  const onCloseDialog = (): void => {
    setExpandedIndex(null);
    lastTriggerRef.current?.focus();
  };

  const handleSlideChange = (swiper: SwiperType): void => {
    const normalizedIndex = isImmersive ? swiper.realIndex : swiper.activeIndex;
    const nextIndex = normalizedIndex;

    setCurrentImageProgress(nextIndex + 1);

    if (expandedIndex !== null && expandedIndex !== nextIndex) {
      setExpandedIndex(nextIndex);
    }
  };

  const captionsTypography = 'typography-utility-text-regular-x-small';
  const hasBottomSection = Boolean(activeImage?.caption || activeImage?.credit || total > 1);

  if (!images?.length) return null;

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
            modules={[Navigation, A11y, Pagination]}
            slidesPerView={isImmersive ? 'auto' : 1}
            centeredSlides={isImmersive}
            spaceBetween={spaceBetween}
            loop={isImmersive}
            allowTouchMove
            autoHeight
            onSlideChange={handleSlideChange}
            className={styles.swiper}
          >
            {images.map((img, index) => {
              const width = img.width ?? 1080;
              const height = img.height ?? 720;

              if (!img.altText?.trim()) {
                console.warn('ImageGallery: missing altText for image', img.src);
              }

              return (
                <SwiperSlide key={`${img.src}-${index}`} className={styles.slide}>
                  <div
                    className={classNames(styles.imageWrapper, wrapperClassName)}
                    style={
                      img.width && img.height
                        ? { aspectRatio: `${img.width} / ${img.height}` }
                        : undefined
                    }
                  >
                    <Img
                      src={img.src}
                      alt={img.altText}
                      imgixParams={img.imgixParams}
                      className={classNames(styles.image, imageClassName)}
                      width={width}
                      height={height}
                      loading="lazy"
                      decoding="async"
                    />
                    {expandable && (
                      <ExpandButton
                        onClick={(e) => onExpand(index, e.currentTarget)}
                        ariaLabel={`Expand image ${index + 1} of ${total}`}
                        dataTestId={`${dataTestId}-expand-button-${index}`}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {hasBottomSection && (
          <div className={classNames(styles.bottomSection, controlsClassName)}>
            <Caption
              caption={activeImage?.caption}
              credit={normalizeCredit(activeImage?.credit)}
              currentIndex={total > 1 ? currentImageProgress : undefined}
              totalItems={total > 1 ? total : undefined}
              onPrevious={total > 1 ? prev : undefined}
              onNext={total > 1 ? next : undefined}
              loopNavigation={isImmersive}
              className={classNames(styles.caption, captionsTypography, captionClassName)}
              dataTestId="image-gallery-caption"
            />
          </div>
        )}
      </div>
      {expandable && (
        <ImageDialog
          image={{
            src: dialogImage.src,
            altText: dialogImage.altText,
            width: dialogImage.width,
            height: dialogImage.height,
          }}
          caption={dialogImage.caption}
          credit={normalizeCredit(dialogImage.credit)}
          imgixParams={dialogImage.imgixParams}
          purchaseLink={dialogImage.purchaseLink}
          dialogRef={dialogRef}
          isOpen={isDialogOpen}
          currentIndex={expandedIndex === null ? undefined : expandedIndex + 1}
          totalItems={total}
          onPrevious={goToPreviousDialogImage}
          onNext={goToNextDialogImage}
          loopNavigation={isImmersive}
          onClose={onCloseDialog}
          dataTestId={`${dataTestId}-dialog`}
        />
      )}
    </>
  );
};

ImageGallery.displayName = 'ImageGallery';

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import classNames from 'classnames';

import { Button } from '../../../../Button/web/Button';
import { ChevronLeftIcon, ChevronRightIcon, CameraFilledIcon } from '@/icons';
import { Image as DSImage, ImageProps } from '@/components/Image/web/Image';

import styles from './ImageGallery.module.scss';

export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  src: string;
  altText: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
  imgixParams?: string;
}

export interface ImageGalleryProps {
  images: ImageItem[];
  variant?: Variant;
  ImageComponent?: React.ComponentType<ImageProps>;
  className?: string;
  imageClassName?: string;
  wrapperClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;
}

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

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  variant = 'standard',
  ImageComponent,
  className,
  imageClassName,
  wrapperClassName,
  captionClassName,
  controlsClassName,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const [currentImageProgress, setCurrentImageProgress] = useState<number>(1);
  const [spaceBetween, setSpaceBetween] = useState<number>(getSpaceBetween);
  const [buttonSize, setButtonSize] = useState<'small' | 'large'>('large');

  const isImmersive = variant === 'immersive';
  const total = images.length;

  const Img: React.ComponentType<ImageProps> = ImageComponent ?? DSImage;

  /**
   * Single resize listener (optimized + SSR safe)
   */
  useEffect(() => {
    const handleResize = (): void => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;

      setSpaceBetween(getSpaceBetween());
      setButtonSize(width < 1024 ? 'small' : 'large');
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = (): void => {
    swiperRef.current?.slideNext();
  };
  const prev = (): void => {
    swiperRef.current?.slidePrev();
  };

  const captionsTypography = 'typography-utility-text-regular-x-small';
  const mediaTagTypography = 'typography-utility-label-semibold-large';

  if (!images?.length) return null;

  return (
    <div
      data-testid="image-gallery"
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
          onSlideChange={(swiper: SwiperType) => {
            const normalizedIndex = isImmersive ? swiper.realIndex : swiper.activeIndex;

            setCurrentImageProgress(normalizedIndex + 1);
          }}
          className={styles.swiper}
        >
          {images.map((img) => {
            const width = img.width ?? 1080;
            const height = img.height ?? 720;

            if (!img.altText?.trim()) {
              console.warn('ImageGallery: missing altText for image', img.src);
            }

            return (
              <SwiperSlide key={img.src} className={styles.slide}>
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

      <div className={styles.bottomSection}>
        <div className={classNames(styles.caption, captionsTypography, captionClassName)}>
          {images[currentImageProgress - 1]?.caption}
          {images[currentImageProgress - 1]?.credit && (
            <> {images[currentImageProgress - 1].credit}</>
          )}
        </div>

        {total > 1 && (
          <div className={classNames(styles.controls, controlsClassName)}>
            <Button
              variant="ghost"
              size={buttonSize}
              icon={<ChevronLeftIcon />}
              onClick={prev}
              isDisabled={!isImmersive && currentImageProgress === 1}
              className={styles.navButton}
              aria-label={`Previous image (${Math.max(currentImageProgress - 1, 1)} of ${total})`}
            />
            <Button
              variant="ghost"
              size={buttonSize}
              icon={<ChevronRightIcon />}
              onClick={next}
              isDisabled={!isImmersive && currentImageProgress === total}
              className={styles.navButton}
              aria-label={`Next image (${Math.min(currentImageProgress + 1, total)} of ${total})`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';

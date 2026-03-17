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

import styles from './ImageGallery.module.scss';

export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  src: string;
  altText: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
}

export interface ImageComponentProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface ImageGalleryProps {
  images: ImageItem[];
  variant?: Variant;
  ImageComponent?: React.ComponentType<ImageComponentProps>;

  className?: string;
  imageClassName?: string;
  wrapperClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;
}

const DefaultImage: React.FC<ImageComponentProps> = ({
  src,
  alt,
  className,
  width,
  height,
  style,
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading="lazy"
    width={width}
    height={height}
    style={style}
  />
);

const getSpaceBetween = (): number => {
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [spaceBetween, setSpaceBetween] = useState(24);

  const isImmersive = variant === 'immersive';
  const total = images.length;
  const Img = ImageComponent ?? DefaultImage;

  useEffect(() => {
    const handleResize = () => setSpaceBetween(getSpaceBetween());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => swiperRef.current?.slideNext();
  const prev = () => swiperRef.current?.slidePrev();

  if (!images?.length) return null;

  return (
    <div
      data-testid="image-gallery"
      className={classNames(styles.gallery, styles[variant], className)}
    >
      <div className={styles.innerContainer}>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, A11y, Pagination]}
          slidesPerView={isImmersive ? 'auto' : 1}
          centeredSlides={isImmersive}
          spaceBetween={spaceBetween}
          loop={isImmersive}
          allowTouchMove
          autoHeight={false}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => {
            const i = isImmersive ? swiper.realIndex : swiper.activeIndex;
            setActiveIndex(i);
          }}
          className={styles.swiper}
        >
          {images.map((img, i) => {
            const width = img.width ?? 1080;
            const height = img.height ?? 720;

            return (
              <SwiperSlide key={i} className={styles.slide}>
                <div className={classNames(styles.imageWrapper, wrapperClassName)}>
                  <Img
                    src={img.src}
                    alt={img.altText}
                    className={classNames(styles.image, imageClassName)}
                    width={width}
                    height={height}
                  />

                  <div className={styles.mediaTag}>
                    <CameraFilledIcon color="on-dark-primary" size="medium" />
                    <span>
                      {(isImmersive ? activeIndex : i) + 1}/{total}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className={styles.bottomSection}>
          <div className={classNames(styles.caption, captionClassName)}>
            {images[activeIndex]?.caption}
            {images[activeIndex]?.credit && <> {images[activeIndex].credit}</>}
          </div>

          {total > 1 && (
            <div className={classNames(styles.controls, controlsClassName)}>
              <Button
                variant="ghost"
                size="medium"
                icon={<ChevronLeftIcon />}
                onClick={prev}
                isDisabled={!isImmersive && activeIndex === 0}
                className={styles.navButton}
                aria-label="Previous image"
              />
              <Button
                variant="ghost"
                size="medium"
                icon={<ChevronRightIcon />}
                onClick={next}
                isDisabled={!isImmersive && activeIndex === total - 1}
                className={styles.navButton}
                aria-label="Next image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';

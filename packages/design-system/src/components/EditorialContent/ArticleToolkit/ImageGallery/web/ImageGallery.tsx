import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import classNames from 'classnames';

import { Button } from '../../../../Button/web/Button';
import { Icon } from '@/components/Icon/Icon';

import styles from './ImageGallery.module.scss';

/**
 * Imagegallery variant props
 */
export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  src: string;
  altText: string;
  caption?: string;
  credit?: string;
}

/**
 * Props passed to a custom image renderer.
 */
export interface ImageComponentProps {
  src: string;
  alt: string;
  className?: string;
}

export interface ImageGalleryProps {
  images: ImageItem[];
  variant?: Variant;

  /**
   * Optional custom image renderer.
   * Example: next/image or picture component.
   */
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

/**
 * Default fallback image.
 */
const DefaultImage: React.FC<ImageComponentProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} loading="lazy" />
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

  const captionClassName = 'typography-utility-text-regular-x-small';
  const mediaTagClassName = 'typography-utility-label-semibold-large';

  return (
    <div
      className={classNames(styles.gallery, styles[variant])}
      data-testid="image-gallery"
      role="region"
      aria-label="Image gallery"
    >
      <div className={styles.innerContainer}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, A11y, Pagination, EffectCoverflow]}
          slidesPerView={isImmersive ? 'auto' : 1}
          centeredSlides={isImmersive}
          effect={isImmersive ? 'coverflow' : undefined}
          coverflowEffect={
            isImmersive
              ? { rotate: 0, stretch: 0, depth: 0, modifier: 1, slideShadows: true }
              : undefined
          }
          spaceBetween={spaceBetween}
          loop={isImmersive}
          allowTouchMove={false}
          grabCursor={false}
          watchSlidesProgress
          onSlideChange={(swiper) => {
            const i = isImmersive ? swiper.realIndex : swiper.activeIndex;
            setActiveIndex(i);
          }}
          className={styles.swiper}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              <div className={styles.imageWrapper}>
                <Img src={img.src} alt={img.altText} className={styles.image} />

                {(!isImmersive || i === activeIndex) && (
                  <div className={styles.mediaTag}>
                    <Icon name="camera-filled" size="medium" aria-hidden />
                    <span className={mediaTagClassName}>
                      {(isImmersive ? activeIndex : i) + 1}/{total}
                    </span>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.bottomSection}>
          <div className={classNames(captionClassName, styles.caption)}>
            {images[activeIndex]?.caption}
            {images[activeIndex]?.credit && <> {images[activeIndex].credit}</>}
          </div>

          {total > 1 && (
            <div className={styles.controls}>
              <Button
                variant="ghost"
                size="medium"
                icon="chevron-left"
                aria-label="Previous image"
                onClick={prev}
                isDisabled={!isImmersive && activeIndex === 0}
                className={styles.navButton}
              />

              <Button
                variant="ghost"
                size="medium"
                icon="chevron-right"
                aria-label="Next image"
                onClick={next}
                isDisabled={!isImmersive && activeIndex === total - 1}
                className={styles.navButton}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';

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
import { ChevronLeftIcon, ChevronRightIcon, CameraFilledIcon } from '@/icons';

import styles from './ImageGallery.module.scss';

export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  src: string;
  altText: string;
  caption?: string;
  credit?: string;
}

export interface ImageGalleryProps {
  images: ImageItem[];
  variant?: Variant;
}

const getSpaceBetween = (): number => {
  const width = window.innerWidth;
  if (width < 640) return 8;
  if (width < 1024) return 16;
  return 24;
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, variant = 'standard' }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [spaceBetween, setSpaceBetween] = useState(24);

  const isImmersive = variant === 'immersive';
  const total = images.length;

  useEffect(() => {
    const handleResize = () => setSpaceBetween(getSpaceBetween());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => swiperRef.current?.slideNext();
  const prev = () => swiperRef.current?.slidePrev();

  if (!images?.length) return null;

  return (
    <div className={classNames(styles.gallery, styles[variant])} data-testid="image-gallery">
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
              ? {
                  rotate: 0,
                  stretch: 0,
                  depth: 0,
                  modifier: 1,
                  slideShadows: true,
                }
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
                <img src={img.src} alt={img.altText} className={styles.image} />
                {/* Camera counter — show on all slides for standard, only active for immersive */}
                {(!isImmersive || i === activeIndex) && (
                  <div className={styles.mediaTag}>
                    <Icon component={CameraFilledIcon} size="x-small" />
                    {(isImmersive ? activeIndex : i) + 1}/{total}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* caption + controls */}
        <div className={styles.bottomSection}>
          <div className={styles.caption}>
            {images[activeIndex]?.caption}
            {images[activeIndex]?.credit && <> {images[activeIndex].credit}</>}
          </div>

          {total > 1 && (
            <div className={styles.controls}>
              <Button
                variant="ghost"
                size="small"
                icon={<ChevronLeftIcon />}
                aria-label="Previous image"
                onClick={prev}
                isDisabled={!isImmersive && activeIndex === 0}
              />
              <Button
                variant="ghost"
                size="small"
                icon={<ChevronRightIcon />}
                aria-label="Next image"
                onClick={next}
                isDisabled={!isImmersive && activeIndex === total - 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';

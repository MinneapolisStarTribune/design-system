'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import classNames from 'classnames';
import { Caption } from '@/index.web';

import { CameraFilledIcon } from '@/icons';
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

export const ImageGallery: React.FC<ImageGalleryProps<ImageProps>> = ({
  images,
  variant = 'standard',
  expandable = false,
  purchaseLink,
  ImageComponent,
  className,
  imageClassName,
  wrapperClassName,
  captionClassName,
  dataTestId = 'image-gallery',
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [currentImageProgress, setCurrentImageProgress] =
    useState<number>(1);

  const [expandedIndex, setExpandedIndex] =
    useState<number | null>(null);

  const [spaceBetween, setSpaceBetween] =
    useState<number>(getSpaceBetween);

  const isDialogOpen = expandedIndex !== null;
  const isImmersive = variant === 'immersive';
  const total = images.length;

  const activeImage = images[currentImageProgress - 1];
  const dialogImage = images[expandedIndex ?? 0];

  const normalizedCredit = activeImage?.credit
    ?.trim()
    .replace(/^\((.*)\)$/, '$1');

  const Img: React.ComponentType<ImageProps> =
    ImageComponent ?? DSImage;

  /**
   * Single resize listener (optimized + SSR safe)
   */
  useEffect(() => {
    const handleResize = (): void => {
      if (typeof window === 'undefined') return;

      setSpaceBetween(getSpaceBetween());
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  const onExpand = (
    index: number,
    el: HTMLButtonElement
  ): void => {
    lastTriggerRef.current = el;
    setExpandedIndex(index);
  };

  const onCloseDialog = (): void => {
    setExpandedIndex(null);
    lastTriggerRef.current?.focus();
  };

  const handleSlideChange = (
    swiper: SwiperType
  ): void => {
    const normalizedIndex = isImmersive
      ? swiper.realIndex
      : swiper.activeIndex;

    setCurrentImageProgress(normalizedIndex + 1);

    /**
     * Close lightbox if slide changes underneath
     */
    if (
      expandedIndex !== null &&
      expandedIndex !== normalizedIndex
    ) {
      onCloseDialog();
    }
  };

  const mediaTagTypography =
    'typography-utility-label-semibold-large';

  if (!images?.length) return null;

  return (
    <>
      <div
        data-testid={dataTestId}
        className={classNames(
          styles.gallery,
          styles[variant],
          className
        )}
      >
        <span
          aria-live="polite"
          aria-atomic="true"
          className={styles.srOnly}
        >
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
                console.warn(
                  'ImageGallery: missing altText for image',
                  img.src
                );
              }

              return (
                <SwiperSlide
                  key={`${img.src}-${index}`}
                  className={styles.slide}
                >
                  <div
                    className={classNames(
                      styles.imageWrapper,
                      wrapperClassName
                    )}
                    style={
                      img.width && img.height
                        ? {
                            aspectRatio: `${img.width} / ${img.height}`,
                          }
                        : undefined
                    }
                  >
                    <Img
                      src={img.src}
                      alt={img.altText}
                      imgixParams={img.imgixParams}
                      className={classNames(
                        styles.image,
                        imageClassName
                      )}
                      width={width}
                      height={height}
                      loading="lazy"
                      decoding="async"
                    />

                    {expandable && (
                      <ExpandButton
                        onClick={(e) =>
                          onExpand(
                            index,
                            e.currentTarget
                          )
                        }
                        ariaLabel={`Expand image ${
                          index + 1
                        } of ${total}`}
                        dataTestId={`${dataTestId}-expand-button-${index}`}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {!isImmersive && (
            <div className={styles.mediaTag}>
              <CameraFilledIcon
                color="on-dark-primary"
                size="medium"
              />
              <span className={mediaTagTypography}>
                {currentImageProgress}/{total}
              </span>
            </div>
          )}
        </div>

        <div className={styles.bottomSection}>
          <Caption
            caption={activeImage?.caption}
            credit={normalizedCredit}
            variant="inline"
            purchaseLink={
              purchaseLink
                ? {
                    link: purchaseLink,
                    label: 'Buy Reprint',
                  }
                : undefined
            }
            currentIndex={
              total > 1
                ? currentImageProgress
                : undefined
            }
            totalItems={
              total > 1 ? total : undefined
            }
            onPrevious={() =>
              swiperRef.current?.slidePrev()
            }
            onNext={() =>
              swiperRef.current?.slideNext()
            }
            className={classNames(
              styles.caption,
              captionClassName
            )}
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
          credit={dialogImage.credit}
          purchaseLink={purchaseLink}
          imgixParams={dialogImage.imgixParams}
          dialogRef={dialogRef}
          isOpen={isDialogOpen}
          onClose={onCloseDialog}
          dataTestId={`${dataTestId}-dialog`}
        />
      )}
    </>
  );
};

ImageGallery.displayName = 'ImageGallery';
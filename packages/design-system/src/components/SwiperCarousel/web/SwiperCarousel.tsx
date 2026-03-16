import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import classNames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';
import { Button } from '@/index.web';

import 'swiper/css';

import styles from './SwiperCarousel.module.scss';

export interface SwiperCarouselProps {
  children: React.ReactNode;
  pagination?: boolean;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  loop?: boolean;
  centeredSlides?: boolean;
  className?: string;
}

export const SwiperCarousel: React.FC<SwiperCarouselProps> = ({
  children,
  pagination = false,
  slidesPerView = 'auto',
  spaceBetween = 20,
  loop = false,
  centeredSlides = false,
  className,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const slides = useMemo(
    () =>
      React.Children.map(children, (child, i) => (
        <SwiperSlide key={i} className={styles.slide}>
          {child}
        </SwiperSlide>
      )) ?? [],
    [children]
  );

  const total = slides.length;

  const updateNavState = useCallback(
    (swiper: SwiperType) => {
      const index = loop ? swiper.realIndex : swiper.activeIndex;

      setActiveIndex(index);
      setCanPrev(!swiper.isBeginning);
      setCanNext(!swiper.isEnd);
    },
    [loop]
  );

  const prev = () => swiperRef.current?.slidePrev();
  const next = () => swiperRef.current?.slideNext();

  return (
    <div className={classNames(styles.root, className)}>
      <SwiperReact
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[A11y]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop}
        centeredSlides={centeredSlides}
        watchSlidesProgress
        observer
        observeParents
        onSlideChange={updateNavState}
        className={styles.swiper}
      >
        {slides}
      </SwiperReact>

      <div className={styles.bottom}>
        {pagination && (
          <div className={styles.dots}>
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                className={classNames(styles.dot, {
                  [styles.dotActive]: i === activeIndex,
                })}
                onClick={() => swiperRef.current?.slideTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className={styles.controls}>
          <Button
            variant="ghost"
            size="medium"
            icon={<ChevronLeftIcon />}
            aria-label="Previous"
            onClick={prev}
            isDisabled={!loop && !canPrev}
            className={styles.navButton}
          />

          <Button
            variant="ghost"
            size="medium"
            icon={<ChevronRightIcon />}
            aria-label="Next"
            onClick={next}
            isDisabled={!loop && !canNext}
            className={styles.navButton}
          />
        </div>
      </div>
    </div>
  );
};
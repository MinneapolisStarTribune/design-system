'use client';

import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Pagination as SwiperPagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

import classNames from 'classnames';

import { Button } from '@/index.web';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';

import { SwiperContext, useSwiperContext } from './SwiperCarousel.context';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

import type {
  SwiperCarouselProps,
  PaginationProps,
  NavigationProps,
  CarouselChild,
} from './SwiperCarousel.types';

import styles from './SwiperCarousel.module.scss';

/* ---------------- ROOT ---------------- */

const Root: React.FC<SwiperCarouselProps> = ({
  children,
  slidesPerView = 'auto',
  spaceBetween = 16,
  breakpoints,
  loop = false,
  centeredSlides = false,
  className,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);

  const allChildren = React.Children.toArray(children) as CarouselChild[];

  let firstSlideIndex = -1;

  allChildren.forEach((child, index) => {
    if (firstSlideIndex === -1 && child?.type?.displayName === 'SwiperSlideWrapper') {
      firstSlideIndex = index;
    }
  });

  const beforeSwiper = firstSlideIndex > -1 ? allChildren.slice(0, firstSlideIndex) : [];

  const slides = allChildren.filter((child) => child?.type?.displayName === 'SwiperSlideWrapper');

  const afterSwiper = allChildren
    .slice(firstSlideIndex)
    .filter((child) => child?.type?.displayName !== 'SwiperSlideWrapper');

  let paginationVariant: 'default' | 'custom' | null = null;

  allChildren.forEach((child) => {
    if (child?.type?.displayName === 'SwiperPagination') {
      paginationVariant = child.props?.variant ?? 'default';
    }
  });

  const contextValue = useMemo(
    () => ({
      swiper: swiperInstance,
      activeIndex,
      isBeginning,
      isEnd,
      totalSlides,
    }),
    [swiperInstance, activeIndex, isBeginning, isEnd, totalSlides]
  );

  return (
    <SwiperContext.Provider value={contextValue}>
      <div className={classNames(styles.container, className)}>
        {beforeSwiper}

        <Swiper
          modules={[A11y, SwiperPagination]}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          breakpoints={breakpoints}
          loop={loop}
          centeredSlides={centeredSlides}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            setTotalSlides(swiper.slides.length);
          }}
          onSlideChange={(swiper) => {
            const index = loop ? swiper.realIndex : swiper.activeIndex;
            setActiveIndex(index);
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          pagination={paginationVariant === 'default' ? { clickable: true } : false}
        >
          {slides}
        </Swiper>

        {afterSwiper}
      </div>
    </SwiperContext.Provider>
  );
};

/* ---------------- SLIDE ---------------- */

const Slide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SwiperSlide className={styles.slide}>{children}</SwiperSlide>
);

Slide.displayName = 'SwiperSlideWrapper';

/* ---------------- PAGINATION ---------------- */

const Pagination: React.FC<PaginationProps> = ({ variant = 'default' }) => {
  const { swiper, activeIndex, totalSlides } = useSwiperContext();

  if (variant === 'default') return null;
  if (!swiper || totalSlides <= 1) return null;

  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalSlides }).map((_, i) => (
        <span
          key={i}
          className={classNames(styles.dot, {
            [styles.active]: i === activeIndex,
          })}
          onClick={() => swiper.slideTo(i)}
        />
      ))}
    </div>
  );
};

Pagination.displayName = 'SwiperPagination';

/* ---------------- NAVIGATION ---------------- */

const NavigationComponent: React.FC<NavigationProps> = ({ className, size }) => {
  const { swiper, isBeginning, isEnd } = useSwiperContext();

  const resolvedSize = useResponsiveSize(size);

  if (!swiper) return null;

  return (
    <div className={classNames(styles.navigation, className)}>
      <Button
        variant="ghost"
        size={resolvedSize}
        icon={<ChevronLeftIcon />}
        onClick={() => swiper.slidePrev()}
        isDisabled={isBeginning}
        className={styles.navButton}
        aria-label="Previous slide"
      />

      <Button
        variant="ghost"
        size={resolvedSize}
        icon={<ChevronRightIcon />}
        onClick={() => swiper.slideNext()}
        isDisabled={isEnd}
        className={styles.navButton}
        aria-label="Next slide"
      />
    </div>
  );
};

NavigationComponent.displayName = 'SwiperNavigation';

/* ---------------- EXPORT ---------------- */

export const SwiperCarousel = Object.assign(Root, {
  Slide,
  Pagination,
  Navigation: NavigationComponent,
});

'use client';

import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import classNames from 'classnames';

import { Button } from '@/index.web';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';

import { SwiperContext, useSwiperContext } from './SwiperCarousel.context';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

import type { SwiperCarouselProps, NavigationProps, CarouselChild } from './SwiperCarousel.types';

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
  const [currentPage, setCurrentPage] = useState(0);
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

  const contextValue = useMemo(
    () => ({
      swiper: swiperInstance,
      activeIndex,
      isBeginning,
      isEnd,
      currentPage,
      totalSlides,
    }),
    [swiperInstance, activeIndex, isBeginning, isEnd, currentPage, totalSlides]
  );

  return (
    <SwiperContext.Provider value={contextValue}>
      <div className={classNames(styles.container, className)}>
        {beforeSwiper}

        <Swiper
          modules={[A11y]}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          breakpoints={breakpoints}
          loop={loop}
          centeredSlides={centeredSlides}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);

            const total = swiper.snapGrid.length;

            setTotalSlides(total);
            setCurrentPage(swiper.snapIndex);

            const isScrollable = total > 1;

            setIsBeginning(!isScrollable || swiper.snapIndex === 0);
            setIsEnd(!isScrollable || swiper.snapIndex === total - 1);
          }}
          onSlideChange={(swiper) => {
            const page = swiper.snapIndex;

            setCurrentPage(page);

            const total = swiper.snapGrid.length;

            setIsBeginning(page === 0);
            setIsEnd(page === total - 1);

            const index = loop ? swiper.realIndex : swiper.activeIndex;
            setActiveIndex(index);
          }}
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

const Pagination: React.FC = () => {
  const { swiper, currentPage, totalSlides } = useSwiperContext();

  if (!swiper || totalSlides <= 1) return null;

  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalSlides }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={classNames(styles.dot, {
            [styles.active]: i === currentPage,
          })}
          aria-label={`Go to slide ${i + 1} of ${totalSlides}`}
          aria-current={i === currentPage ? 'true' : undefined}
          onClick={() => swiper.slideTo(i)}
        />
      ))}
    </div>
  );
};

Pagination.displayName = 'SwiperPagination';

/* ---------------- NAVIGATION ---------------- */

const NavigationComponent: React.FC<NavigationProps> = ({
  className,
  size,
  buttonProps,
  prevButtonProps,
  nextButtonProps,
}) => {
  const { swiper, currentPage, totalSlides } = useSwiperContext();

  const responsiveSize = useResponsiveSize(size);
  const [autoSize, setAutoSize] = React.useState<'small' | 'large'>('large');

  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setAutoSize(window.innerWidth < 1024 ? 'small' : 'large');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const finalSize = size ? responsiveSize : autoSize;

  if (!swiper || totalSlides <= 1) return null;

  return (
    <div className={classNames(styles.navigation, className)}>
      <Button
        variant="ghost"
        size={finalSize}
        icon={<ChevronLeftIcon />}
        onClick={() => swiper.slidePrev()}
        isDisabled={currentPage === 0}
        className={styles.navButton}
        aria-label="Previous slide"
        {...buttonProps}
        {...prevButtonProps}
      />

      <Button
        variant="ghost"
        size={finalSize}
        icon={<ChevronRightIcon />}
        onClick={() => swiper.slideNext()}
        isDisabled={currentPage === totalSlides - 1}
        className={styles.navButton}
        aria-label="Next slide"
        {...buttonProps}
        {...nextButtonProps}
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

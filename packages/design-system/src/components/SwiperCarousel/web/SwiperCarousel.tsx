'use client';

import React, { useState, useMemo, useRef } from 'react';
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

import type { SwiperCarouselProps, NavigationProps, CarouselChild } from './SwiperCarousel.types';

import styles from './SwiperCarousel.module.scss';

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

  const paginationRef = useRef<HTMLDivElement | null>(null);

  // Swiper requires pagination element during render phase, but React lint disallows ref.current usage.
  // Using state via ref callback ensures element is available without violating lint rules.
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);

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

  const hasPagination = allChildren.some(
    (child) => child?.type?.displayName === 'SwiperPagination'
  );

  const contextValue = useMemo(
    () => ({
      swiper: swiperInstance,
      activeIndex,
      isBeginning,
      isEnd,
      currentPage,
      totalSlides,
      slidesPerView,
    }),
    [swiperInstance, activeIndex, isBeginning, isEnd, currentPage, totalSlides, slidesPerView]
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
          onBeforeInit={(swiper) => {
            if (paginationRef.current) {
              // @ts-expect-error Swiper types do not support assigning pagination.el at runtime
              swiper.params.pagination.el = paginationRef.current;
            }
          }}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);

            const total = swiper.snapGrid.length;

            setTotalSlides(total);
            setCurrentPage(swiper.snapIndex);

            const isScrollable = total > 1;

            setIsBeginning(!isScrollable || swiper.isBeginning);
            setIsEnd(!isScrollable || swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setCurrentPage(swiper.snapIndex);
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            const index = loop ? swiper.realIndex : swiper.activeIndex;
            setActiveIndex(index);
          }}
          pagination={
            hasPagination
              ? {
                  el: paginationEl,
                  clickable: true,
                }
              : false
          }
          onReachEnd={() => {
            setIsEnd(true);
          }}
          onFromEdge={(swiper) => {
            setIsEnd(swiper.isEnd);
            setIsBeginning(swiper.isBeginning);
          }}
          onResize={(swiper) => {
            setIsEnd(swiper.isEnd);
            setIsBeginning(swiper.isBeginning);
          }}
        >
          {slides}
        </Swiper>

        {hasPagination && (
          <div
            ref={(node) => {
              paginationRef.current = node;
              if (node && paginationEl !== node) {
                setPaginationEl(node);
              }
            }}
            className={styles.pagination}
          />
        )}

        {afterSwiper}
      </div>
    </SwiperContext.Provider>
  );
};

const Slide: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slidesPerView } = useSwiperContext();

  return (
    <SwiperSlide
      className={styles.slide}
      style={slidesPerView === 'auto' ? { width: 'auto' } : undefined} //To avoid swiper override issue
    >
      {children}
    </SwiperSlide>
  );
};

Slide.displayName = 'SwiperSlideWrapper';

const Pagination: React.FC = () => null;
Pagination.displayName = 'SwiperPagination';

const NavigationComponent: React.FC<NavigationProps> = ({
  className,
  size,
  buttonProps,
  prevButtonProps,
  nextButtonProps,
}) => {
  const { swiper, isBeginning, isEnd, totalSlides } = useSwiperContext();

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
        isDisabled={isBeginning}
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
        isDisabled={isEnd}
        className={styles.navButton}
        aria-label="Next slide"
        {...buttonProps}
        {...nextButtonProps}
      />
    </div>
  );
};

NavigationComponent.displayName = 'SwiperNavigation';

export const SwiperCarousel = Object.assign(Root, {
  Slide,
  Pagination,
  Navigation: NavigationComponent,
});

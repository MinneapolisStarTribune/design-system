import { createContext, useContext } from 'react';
import type { Swiper as SwiperType } from 'swiper';

export interface SwiperContextType {
  swiper: SwiperType | null;
  activeIndex: number;
  isBeginning: boolean;
  isEnd: boolean;
  currentPage: number;
  totalSlides: number;
}

export const SwiperContext = createContext<SwiperContextType | null>(null);

export const useSwiperContext = () => {
  const ctx = useContext(SwiperContext);
  if (!ctx) {
    throw new Error('useSwiperContext must be used within SwiperCarousel');
  }
  return ctx;
};

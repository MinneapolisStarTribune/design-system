import { createContext, useContext } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface SwiperContextType {
  swiper: SwiperType | null;
  activeIndex: number;
  isBeginning: boolean;
  isEnd: boolean;
  totalSlides: number;
}

export const SwiperContext = createContext<SwiperContextType>({
  swiper: null,
  activeIndex: 0,
  isBeginning: true,
  isEnd: false,
  totalSlides: 0,
});

export const useSwiperContext = () => useContext(SwiperContext);

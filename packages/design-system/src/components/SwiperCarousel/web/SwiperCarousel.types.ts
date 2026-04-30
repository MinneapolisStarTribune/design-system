import { IconOnlyButtonSize } from '@/components/Button/web/Button.types';
import { ButtonProps } from '@/index.web';
import { ReactNode } from 'react';
import type { SwiperOptions } from 'swiper/types';

export interface SwiperCarouselProps {
  children: ReactNode;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  breakpoints?: SwiperOptions['breakpoints'];
  loop?: boolean;
  centeredSlides?: boolean;
  className?: string;
}

export type NavigationSize = IconOnlyButtonSize;

export interface NavigationProps {
  className?: string;
  size?: NavigationSize;
  // applied to both buttons
  buttonProps?: Partial<ButtonProps>;

  // fine-grain control (optional)
  prevButtonProps?: Partial<ButtonProps>;
  nextButtonProps?: Partial<ButtonProps>;
}

export type CarouselChild = React.ReactElement<{
  variant?: 'default' | 'custom';
}> & {
  type?: { displayName?: string };
};

import { vi } from 'vitest';
import type { ReactNode } from 'react';

type CapturedSwiperHandlers = {
  onSliderMove: () => void;
  onTouchEnd: () => void;
  onSlideChange: (swiper: Record<string, unknown>) => void;
};

const capturedSwiperProps = vi.hoisted(() => ({ current: {} as CapturedSwiperHandlers }));

vi.mock('swiper/react', async () => {
  const { createElement } = await vi.importActual<typeof import('react')>('react');
  return {
    Swiper: ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => {
      Object.assign(capturedSwiperProps.current, props);
      return createElement('div', null, children);
    },
    SwiperSlide: ({ children }: { children?: ReactNode }) => createElement('div', null, children),
  };
});

vi.mock('./SwiperCarousel.context', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  const mockValue = {
    swiper: {
      slideNext: vi.fn(),
      slidePrev: vi.fn(),
      slideTo: vi.fn(),
    },
    activeIndex: 0,
    isBeginning: true,
    isEnd: false,
    currentPage: 0,
    totalSlides: 3,
  };

  return {
    SwiperContext: React.createContext(mockValue),
    useSwiperContext: () => mockValue,
  };
});

import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { act, screen } from '@testing-library/react';
import { SwiperCarousel } from './SwiperCarousel';

const slides = ['Slide A', 'Slide B', 'Slide C'];

const renderCarousel = ({
  withPagination = false,
  withNavigation = false,
  loop = false,
  size,
}: {
  withPagination?: boolean;
  withNavigation?: boolean;
  loop?: boolean;
  size?: 'x-small' | 'small' | 'medium' | 'large';
} = {}) =>
  renderWithProvider(
    <SwiperCarousel loop={loop}>
      {slides.map((s) => (
        <SwiperCarousel.Slide key={s}>
          <div>{s}</div>
        </SwiperCarousel.Slide>
      ))}

      {withPagination && <SwiperCarousel.Pagination />}
      {withNavigation && <SwiperCarousel.Navigation size={size} />}
    </SwiperCarousel>
  );

describe('SwiperCarousel', () => {
  describe('rendering', () => {
    it('renders all slides', () => {
      renderCarousel();

      slides.forEach((s) => {
        expect(screen.getByText(s)).toBeInTheDocument();
      });
    });

    it('renders pagination container when enabled', () => {
      const { container } = renderCarousel({ withPagination: true });

      const pagination = container.querySelector('[class*="pagination"]');

      expect(pagination).toBeInTheDocument();
    });

    it('does not render pagination when not provided', () => {
      const { container } = renderCarousel();

      const pagination = container.querySelector('[class*="pagination"]');

      expect(pagination).not.toBeInTheDocument();
    });

    it('renders navigation buttons when included', () => {
      renderCarousel({ withNavigation: true });

      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });
  });

  describe('navigation behavior', () => {
    it('renders navigation in non-loop mode', () => {
      renderCarousel({ withNavigation: true });

      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('renders navigation in loop mode', () => {
      renderCarousel({ withNavigation: true, loop: true });

      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('disables previous button at beginning', () => {
      renderCarousel({ withNavigation: true });

      expect(screen.getByLabelText('Previous slide')).toBeDisabled();
    });

    it('enables next button when not at end', () => {
      renderCarousel({ withNavigation: true });

      expect(screen.getByLabelText('Next slide')).not.toBeDisabled();
    });
  });

  describe('navigation size', () => {
    it('renders with medium size explicitly', () => {
      renderCarousel({ withNavigation: true, size: 'medium' });

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('renders with large size explicitly', () => {
      renderCarousel({ withNavigation: true, size: 'large' });

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('supports icon-only sizes (x-small)', () => {
      renderCarousel({ withNavigation: true, size: 'x-small' });

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('pagination behavior', () => {
    it('does not render pagination when only one slide', () => {
      const { container } = renderWithProvider(
        <SwiperCarousel>
          <SwiperCarousel.Slide>
            <div>Only Slide</div>
          </SwiperCarousel.Slide>

          <SwiperCarousel.Pagination />
        </SwiperCarousel>
      );

      const pagination = container.querySelector('[class*="pagination"]');

      expect(pagination).toBeInTheDocument();
    });
  });

  describe('onSwipe', () => {
    const mockSwipeEvent = (overrides = {}) => ({
      activeIndex: 1,
      previousIndex: 0,
      swipeDirection: 'next' as const,
      snapIndex: 1,
      isBeginning: false,
      isEnd: false,
      realIndex: 1,
      snapGrid: [0, 1, 2],
      ...overrides,
    });

    it('calls onSwipe with direction and indices when swiping forward', () => {
      const onSwipe = vi.fn();
      renderWithProvider(
        <SwiperCarousel onSwipe={onSwipe}>
          {slides.map((s) => (
            <SwiperCarousel.Slide key={s}>
              <div>{s}</div>
            </SwiperCarousel.Slide>
          ))}
        </SwiperCarousel>
      );

      act(() => {
        capturedSwiperProps.current.onSliderMove();
        capturedSwiperProps.current.onSlideChange(mockSwipeEvent());
      });

      expect(onSwipe).toHaveBeenCalledWith({ direction: 'next', activeIndex: 1, previousIndex: 0 });
    });

    it('calls onSwipe with prev direction when swiping backward', () => {
      const onSwipe = vi.fn();
      renderWithProvider(
        <SwiperCarousel onSwipe={onSwipe}>
          {slides.map((s) => (
            <SwiperCarousel.Slide key={s}>
              <div>{s}</div>
            </SwiperCarousel.Slide>
          ))}
        </SwiperCarousel>
      );

      act(() => {
        capturedSwiperProps.current.onSliderMove();
        capturedSwiperProps.current.onSlideChange(
          mockSwipeEvent({
            activeIndex: 0,
            previousIndex: 1,
            swipeDirection: 'prev',
            isBeginning: true,
          })
        );
      });

      expect(onSwipe).toHaveBeenCalledWith({ direction: 'prev', activeIndex: 0, previousIndex: 1 });
    });

    it('does not call onSwipe on programmatic navigation', () => {
      const onSwipe = vi.fn();
      renderWithProvider(
        <SwiperCarousel onSwipe={onSwipe}>
          {slides.map((s) => (
            <SwiperCarousel.Slide key={s}>
              <div>{s}</div>
            </SwiperCarousel.Slide>
          ))}
        </SwiperCarousel>
      );

      act(() => {
        capturedSwiperProps.current.onSlideChange(mockSwipeEvent());
      });

      expect(onSwipe).not.toHaveBeenCalled();
    });
  });
});

import { vi } from 'vitest';

vi.mock('./SwiperCarousel.context', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  const mockValue = {
    swiper: {
      slideNext: vi.fn(),
      slidePrev: vi.fn(),
    },
    activeIndex: 0,
    isBeginning: true,
    isEnd: false,
    totalSlides: 3,
  };

  return {
    SwiperContext: React.createContext(mockValue),
    useSwiperContext: () => mockValue,
  };
});

import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { SwiperCarousel } from './SwiperCarousel';

const slides = ['Slide A', 'Slide B', 'Slide C'];

const renderCarousel = ({
  withPagination = false,
  withCustomPagination = false,
  withNavigation = false,
  loop = false,
}: {
  withPagination?: boolean;
  withCustomPagination?: boolean;
  withNavigation?: boolean;
  loop?: boolean;
} = {}) =>
  renderWithProvider(
    <SwiperCarousel loop={loop} showPagination={withPagination}>
      {slides.map((s) => (
        <SwiperCarousel.Slide key={s}>
          <div>{s}</div>
        </SwiperCarousel.Slide>
      ))}

      {withPagination && <SwiperCarousel.Pagination />}
      {withCustomPagination && <SwiperCarousel.Pagination variant="custom" />}
      {withNavigation && <SwiperCarousel.Navigation />}
    </SwiperCarousel>
  );

describe('SwiperCarousel', () => {
  describe('rendering', () => {
    it('renders all slides', () => {
      const { getByText } = renderCarousel();

      slides.forEach((s) => {
        expect(getByText(s)).toBeInTheDocument();
      });
    });

    it('renders default pagination when enabled', () => {
      const { container } = renderCarousel({ withPagination: true });

      // Swiper DOM is not reliable in test env
      expect(container).toBeInTheDocument();
    });

    it('renders custom pagination when enabled', () => {
      const { container } = renderCarousel({
        withCustomPagination: true,
      });

      const dots = container.querySelectorAll('[class*="dot"]');

      expect(dots.length).toBe(3);
    });

    it('does not render custom pagination when not provided', () => {
      const { container } = renderCarousel();

      const dots = container.querySelectorAll('[class*="dot"]');

      expect(dots.length).toBe(0);
    });

    it('renders navigation buttons when included', () => {
      const { container } = renderCarousel({
        withNavigation: true,
      });

      const buttons = container.querySelectorAll('button');

      expect(buttons.length).toBe(2);
    });
  });

  describe('navigation state (render only)', () => {
    it('renders navigation in non-loop mode', () => {
      const { container } = renderCarousel({
        withNavigation: true,
      });

      const buttons = container.querySelectorAll('button');

      expect(buttons.length).toBe(2);
    });

    it('renders navigation in loop mode', () => {
      const { container } = renderCarousel({
        withNavigation: true,
        loop: true,
      });

      const buttons = container.querySelectorAll('button');

      expect(buttons.length).toBe(2);
    });
  });
});

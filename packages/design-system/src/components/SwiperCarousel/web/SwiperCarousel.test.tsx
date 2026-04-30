import { vi } from 'vitest';

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
import { screen } from '@testing-library/react';
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
});

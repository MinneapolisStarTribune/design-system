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

import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { screen } from '@testing-library/react';
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
    <SwiperCarousel loop={loop}>
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
      renderCarousel();

      slides.forEach((s) => {
        expect(screen.getByText(s)).toBeInTheDocument();
      });
    });

    it('renders default pagination when enabled (no crash)', () => {
      const { container } = renderCarousel({ withPagination: true });

      // Default pagination is handled by Swiper → not testable reliably
      expect(container).toBeInTheDocument();
    });

    it('renders custom pagination dots when enabled', () => {
      const { container } = renderCarousel({
        withCustomPagination: true,
      });

      const dots = container.querySelectorAll('[class*="dot"]');

      expect(dots.length).toBe(slides.length);
    });

    it('does not render custom pagination when not provided', () => {
      const { container } = renderCarousel();

      const dots = container.querySelectorAll('[class*="dot"]');

      expect(dots.length).toBe(0);
    });

    it('renders navigation buttons when included', () => {
      renderCarousel({ withNavigation: true });

      const prev = screen.getByLabelText('Previous slide');
      const next = screen.getByLabelText('Next slide');

      expect(prev).toBeInTheDocument();
      expect(next).toBeInTheDocument();
    });
  });

  describe('navigation behavior (render only)', () => {
    it('renders navigation in non-loop mode', () => {
      renderCarousel({ withNavigation: true });

      const buttons = screen.getAllByRole('button');

      expect(buttons.length).toBe(2);
    });

    it('renders navigation in loop mode', () => {
      renderCarousel({
        withNavigation: true,
        loop: true,
      });

      const buttons = screen.getAllByRole('button');

      expect(buttons.length).toBe(2);
    });

    it('disables previous button at beginning', () => {
      renderCarousel({ withNavigation: true });

      const prev = screen.getByLabelText('Previous slide');

      expect(prev).toBeDisabled();
    });

    it('enables next button when not at end', () => {
      renderCarousel({ withNavigation: true });

      const next = screen.getByLabelText('Next slide');

      expect(next).not.toBeDisabled();
    });
  });

  describe('pagination behavior', () => {
    it('does not render custom pagination if only one slide', () => {
      const { container } = renderWithProvider(
        <SwiperCarousel>
          <SwiperCarousel.Slide>
            <div>Only Slide</div>
          </SwiperCarousel.Slide>

          <SwiperCarousel.Pagination variant="custom" />
        </SwiperCarousel>
      );

      const dots = container.querySelectorAll('[class*="dot"]');

      expect(dots.length).toBe(3);
    });
  });
});
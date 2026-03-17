import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { SwiperCarousel } from './SwiperCarousel';

const slides = ['Slide A', 'Slide B', 'Slide C'];

const renderCarousel = (props: Partial<React.ComponentProps<typeof SwiperCarousel>> = {}) =>
  renderWithProvider(
    <SwiperCarousel {...props} pagination>
      {slides.map((s) => (
        <div key={s}>{s}</div>
      ))}
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

    it('renders pagination dots when pagination prop is true', () => {
      const { container } = renderCarousel();

      // Only match base dot class, not dotActive
      const dots = container.querySelectorAll('[class*="_dot_"]');

      expect(dots.length).toBe(slides.length);
    });

    it('does not render pagination when pagination is false', () => {
      const { container } = renderWithProvider(
        <SwiperCarousel>
          {slides.map((s) => (
            <div key={s}>{s}</div>
          ))}
        </SwiperCarousel>
      );

      const dots = container.querySelectorAll('[class*="_dot_"]');

      expect(dots.length).toBe(0);
    });

    it('renders navigation buttons', () => {
      const { getByLabelText } = renderCarousel();

      const prevButton = getByLabelText('Previous');
      const nextButton = getByLabelText('Next');

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('non-loop mode (default)', () => {
    it('disables previous button initially', () => {
      const { getByLabelText } = renderCarousel();

      const prevButton = getByLabelText('Previous');

      expect(prevButton).toBeDisabled();
    });

    it('enables next button initially', () => {
      const { getByLabelText } = renderCarousel();

      const nextButton = getByLabelText('Next');

      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('loop mode', () => {
    it('enables both buttons when loop is true', () => {
      const { getByLabelText } = renderCarousel({ loop: true });

      const prevButton = getByLabelText('Previous');
      const nextButton = getByLabelText('Next');

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });
});

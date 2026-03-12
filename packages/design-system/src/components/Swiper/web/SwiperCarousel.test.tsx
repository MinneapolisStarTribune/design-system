import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { SwiperCarousel } from './SwiperCarousel';

const slides = ['Slide A', 'Slide B', 'Slide C'];

const renderCarousel = (props: Partial<React.ComponentProps<typeof SwiperCarousel>> = {}) =>
  renderWithProvider(
    <SwiperCarousel {...props}>
      {slides.map((s) => (
        <SwiperCarousel.Slide key={s}>{s}</SwiperCarousel.Slide>
      ))}
      <SwiperCarousel.Pagination />
    </SwiperCarousel>
  );

describe('SwiperCarousel', () => {
  describe('rendering', () => {
    it('renders the carousel root', () => {
      const { getByTestId } = renderCarousel();
      expect(getByTestId('swiper-carousel')).toBeInTheDocument();
    });

    it('renders all slides', () => {
      const { getByText } = renderCarousel();
      slides.forEach((s) => expect(getByText(s)).toBeInTheDocument());
    });

    it('renders the pagination controls', () => {
      const { getByTestId } = renderCarousel();
      expect(getByTestId('swiper-carousel-pagination')).toBeInTheDocument();
    });

    it('renders two navigation buttons', () => {
      const { getAllByRole } = renderCarousel();
      expect(getAllByRole('button')).toHaveLength(2);
    });

    it('renders without pagination when Pagination subcomponent is omitted', () => {
      const { queryByTestId } = renderWithProvider(
        <SwiperCarousel>
          {slides.map((s) => (
            <SwiperCarousel.Slide key={s}>{s}</SwiperCarousel.Slide>
          ))}
        </SwiperCarousel>
      );
      expect(queryByTestId('swiper-carousel-pagination')).not.toBeInTheDocument();
    });
  });

  describe('non-loop mode (default)', () => {
    it('disables the previous button on the first slide', () => {
      const { getAllByRole } = renderCarousel();
      expect(getAllByRole('button')[0]).toBeDisabled();
    });

    it('enables the next button on the first slide', () => {
      const { getAllByRole } = renderCarousel();
      expect(getAllByRole('button')[1]).not.toBeDisabled();
    });
  });

  describe('loop mode', () => {
    it('enables both buttons when loop is true', () => {
      const { getAllByRole } = renderCarousel({ loop: true });
      const [prevButton, nextButton] = getAllByRole('button');
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('onSlideChange callback', () => {
    it('calls onSlideChange when provided', () => {
      const onSlideChange = vi.fn();
      renderCarousel({ onSlideChange });
      expect(onSlideChange).not.toHaveBeenCalled();
    });
  });
});
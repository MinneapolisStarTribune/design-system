import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { SwiperCarousel } from './SwiperCarousel';

const slides = ['Slide A', 'Slide B', 'Slide C'];

describe('SwiperCarousel Accessibility', () => {
  it('has no accessibility violations (default)', async () => {
    await expectNoA11yViolations(
      <SwiperCarousel>
        {slides.map((s) => (
          <SwiperCarousel.Slide key={s}>
            <div>{s}</div>
          </SwiperCarousel.Slide>
        ))}
      </SwiperCarousel>
    );
  });

  it('has no accessibility violations with navigation', async () => {
    await expectNoA11yViolations(
      <SwiperCarousel>
        {slides.map((s) => (
          <SwiperCarousel.Slide key={s}>
            <div>{s}</div>
          </SwiperCarousel.Slide>
        ))}
        <SwiperCarousel.Navigation />
      </SwiperCarousel>
    );
  });

  it('has no accessibility violations with pagination', async () => {
    await expectNoA11yViolations(
      <SwiperCarousel>
        {slides.map((s) => (
          <SwiperCarousel.Slide key={s}>
            <div>{s}</div>
          </SwiperCarousel.Slide>
        ))}
        <SwiperCarousel.Pagination />
      </SwiperCarousel>
    );
  });

  it('has no accessibility violations with navigation size variations', async () => {
    await expectNoA11yViolations(
      <SwiperCarousel>
        {slides.map((s) => (
          <SwiperCarousel.Slide key={s}>
            <div>{s}</div>
          </SwiperCarousel.Slide>
        ))}
        <SwiperCarousel.Navigation size="small" />
      </SwiperCarousel>
    );
  });
});

import type { Meta, StoryObj } from '@storybook/react';
import { SwiperCarousel } from './SwiperCarousel';

const meta: Meta<typeof SwiperCarousel> = {
  title: 'Components/SwiperCarousel',
  component: SwiperCarousel,
};

export default meta;
type Story = StoryObj<typeof SwiperCarousel>;

const SAMPLE_SLIDES = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4'];

const PlaceholderSlide = ({ label }: { label: string }) => (
  <div
    style={{
      background: '#f0f0f0',
      borderRadius: 8,
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);

/** Default — single slide in view, pagination controls, no loop. */
export const Default: Story = {
  render: () => (
    <SwiperCarousel>
      {SAMPLE_SLIDES.map((s) => (
        <SwiperCarousel.Slide key={s}>
          <PlaceholderSlide label={s} />
        </SwiperCarousel.Slide>
      ))}
      <SwiperCarousel.Pagination />
    </SwiperCarousel>
  ),
};

/** Auto width — slides size themselves via CSS, neighbours peek in. */
export const AutoWidth: Story = {
  render: () => (
    <SwiperCarousel slidesPerView="auto">
      {SAMPLE_SLIDES.map((s) => (
        <SwiperCarousel.Slide key={s} className="w-64">
          <PlaceholderSlide label={s} />
        </SwiperCarousel.Slide>
      ))}
      <SwiperCarousel.Pagination />
    </SwiperCarousel>
  ),
};

/** Loop — infinite navigation, both buttons always enabled. */
export const Loop: Story = {
  render: () => (
    <SwiperCarousel loop>
      {SAMPLE_SLIDES.map((s) => (
        <SwiperCarousel.Slide key={s}>
          <PlaceholderSlide label={s} />
        </SwiperCarousel.Slide>
      ))}
      <SwiperCarousel.Pagination />
    </SwiperCarousel>
  ),
};

/** Coverflow — centred active slide with coverflow effect and loop. */
export const Coverflow: Story = {
  render: () => (
    <SwiperCarousel loop centeredSlides slidesPerView="auto" effect="coverflow">
      {SAMPLE_SLIDES.map((s) => (
        <SwiperCarousel.Slide key={s} className="w-80">
          <PlaceholderSlide label={s} />
        </SwiperCarousel.Slide>
      ))}
      <SwiperCarousel.Pagination />
    </SwiperCarousel>
  ),
};

/** No controls — carousel without the Pagination subcomponent. */
export const NoControls: Story = {
  render: () => (
    <SwiperCarousel slidesPerView="auto">
      {SAMPLE_SLIDES.map((s) => (
        <SwiperCarousel.Slide key={s} className="w-64">
          <PlaceholderSlide label={s} />
        </SwiperCarousel.Slide>
      ))}
    </SwiperCarousel>
  ),
};
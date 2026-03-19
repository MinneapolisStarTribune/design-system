import type { Meta, StoryObj } from '@storybook/react-vite';

import { SwiperCarousel } from './SwiperCarousel';

const meta: Meta<typeof SwiperCarousel> = {
  title: 'Components/SwiperCarousel',
  component: SwiperCarousel,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof SwiperCarousel>;

const DemoCard = ({ index }: { index: number }) => (
  <div
    style={{
      width: 240,
      height: 140,
      border: '1px solid #e5e5e5',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      fontWeight: 600,
    }}
  >
    Card {index}
  </div>
);

const items = Array.from({ length: 6 }, (_, i) => i + 1);

/**
 * Default carousel
 *
 * - Uses Swiper native pagination
 * - No navigation
 */
export const Default: Story = {
  render: () => (
    <div>
      <SwiperCarousel slidesPerView="auto" spaceBetween={16}>
        {items.map((i) => (
          <SwiperCarousel.Slide key={i}>
            <DemoCard index={i} />
          </SwiperCarousel.Slide>
        ))}
        <SwiperCarousel.Pagination variant="default" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Captions</span>
          <SwiperCarousel.Navigation />
        </div>
      </SwiperCarousel>
    </div>
  ),
};

/**
 * Custom Pagination (Figma style)
 *
 * - Uses span-based pagination
 */
export const CustomPagination: Story = {
  render: () => (
    <div>
      <SwiperCarousel slidesPerView="auto" spaceBetween={16} loop>
        {items.map((i) => (
          <SwiperCarousel.Slide key={i}>
            <DemoCard index={i} />
          </SwiperCarousel.Slide>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <SwiperCarousel.Pagination variant="custom" />
          </div>
          <SwiperCarousel.Navigation />
        </div>
      </SwiperCarousel>
    </div>
  ),
};

/**
 * With Navigation
 *
 * - Uses DS Button internally
 * - Responsive sizes
 */
export const NoPagination: Story = {
  render: () => (
    <div>
      <SwiperCarousel slidesPerView="auto" spaceBetween={16}>
        {items.map((i) => (
          <SwiperCarousel.Slide key={i}>
            <DemoCard index={i} />
          </SwiperCarousel.Slide>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Captions</span>
          <SwiperCarousel.Navigation />
        </div>
      </SwiperCarousel>
    </div>
  ),
};

/**
 * Image Gallery — Standard (Single Slide)
 *
 * - Shows one image at a time
 * - Uses default swiper pagination (dots)
 * - Supports caption + navigation layout
 */
export const ImageGalleryStandard: Story = {
  render: () => (
    <SwiperCarousel slidesPerView={1} spaceBetween={0}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <div
            style={{
              width: '100%',
              height: 300,
              background: '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            Image {i}
          </div>
        </SwiperCarousel.Slide>
      ))}

      {/* default pagination */}
      <SwiperCarousel.Pagination />

      {/* bottom section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <span>Image caption goes here</span>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
};

/**
 * Layout — Top Controls (TheLatest)
 *
 * - Title on left
 * - Navigation on right
 * - Controls placed ABOVE the carousel
 * - No pagination
 */
export const Layout_TopControls: Story = {
  render: () => (
    <SwiperCarousel slidesPerView="auto" spaceBetween={16}>
      {/* 🔥 TOP SECTION INSIDE */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>The Latest</div>
        <SwiperCarousel.Navigation />
      </div>

      {/* slides */}
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}
    </SwiperCarousel>
  ),
};

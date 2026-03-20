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
 * Default carousel with pagination
 */
export const Default: Story = {
  render: () => (
    <SwiperCarousel slidesPerView="auto" spaceBetween={16} showPagination>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <SwiperCarousel.Pagination />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Captions</span>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
};

/**
 * Custom pagination centered with navigation
 */
export const CustomPagination: Story = {
  render: () => (
    <SwiperCarousel slidesPerView="auto" spaceBetween={16} loop>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <SwiperCarousel.Pagination variant="custom" />
        </div>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
};

/**
 * No pagination with navigation
 */
export const NoPagination: Story = {
  render: () => (
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
  ),
};

/**
 * Image gallery (single slide view)
 */
export const ImageGalleryStandard: Story = {
  render: () => (
    <SwiperCarousel slidesPerView={1} spaceBetween={0} showPagination>
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

      <SwiperCarousel.Pagination />

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
 * Top controls layout
 */
export const Layout_TopControls: Story = {
  render: () => (
    <SwiperCarousel slidesPerView="auto" spaceBetween={16}>
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

      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}
    </SwiperCarousel>
  ),
};

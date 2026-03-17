import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwiperCarousel } from './SwiperCarousel';

const meta: Meta<typeof SwiperCarousel> = {
  title: 'Components/SwiperCarousel',
  component: SwiperCarousel,
};

export default meta;

type Story = StoryObj<typeof SwiperCarousel>;

const Card = ({ label }: { label: string }) => (
  <div
    style={{
      width: 260,
      height: 200,
      borderRadius: 12,
      border: '1px solid #e5e5e5',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);

export const CardsLayout: Story = {
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <SwiperCarousel slidesPerView="auto" spaceBetween={20} pagination>
        <Card label="Slide 1" />
        <Card label="Slide 2" />
        <Card label="Slide 3" />
        <Card label="Slide 4" />
        <Card label="Slide 5" />
      </SwiperCarousel>
    </div>
  ),
};

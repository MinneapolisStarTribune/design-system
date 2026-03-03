import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoLayout, PhotoLayoutProps } from './PhotoLayout';
import { LAYOUT_IMAGE_COUNT } from './utils';

const meta: Meta<PhotoLayoutProps> = {
  title: 'Editorial Content/Article Toolkit/Photo Layout',
  component: PhotoLayout,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    photoLayout: {
      control: 'select',
      options: Object.keys(LAYOUT_IMAGE_COUNT),
      description: 'Photo layout grid type: 2-up, 3-up, or 4-up.',
    },
    variant: {
      control: 'select',
      options: ['immersive'],
      description: 'Article body variant: standard or immersive.',
    },
  },
};

export default meta;

type Story = StoryObj<PhotoLayoutProps>;

const images = [
  {
    src: 'https://picsum.photos/id/1018/1200/800',
    altText: 'House exterior',
  },
  {
    src: 'https://picsum.photos/id/1015/1200/800',
    altText: 'Driveway',
  },
  {
    src: 'https://picsum.photos/id/1019/1200/800',
    altText: 'Backyard',
  },
  {
    src: 'https://picsum.photos/id/1020/1200/800',
    altText: 'Interior',
  },
];

export const Configurable: Story = {
  args: {
    imageList: images,
    photoLayout: '2up',
    photoLayoutCaption: '2-up layout with 2 images',
    variant: 'immersive',
  },
};

export const AllLayouts: Story = {
  args: {
    imageList: images,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {Object.entries(LAYOUT_IMAGE_COUNT).map(([layout, count]) => (
        <div key={layout}>
          <h3 style={{ marginBottom: '0.5rem' }}>{layout.toUpperCase()} Layout</h3>
          <PhotoLayout
            imageList={images.slice(0, count)}
            photoLayout={layout as PhotoLayoutProps['photoLayout']}
            photoLayoutCaption={`${count}-up immersive layout showcasing ${count} related visuals arranged in a structured grid format.`}
          />
        </div>
      ))}
    </div>
  ),
};

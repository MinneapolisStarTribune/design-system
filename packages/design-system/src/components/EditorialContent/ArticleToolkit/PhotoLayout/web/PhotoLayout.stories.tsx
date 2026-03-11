import type { Meta, StoryObj } from '@storybook/react-vite';
import { layoutImageCount, PhotoLayout } from './PhotoLayout';
import type { PhotoLayoutProps } from '../PhotoLayout.types';

const meta: Meta<PhotoLayoutProps> = {
  title: 'Editorial Content/Article Toolkit/Photo Layout',
  component: PhotoLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    photoLayout: {
      control: 'select',
      options: Object.keys(layoutImageCount),
      description: 'Photo layout grid type: 2-up, 3-up, or 4-up.',
    },
    variant: {
      control: 'select',
      options: ['immersive'],
      description: 'Article body variant: standard or immersive.',
    },
    expandable: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<PhotoLayoutProps>;

const images = [
  {
    src: 'https://picsum.photos/id/1018/1200/800',
    altText: 'Image 1',
  },
  {
    src: 'https://picsum.photos/id/1015/1200/800',
    altText: 'Image 2',
  },
  {
    src: 'https://picsum.photos/id/1019/1200/800',
    altText: 'Image 3',
  },
  {
    src: 'https://picsum.photos/id/1020/1200/800',
    altText: 'Image 4',
  },
];

export const Configurable: Story = {
  args: {
    imageList: images,
    photoLayout: '2up',
    caption: '2-up layout with 2 images',
    imageCredit: 'Star Tribune staff/The Minnesota Star Tribune',
    variant: 'immersive',
    expandable: false,
  },
};

export const AllLevels: Story = {
  args: {
    imageList: images,
    expandable: true,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {Object.entries(layoutImageCount).map(([layout, count]) => (
        <div key={layout}>
          <h3 style={{ marginBottom: '0.5rem' }}>{layout.toUpperCase()} Layout</h3>
          <PhotoLayout
            imageList={images}
            photoLayout={layout as PhotoLayoutProps['photoLayout']}
            caption={`${count}-up immersive layout showcasing ${count} related visuals arranged in a structured grid format.`}
            variant="immersive"
            imageCredit="Star Tribune staff/The Minnesota Star Tribune"
          />
        </div>
      ))}
    </div>
  ),
};

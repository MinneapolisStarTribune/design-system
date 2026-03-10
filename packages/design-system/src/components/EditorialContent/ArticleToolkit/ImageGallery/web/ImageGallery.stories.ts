import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';

const meta: Meta<typeof ImageGallery> = {
  title: 'ArticleToolkit/ImageGallery',
  component: ImageGallery,
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

const images = [
  {
    src: 'https://picsum.photos/1080/720?1',
    altText: 'Image 1',
    caption: 'A beautiful landscape captured during sunset.',
    credit: '(Photo: Star Tribune)',
  },
  {
    src: 'https://picsum.photos/1080/720?2',
    altText: 'Image 2',
    caption: 'City skyline view from the riverfront.',
    credit: '(Photo: Star Tribune)',
  },
  {
    src: 'https://picsum.photos/1080/720?3',
    altText: 'Image 3',
    caption: 'Early morning light over the mountains.',
    credit: '(Photo: Star Tribune)',
  },
  {
    src: 'https://picsum.photos/1080/720?4',
    altText: 'Image 4',
    caption: 'Ocean waves during sunrise.',
    credit: '(Photo: Star Tribune)',
  },
];

export const Standard: Story = {
  args: {
    variant: 'standard',
    images,
  },
};

export const Immersive: Story = {
  args: {
    variant: 'immersive',
    images,
  },
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';
import { ImageComponentProps, ImageGalleryProps } from './ImageGallery';

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
    caption:
      'General Manager Heather Ann Mady with Moua outside the building that will house Dians Place.',
    credit: '(Rebecca McApline/Star Tribune)',
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

/**
 * Example custom image renderer — swap this out for next/image, a <picture>
 * element, or any other image abstraction used in your project.
 */
const CustomImageComponent = ({ src, alt, className }: ImageComponentProps): React.ReactElement => (
  <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
);

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

export const StandardWithCustomImageComponent: Story = {
  render: (args: ImageGalleryProps) => (
    <ImageGallery {...args} ImageComponent={CustomImageComponent} />
  ),
  args: {
    variant: 'standard',
    images,
  },
};

export const ImmersiveWithCustomImageComponent: Story = {
  render: (args: ImageGalleryProps) => (
    <ImageGallery {...args} ImageComponent={CustomImageComponent} />
  ),
  args: {
    variant: 'immersive',
    images,
  },
};

export const WithIntrinsicSizing: Story = {
  args: {
    variant: 'standard',
    images: [
      {
        src: 'https://picsum.photos/1080/720?1',
        altText: 'Landscape',
        width: 1080,
        height: 720,
        caption: 'Explicit dimensions prevent layout shift.',
      },
      {
        src: 'https://picsum.photos/800/1200?2',
        altText: 'Portrait',
        width: 800,
        height: 1200,
      },
      {
        src: 'https://picsum.photos/1200/600?3',
        altText: 'Wide',
        width: 1200,
        height: 600,
      },
    ],
  },
};

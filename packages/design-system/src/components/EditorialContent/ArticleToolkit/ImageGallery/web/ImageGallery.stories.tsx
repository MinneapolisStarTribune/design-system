import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';
import { ImageGalleryProps } from './ImageGallery';
import { ImageProps } from '@/components/Image/web/Image';

const meta: Meta<typeof ImageGallery> = {
  title: 'Editorial Content/Article Toolkit/Image Gallery',
  component: ImageGallery,
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

const images = [
  {
    src: 'https://picsum.photos/1080/720?1',
    altText: 'Image 1',
    caption: 'Editorial image with caption.',
    credit: '(Photo: Star Tribune)',
    imgixParams: 'w=800&auto=format,compress',
  },
  {
    src: 'https://picsum.photos/1080/720?2',
    altText: 'Image 2',
    caption: 'Second image example.',
    credit: '(Photo: Star Tribune)',
  },
];

const CustomImage = ({ src, alt, ...rest }: ImageProps): React.ReactElement => (
  <img src={src} alt={alt} {...rest} />
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

export const WithCustomImage: Story = {
  render: (args: ImageGalleryProps) => <ImageGallery {...args} ImageComponent={CustomImage} />,
  args: {
    images,
  },
};

export const WithIntrinsicSizing: Story = {
  args: {
    images: [
      {
        src: 'https://picsum.photos/1080/720',
        altText: 'Landscape',
        width: 1080,
        height: 720,
        caption: 'No layout shift',
      },
      {
        src: 'https://picsum.photos/800/1200',
        altText: 'Portrait',
        width: 800,
        height: 1200,
      },
    ],
  },
};

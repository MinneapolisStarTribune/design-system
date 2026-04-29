import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';
import { ImageProps } from '@/components/Image/web/Image';

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
  {
    src: 'https://picsum.photos/1080/720?3',
    altText: 'Image 3',
    caption: 'Another example image.',
    credit: '(Photo: Star Tribune)',
  },
];

const CustomImage = ({ src, alt, ...rest }: ImageProps): React.ReactElement => (
  <img src={src} alt={alt} {...rest} />
);

const meta: Meta<typeof ImageGallery> = {
  title: 'Editorial Content/Article Toolkit/Image Gallery',
  component: ImageGallery,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['standard', 'immersive'],
      description: 'Layout variant of the gallery',
    },
    images: {
      control: 'object',
      description: 'Array of image items',
    },
    ImageComponent: {
      control: false,
      description: 'Custom image renderer',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

export const Configurable: Story = {
  args: {
    variant: 'standard',
    images,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* STANDARD */}
      <ImageGallery variant="standard" images={images} />

      {/* IMMERSIVE */}
      <ImageGallery variant="immersive" images={images} />

      {/* CUSTOM IMAGE */}
      <ImageGallery images={images} ImageComponent={CustomImage} />

      {/* INTRINSIC SIZING */}
      <ImageGallery
        images={[
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
        ]}
      />

      {/* SINGLE IMAGE */}
      <ImageGallery images={[images[0]]} />

      {/* MANY IMAGES */}
      <ImageGallery variant="immersive" images={[...images, ...images, ...images]} />
    </div>
  ),
};

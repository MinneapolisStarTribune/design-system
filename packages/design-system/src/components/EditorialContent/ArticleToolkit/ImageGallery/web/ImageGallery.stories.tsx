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
    expandable: {
      control: 'boolean',
      description: 'Opens the active slide in a full-screen dialog',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

export const Configurable: Story = {
  args: {
    variant: 'standard',
    images,
    expandable: false,
  },
};

export const AllVariants: Story = {
  args: {
    variant: 'standard',
    images,
    expandable: false,
  },

  render: (args) => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* STANDARD */}
      <ImageGallery {...args} variant="standard" />

      {/* IMMERSIVE */}
      <ImageGallery {...args} variant="immersive" />

      {/* CUSTOM IMAGE */}
      <ImageGallery {...args} ImageComponent={CustomImage} />

      {/* INTRINSIC SIZING */}
      <ImageGallery
        {...args}
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
      <ImageGallery {...args} images={[images[0]]} />

      {/* MANY IMAGES */}
      <ImageGallery {...args} variant="immersive" images={[...images, ...images, ...images]} />
    </div>
  ),
};

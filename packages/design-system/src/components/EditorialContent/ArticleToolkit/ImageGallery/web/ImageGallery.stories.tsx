import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';
import { ImageProps } from '@/components/Image/web/Image';
import { ImageItem } from '../ImageGallery.types';

type StoryArgs = React.ComponentProps<typeof ImageGallery> & {
  showBuyReprint: boolean;
};

const images: ImageItem[] = [
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

const getStoryImages = (sourceImages: ImageItem[], showBuyReprint: boolean): ImageItem[] =>
  sourceImages.map((image, index) => ({
    ...image,
    purchaseLink: showBuyReprint
      ? {
          label: 'Buy Reprint',
          link: `https://www.startribune.com/photos?image=${index + 1}`,
        }
      : undefined,
  }));

const meta: Meta<StoryArgs> = {
  title: 'Editorial Content/Article Toolkit/Image Gallery',
  component: ImageGallery,
  args: {
    variant: 'standard',
    images,
    expandable: false,
    showBuyReprint: false,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['standard', 'immersive'],
      description: 'Layout variant of the gallery',
    },
    images: {
      control: 'object',
      description: 'Array of image items including caption, credit, and optional purchaseLink',
    },
    ImageComponent: {
      control: false,
      description: 'Custom image renderer',
    },
    expandable: {
      control: 'boolean',
      description: 'Opens the active slide in a full-screen dialog',
    },
    showBuyReprint: {
      control: 'boolean',
      description: 'Enables or disables Buy Reprint links across the sample images',
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Configurable: Story = {
  args: {
    expandable: true,
  },
  render: ({ showBuyReprint, images: storyImages, ...args }) => (
    <ImageGallery {...args} images={getStoryImages(storyImages, showBuyReprint)} />
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },

  render: ({ showBuyReprint, images: storyImages, ...args }) => {
    const resolvedImages = getStoryImages(storyImages, showBuyReprint);

    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* STANDARD */}
        <ImageGallery {...args} variant="standard" images={resolvedImages} />

        {/* IMMERSIVE */}
        <ImageGallery {...args} variant="immersive" images={resolvedImages} />

        {/* CUSTOM IMAGE */}
        <ImageGallery {...args} ImageComponent={CustomImage} images={resolvedImages} />

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
        <ImageGallery {...args} images={[resolvedImages[0]]} />

        {/* MANY IMAGES */}
        <ImageGallery
          {...args}
          variant="immersive"
          images={[...resolvedImages, ...resolvedImages, ...resolvedImages]}
        />
      </div>
    );
  },
};

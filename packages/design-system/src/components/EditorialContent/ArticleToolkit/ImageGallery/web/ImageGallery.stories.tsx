import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';
import { ImageProps } from '@/components/Image/web/Image';
import { ImageItem } from '../ImageGallery.types';

type StoryArgs = React.ComponentProps<typeof ImageGallery>;

const images: ImageItem[] = [
  {
    src: 'https://picsum.photos/1080/720?1',
    altText: 'Image 1',
    caption: `General Manager Heather Ann Mady with Moua outside the building that will house Diane's Place.`,
    credit: '(Rebecca McAlpine/Star Tribune)',
    purchaseLink: {
      link: 'https://www.startribune.com/photos/reprints',
      label: 'Buy Reprint',
    },
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

const meta: Meta<StoryArgs> = {
  title: 'Editorial Content/Article Toolkit/Image Gallery',
  component: ImageGallery,
  args: {
    variant: 'standard',
    images,
    expandable: false,
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
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Configurable: Story = {
  args: {
    expandable: true,
  },
  render: ({ images: storyImages, ...args }) => <ImageGallery {...args} images={storyImages} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },

  render: ({ images: storyImages, ...args }) => {
    const resolvedImages = storyImages;

    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* STANDARD */}
        <ImageGallery {...args} variant="standard" images={resolvedImages} expandable={true} />

        {/* IMMERSIVE */}
        <ImageGallery {...args} variant="immersive" images={resolvedImages} expandable={true} />

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

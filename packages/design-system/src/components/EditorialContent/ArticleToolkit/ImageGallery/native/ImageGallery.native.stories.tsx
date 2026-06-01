import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollView, Text, View } from 'react-native';

import { ImageGallery } from './ImageGallery.native';
import type { ImageItem } from '../ImageGallery.types';

type StoryArgs = React.ComponentProps<typeof ImageGallery> & {
  showBuyReprint: boolean;
};

const sampleImages: ImageItem[] = [
  {
    src: 'https://picsum.photos/id/1015/1080/720',
    altText: 'Mountain landscape',
    caption: 'A beautiful mountain view.',
    credit: 'Photo by Picsum',
  },
  {
    src: 'https://picsum.photos/id/1016/1080/720',
    altText: 'Forest road',
    caption: 'Road through dense forest.',
    credit: 'Photo by Picsum',
  },
  {
    src: 'https://picsum.photos/id/1018/1080/720',
    altText: 'River and hills',
    caption: 'Calm river between hills.',
    credit: 'Photo by Picsum',
  },
];

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
  title: 'Editorial Content/Article Toolkit/ImageGallery',
  component: ImageGallery,
  args: {
    images: sampleImages,
    variant: 'standard',
    expandable: false,
    showBuyReprint: false,
    'aria-label': 'Image gallery',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['standard', 'immersive'],
      description: 'Layout variant of the gallery.',
    },
    images: {
      control: 'object',
      description: 'Array of images including caption, credit, and optional lightbox purchaseLink.',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for the gallery.',
    },
    loop: {
      control: 'boolean',
      description: 'Whether the gallery should loop when navigating.',
    },
    expandable: {
      control: 'boolean',
      description: 'Opens the pressed slide in a full-screen lightbox.',
    },
    showBuyReprint: {
      control: 'boolean',
      description: 'Enables or disables the lightbox Buy Reprint link across the sample images.',
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
      <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Standard Variant</Text>
        <View>
          <ImageGallery
            {...args}
            variant="standard"
            images={resolvedImages}
            aria-label="Standard gallery"
          />
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Immersive Variant</Text>
        <View>
          <ImageGallery
            {...args}
            variant="immersive"
            images={resolvedImages}
            aria-label="Immersive gallery"
          />
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Single Image</Text>
        <View>
          <ImageGallery
            {...args}
            images={[resolvedImages[0]]}
            variant="standard"
            aria-label="Single image gallery"
          />
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Without Caption</Text>
        <View>
          <ImageGallery
            {...args}
            images={[
              {
                src: 'https://picsum.photos/id/1020/1080/720',
                altText: 'No caption image',
              },
            ]}
            variant="standard"
            aria-label="Gallery without caption"
          />
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Many Images (Scroll Test)</Text>
        <View>
          <ImageGallery
            {...args}
            images={[...resolvedImages, ...resolvedImages]}
            variant="immersive"
            aria-label="Large gallery"
          />
        </View>
      </ScrollView>
    );
  },
};

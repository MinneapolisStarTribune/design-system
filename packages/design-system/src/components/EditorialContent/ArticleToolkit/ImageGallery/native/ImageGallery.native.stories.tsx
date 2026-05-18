import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollView, Text, View } from 'react-native';

import { ImageGallery } from './ImageGallery.native';

const sampleImages = [
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

const meta: Meta<typeof ImageGallery> = {
  title: 'Editorial Content/Article Toolkit/ImageGallery',
  component: ImageGallery,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['standard', 'immersive'],
      description: 'Layout variant of the gallery.',
    },
    images: {
      control: 'object',
      description: 'Array of images with src, altText, caption, credit.',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for the gallery.',
    },
    loop: {
      control: 'boolean',
      description: 'Whether the gallery should loop when navigating.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

export const Configurable: Story = {
  args: {
    images: sampleImages,
    variant: 'standard',
    'aria-label': 'Image gallery',
  },
};

export const AllVariants: Story = {
  render: () => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Standard Variant</Text>
      <View>
        <ImageGallery images={sampleImages} variant="standard" aria-label="Standard gallery" />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Immersive Variant</Text>
      <View>
        <ImageGallery images={sampleImages} variant="immersive" aria-label="Immersive gallery" />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Single Image</Text>
      <View>
        <ImageGallery
          images={[sampleImages[0]]}
          variant="standard"
          aria-label="Single image gallery"
        />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Without Caption</Text>
      <View>
        <ImageGallery
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
          images={[...sampleImages, ...sampleImages]}
          variant="immersive"
          aria-label="Large gallery"
        />
      </View>
    </ScrollView>
  ),
};

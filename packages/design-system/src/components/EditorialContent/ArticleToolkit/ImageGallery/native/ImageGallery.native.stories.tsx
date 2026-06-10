import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, Text, View } from 'react-native';

import type { ImageProps as NativeImageProps } from '@/components/Image/native/Image.native';
import type { ImageGalleryNativeProps, ImageItem } from '../ImageGallery.types';
import { ImageGallery } from './ImageGallery.native';

const sampleImages: ImageItem[] = [
  {
    src: 'https://picsum.photos/id/1015/1080/720',
    altText: 'Mountain landscape',
    caption: 'A beautiful mountain view.',
    credit: 'Photo by Picsum',
    purchaseLink: {
      label: 'Buy Reprint',
      link: 'https://www.startribune.com/photos?id=1015',
    },
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

const meta = {
  title: 'Editorial Content/Article Toolkit/ImageGallery',
  component: ImageGallery,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['standard', 'immersive'],
      description: 'Layout variant of the gallery.',
    },
    images: {
      control: 'object',
      description: 'Array of images including caption, credit, and optional purchaseLink.',
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
  },
} satisfies Meta<typeof ImageGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs: ImageGalleryNativeProps<NativeImageProps> = {
  images: sampleImages,
  variant: 'standard',
  expandable: false,
  'aria-label': 'Image gallery',
};

const storyArgs = (
  overrides: Partial<ImageGalleryNativeProps<NativeImageProps>> = {}
): ImageGalleryNativeProps<NativeImageProps> => ({
  ...defaultArgs,
  ...overrides,
});

export const Configurable: Story = {
  args: storyArgs(),
  render: ({ ...args }) => <ImageGallery {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: storyArgs(),
  render: (args) => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Standard Variant</Text>
      <View>
        <ImageGallery
          {...args}
          variant="standard"
          images={args.images}
          aria-label="Standard gallery"
        />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Immersive Variant</Text>
      <View>
        <ImageGallery
          {...args}
          variant="immersive"
          images={args.images}
          aria-label="Immersive gallery"
        />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Expandable With Purchase Link</Text>
      <View>
        <ImageGallery {...args} expandable aria-label="Expandable gallery with purchase link" />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Single Image</Text>
      <View>
        <ImageGallery
          {...args}
          images={[args.images[0]]}
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
          images={[...args.images, ...args.images]}
          variant="immersive"
          aria-label="Large gallery"
        />
      </View>
    </ScrollView>
  ),
};

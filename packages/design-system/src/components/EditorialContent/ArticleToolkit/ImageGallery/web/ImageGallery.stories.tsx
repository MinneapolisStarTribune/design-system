import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './ImageGallery';
import { ImageProps } from '@/components/Image/web/Image';
import { ImageItem } from '../ImageGallery.types';
import type { CtaLinkProps } from '@/types';

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

const imagesWithoutPurchaseLink: ImageItem[] = images.map(({ ...image }) => image);

const galleryPurchaseLink: CtaLinkProps = {
  label: 'Buy Reprint',
  link: 'https://www.startribune.com/photos/reprints',
};

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

    images: [
      {
        src: 'https://picsum.photos/1080/720?1',
        altText: 'Image 1',
        caption:
          "General Manager Heather Ann Mady with Moua outside the building that will house Diane's Place.",
        credit: '(Rebecca McAlpine/Star Tribune)',
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
    ],

    purchaseLink: {
      link: 'https://www.startribune.com/photos/reprints',
      label: 'Buy Reprint',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<ImageGallery
  variant="standard"
  expandable={true}
  images={[
    {
      src: 'https://picsum.photos/1080/720?1',
      altText: 'Image 1',
      caption: "General Manager Heather Ann Mady with Moua outside the building that will house Diane's Place.",
      credit: '(Rebecca McAlpine/Star Tribune)',
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
  ]}
  purchaseLink={{
    link: 'https://www.startribune.com/photos/reprints',
    label: 'Buy Reprint',
  }}
/>`,
      },
    },
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
        <div>
          <h3>Standard Variant - Gallery Purchase Link</h3>
          <ImageGallery
            {...args}
            variant="standard"
            images={imagesWithoutPurchaseLink}
            purchaseLink={galleryPurchaseLink}
            expandable={true}
          />
        </div>

        <div>
          <h3>Standard Variant - Individual Purchase Links</h3>
          <ImageGallery {...args} variant="standard" images={resolvedImages} expandable={true} />
        </div>

        <div>
          <h3>Immersive Variant - Gallery Purchase Link</h3>
          <ImageGallery
            {...args}
            variant="immersive"
            images={imagesWithoutPurchaseLink}
            purchaseLink={galleryPurchaseLink}
            expandable={true}
          />
        </div>

        <div>
          <h3>Immersive Variant - Individual Purchase Links</h3>
          <ImageGallery {...args} variant="immersive" images={resolvedImages} expandable={true} />
        </div>

        <div>
          <h3>Custom Image Component</h3>
          <ImageGallery {...args} ImageComponent={CustomImage} images={resolvedImages} />
        </div>

        <div>
          <h3>Images with Dimensions - No Layout Shift</h3>
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
        </div>

        <div>
          <h3>Single Image</h3>
          <ImageGallery {...args} images={[resolvedImages[0]]} />
        </div>

        <div>
          <h3>Immersive Variant - Multiple Images (9 total)</h3>
          <ImageGallery
            {...args}
            variant="immersive"
            images={[...resolvedImages, ...resolvedImages, ...resolvedImages]}
          />
        </div>
      </div>
    );
  },
};

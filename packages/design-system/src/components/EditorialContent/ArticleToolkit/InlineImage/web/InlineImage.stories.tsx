import type { Meta, StoryObj } from '@storybook/react-vite';
import type { InlineImageProps } from '../InlineImage.types';
import { InlineImage } from './InlineImage';
import { ARTICLE_BODY_VARIANTS } from '../../types';

const meta: Meta<InlineImageProps> = {
  title: 'Editorial Content/Article Toolkit/Inline Image',
  component: InlineImage,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    image: {
      control: 'object',
      description: 'Image data for the inline image',
    },
    caption: {
      control: 'text',
      description: 'Caption for the inline image',
    },
    credit: {
      control: 'text',
      description: 'Credit for the inline image',
    },
    purchaseLink: {
      control: 'text',
      description: 'Purchase link for the inline image',
    },
    variant: {
      control: 'radio',
      options: Object.values(ARTICLE_BODY_VARIANTS),
      description: 'Article body variant: standard or immersive.',
    },
    expandable: {
      control: 'boolean',
    },
    objectFit: {
      control: 'radio',
      options: ['cover', 'contain'],
      description: 'Object fit for the inline image',
    },
    imgixParams: {
      control: 'object',
      description: 'Imgix parameters for the inline image',
    },
  },
};

export default meta;

type Story = StoryObj<InlineImageProps>;

const image = {
  src: 'https://picsum.photos/id/1018/1200/800',
  altText: 'Alternative text for the image',
};

const defaultArgs: InlineImageProps = {
  image,
  caption: "A scenic view of mountains during sunrise, highlighting nature's beauty.",
  credit: 'Star Tribune staff/The Minnesota Star Tribune',
  variant: 'standard',
  expandable: false,
};

const storyArgs = (overrides: Partial<InlineImageProps> = {}): InlineImageProps => ({
  ...defaultArgs,
  ...overrides,
});

export const Configurable: Story = {
  args: storyArgs(),
};

export const Standard: Story = {
  args: storyArgs({ variant: 'standard' }),
};

export const Immersive: Story = {
  args: storyArgs({ variant: 'immersive' }),
};

export const WithExpandable: Story = {
  args: storyArgs({ expandable: true }),
};

export const WithPurchaseLink: Story = {
  args: storyArgs({
    purchaseLink: 'https://www.startribune.com/photos',
  }),
};

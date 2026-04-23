import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import type { InlineImageProps } from '../InlineImage.types';
import { InlineImage } from './InlineImage.native';
import { ARTICLE_BODY_VARIANTS } from '../../types';

const meta = {
  title: 'Editorial Content/Article Toolkit/Inline Image',
  component: InlineImage,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    image: {
      control: 'object',
      description: 'Image data for the inline image.',
    },
    caption: {
      control: 'text',
      description: 'Caption for the inline image.',
    },
    credit: {
      control: 'text',
      description: 'Credit for the inline image.',
    },
    purchaseLink: {
      control: 'text',
      description: 'Purchase link for image reprints.',
    },
    variant: {
      control: 'radio',
      options: Object.values(ARTICLE_BODY_VARIANTS),
      description: 'Article body variant: standard or immersive.',
    },
    expandable: {
      control: 'boolean',
      description: 'Whether the image can be expanded into a dialog.',
    },
    objectFit: {
      control: 'radio',
      options: ['cover', 'contain'],
      description: 'How the image scales within its container.',
    },
    imgixParams: {
      control: 'text',
      description: 'Imgix query params appended to image src.',
    },
  },
} satisfies Meta<typeof InlineImage>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const AllVariants: Story = {
  args: storyArgs(),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: (args) => (
    <View style={styles.grid}>
      <View style={styles.item}>
        <InlineImage {...args} variant="standard" />
      </View>
      <View style={styles.item}>
        <InlineImage {...args} variant="immersive" />
      </View>
      <View style={styles.item}>
        <InlineImage {...args} expandable />
      </View>
      <View style={styles.item}>
        <InlineImage {...args} purchaseLink="https://www.startribune.com/photos" />
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    gap: 24,
    paddingBottom: 24,
  },
  item: {
    width: '100%',
    gap: 8,
  },
});

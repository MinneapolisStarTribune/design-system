import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { InlineImageProps } from '../InlineImage.types';
import { InlineImage } from './InlineImage.native';
import { ARTICLE_BODY_VARIANTS } from '../../types';
import { resolvePurchaseLink } from '../../shared/resolvePurchaseLink';

const meta = {
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
      control: 'object',
      description: 'Optional Buy Reprint CTA: { label, link }.',
      table: {
        type: { summary: '{ label?: string; link?: string }' },
      },
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
  purchaseLink: {
    label: 'Buy Reprint',
    link: 'https://www.startribune.com/photos',
  },
};

const storyArgs = (overrides: Partial<InlineImageProps> = {}): InlineImageProps => ({
  ...defaultArgs,
  ...overrides,
  purchaseLink:
    'purchaseLink' in overrides
      ? overrides.purchaseLink
        ? { ...overrides.purchaseLink }
        : undefined
      : { ...defaultArgs.purchaseLink! },
});

export const Configurable: Story = {
  args: storyArgs(),
  render: ({ purchaseLink, ...args }) => (
    <InlineImage {...args} purchaseLink={resolvePurchaseLink(purchaseLink)} />
  ),
};

export const AllVariants: Story = {
  args: storyArgs(),
  render: (args) => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.heading}>Standard</Text>
          <InlineImage {...args} variant="standard" />
        </View>
        <View style={styles.item}>
          <Text style={styles.heading}>Immersive</Text>
          <InlineImage {...args} variant="immersive" />
        </View>
        <View style={styles.item}>
          <Text style={styles.heading}>Expandable</Text>
          <InlineImage {...args} expandable />
        </View>
        <View style={styles.item}>
          <Text style={styles.heading}>With Purchase Link</Text>
          <InlineImage
            {...args}
            purchaseLink={{
              label: 'Buy Reprint',
              link: 'https://www.startribune.com/photos',
            }}
          />
        </View>
      </View>
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    width: '100%',
    paddingBottom: 24,
  },
  grid: {
    width: '100%',
    gap: 24,
  },
  item: {
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

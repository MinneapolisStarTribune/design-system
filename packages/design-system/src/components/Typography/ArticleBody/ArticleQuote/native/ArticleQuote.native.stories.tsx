import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleQuote } from './ArticleQuote.native';
import { ARTICLE_QUOTE_SIZES } from '../ArticleQuote.types';

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleQuote',
  component: ArticleQuote,
  argTypes: {
    size: {
      control: 'select',
      options: ARTICLE_QUOTE_SIZES,
      description: 'Size variant - small or large',
    },
    children: {
      control: 'text',
      description: 'The quoted content',
    },
  },
} satisfies Meta<typeof ArticleQuote>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'large',
    children: 'Highlight key statements or examples within an article.',
  },
};

export const AllVariants: Story = {
  args: {
    children: 'Highlight key statements or examples within an article.',
  },
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <View style={styles.list}>
      {ARTICLE_QUOTE_SIZES.map((size) => (
        <View key={size}>
          <ArticleQuote size={size}>{args.children}</ArticleQuote>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  list: {
    rowGap: 8,
  },
});

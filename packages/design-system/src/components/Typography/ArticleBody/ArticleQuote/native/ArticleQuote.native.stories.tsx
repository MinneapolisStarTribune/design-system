import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleQuote } from './ArticleQuote';
import type { ArticleQuoteSize } from '../ArticleQuote.types';

const articleQuoteSizes: ArticleQuoteSize[] = ['small', 'large'];

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleQuote',
  component: ArticleQuote,
  argTypes: {
    size: {
      control: 'select',
      options: articleQuoteSizes,
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
    <>
      {articleQuoteSizes.map((size) => (
        <View key={size} style={styles.variant}>
          <ArticleQuote size={size}>{args.children}</ArticleQuote>
        </View>
      ))}
    </>
  ),
};

const styles = StyleSheet.create({
  variant: {
    gap: 8,
  },
});

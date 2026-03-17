import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading.native';
import { ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodySponsoredHeading.types';

const meta = {
  title: 'Typography/ArticleBody/ArticleBodySponsoredHeading',
  component: ArticleBodySponsoredHeading,
  argTypes: {
    importance: {
      control: 'select',
      options: ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS,
      description: 'Semantic heading level (1-6). Controls the typography style applied.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof ArticleBodySponsoredHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Article body sponsored heading example',
  },
};

export const AllVariants: Story = {
  args: {
    importance: 1,
    children: 'Article body sponsored heading example',
  },
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <View style={styles.list}>
      {ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level}>
          <ArticleBodySponsoredHeading importance={level}>
            {args.children} (h{level})
          </ArticleBodySponsoredHeading>
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

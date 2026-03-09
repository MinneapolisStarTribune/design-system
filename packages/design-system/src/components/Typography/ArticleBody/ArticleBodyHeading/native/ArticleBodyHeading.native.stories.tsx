import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleBodyHeading } from './ArticleBodyHeading.native';
import { ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodyHeading.types';

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleBodyHeading',
  component: ArticleBodyHeading,
  argTypes: {
    importance: {
      control: 'select',
      options: ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS,
      description: 'Semantic heading level (1–6). Controls the typography style applied.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof ArticleBodyHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Article Body Heading',
  },
};

export const AllVariants: Story = {
  args: {
    importance: 1,
    children: 'Article Body Heading',
  },
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <View style={styles.list}>
      {ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level}>
          <ArticleBodyHeading importance={level}>
            {args.children} (h{level})
          </ArticleBodyHeading>
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

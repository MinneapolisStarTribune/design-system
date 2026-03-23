import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { ArticleBodyText } from './ArticleBodyText.native';
import { ARTICLE_BODY_TEXT_WEIGHTS } from '../ArticleBodyText.types';

const meta = {
  title: 'Typography/ArticleBody/ArticleBodyText',
  component: ArticleBodyText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    weight: {
      control: 'select',
      options: ARTICLE_BODY_TEXT_WEIGHTS,
      description: 'The font weight of the article body text',
    },
    children: {
      control: 'text',
      description: 'The content of the article body text',
    },
  },
} satisfies Meta<typeof ArticleBodyText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    weight: 'regular',
    children: 'Article body text',
  },
};

export const AllVariants: Story = {
  args: {
    weight: 'regular',
    children: 'Article body text',
  },
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <View style={styles.grid}>
      {ARTICLE_BODY_TEXT_WEIGHTS.map((weight) => (
        <View key={weight} style={styles.item}>
          <ArticleBodyText weight={weight}>Article body text - {weight}</ArticleBodyText>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    gap: 16,
  },
  item: {
    gap: 8,
  },
});

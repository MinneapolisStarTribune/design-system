import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText.native';
import { ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS } from '../ArticleBodySponsoredText.types';

const meta = {
  title: 'Typography/ArticleBody/ArticleBodySponsoredText',
  component: ArticleBodySponsoredText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    weight: {
      control: 'select',
      options: ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS,
      description: 'The font weight of the article body sponsored text',
    },
    children: {
      control: 'text',
      description: 'The content of the article body sponsored text',
    },
  },
} satisfies Meta<typeof ArticleBodySponsoredText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    weight: 'regular',
    children: 'Article body sponsored text',
  },
};

export const AllVariants: Story = {
  args: {
    weight: 'regular',
    children: 'Article body sponsored text',
  },
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <View style={styles.grid}>
      {ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS.map((weight) => (
        <View key={weight} style={styles.item}>
          <ArticleBodySponsoredText weight={weight}>
            Article body sponsored text - {weight}
          </ArticleBodySponsoredText>
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

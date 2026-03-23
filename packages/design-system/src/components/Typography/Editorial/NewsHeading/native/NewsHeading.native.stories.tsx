import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { NewsHeading } from './NewsHeading.native';
import { NEWS_HEADING_IMPORTANCE_LEVELS } from '../NewsHeading.types';

const meta = {
  title: 'Typography/Editorial/NewsHeading',
  component: NewsHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial news heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  argTypes: {
    importance: {
      control: 'select',
      options: NEWS_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the heading role and typography token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof NewsHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'News heading example',
  },
};

export const AllVariants: Story = {
  args: {
    importance: 1,
    children: '',
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All six heading levels in one view for comparison. Switch **Brand** in the toolbar to see different fonts.',
      },
    },
  },
  render: () => (
    <View style={styles.grid}>
      {NEWS_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <NewsHeading importance={level}>News Heading - h{level}</NewsHeading>
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

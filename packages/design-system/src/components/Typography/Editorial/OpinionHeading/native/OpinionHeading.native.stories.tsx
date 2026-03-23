import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { OpinionHeading } from './OpinionHeading.native';
import { OPINION_HEADING_IMPORTANCE_LEVELS } from '../OpinionHeading.types';

const meta = {
  title: 'Typography/Editorial/OpinionHeading',
  component: OpinionHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial opinion heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  argTypes: {
    importance: {
      control: 'select',
      options: OPINION_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the heading role and typography token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof OpinionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Opinion heading example',
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
      {OPINION_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <OpinionHeading importance={level}>Opinion Heading - h{level}</OpinionHeading>
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

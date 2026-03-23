import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { PageHeading } from './PageHeading.native';
import { PAGE_HEADING_IMPORTANCE_LEVELS } from '../PageHeading.types';

const meta = {
  title: 'Typography/Utility/PageHeading',
  component: PageHeading,
  argTypes: {
    importance: {
      control: 'select',
      options: PAGE_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-4). Controls both the heading role and typography token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Page heading example',
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
  },
  render: () => (
    <View style={styles.grid}>
      {PAGE_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <PageHeading importance={level}>Page Heading - h{level}</PageHeading>
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

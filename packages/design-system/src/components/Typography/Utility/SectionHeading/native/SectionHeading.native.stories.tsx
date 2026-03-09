import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { SectionHeading } from './SectionHeading.native';
import { SECTION_HEADING_IMPORTANCE_LEVELS } from '../SectionHeading.types';

const meta = {
  title: 'Foundations/Typography/Utility/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: SECTION_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the heading role and typography token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Section heading example',
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
      {SECTION_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <SectionHeading importance={level}>Section Heading - h{level}</SectionHeading>
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

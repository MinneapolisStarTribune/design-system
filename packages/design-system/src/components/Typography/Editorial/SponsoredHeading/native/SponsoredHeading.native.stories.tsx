import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { SponsoredHeading } from './SponsoredHeading.native';
import { SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../SponsoredHeading.types';

const meta = {
  title: 'Foundations/Typography/Editorial/SponsoredHeading',
  component: SponsoredHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial sponsored heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: SPONSORED_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the heading role and typography token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof SponsoredHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    importance: 1,
    children: 'Sponsored heading example',
  },
};

export const AllLevels: Story = {
  args: {
    importance: 1,
    children: '',
  },
  render: () => (
    <View style={styles.grid}>
      {SPONSORED_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <SponsoredHeading importance={level}>Sponsored Heading - h{level}</SponsoredHeading>
        </View>
      ))}
    </View>
  ),
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

import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { EnterpriseHeading } from './EnterpriseHeading.native';
import { ENTERPRISE_HEADING_IMPORTANCE_LEVELS } from '../EnterpriseHeading.types';

const meta = {
  title: 'Typography/Editorial/EnterpriseHeading',
  component: EnterpriseHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial enterprise heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  argTypes: {
    importance: {
      control: 'select',
      options: ENTERPRISE_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the heading role and typography token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof EnterpriseHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Enterprise heading example',
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
      {ENTERPRISE_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <EnterpriseHeading importance={level}>Enterprise Heading - h{level}</EnterpriseHeading>
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

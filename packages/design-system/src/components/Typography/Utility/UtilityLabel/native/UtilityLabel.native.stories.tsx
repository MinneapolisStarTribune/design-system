import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { UtilityLabel } from './UtilityLabel.native';
import { UTILITY_LABEL_SIZES, UTILITY_LABEL_WEIGHTS } from '../UtilityLabel.types';

const meta = {
  title: 'Typography/Utility/UtilityLabel',
  component: UtilityLabel,
  argTypes: {
    size: {
      control: 'select',
      options: UTILITY_LABEL_SIZES,
      description: 'The size of the label',
    },
    weight: {
      control: 'select',
      options: UTILITY_LABEL_WEIGHTS,
      description: 'The font weight of the label',
    },
    capitalize: {
      control: 'boolean',
      description: 'Whether to apply uppercase transformation',
    },
  },
} satisfies Meta<typeof UtilityLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
};

export const AllVariants: Story = {
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: '',
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <View style={styles.grid}>
      {UTILITY_LABEL_SIZES.flatMap((size) =>
        UTILITY_LABEL_WEIGHTS.flatMap((weight) =>
          [false, true].map((capitalize) => (
            <View key={`${size}-${weight}-${capitalize}`} style={styles.item}>
              <UtilityLabel size={size} weight={weight} capitalize={capitalize}>
                Label - {size} / {weight}
                {capitalize ? ' / All caps' : ''}
              </UtilityLabel>
            </View>
          ))
        )
      )}
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

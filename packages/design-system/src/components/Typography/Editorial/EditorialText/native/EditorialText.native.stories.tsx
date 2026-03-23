import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { EditorialText } from './EditorialText.native';
import { EDITORIAL_TEXT_SIZES, EDITORIAL_TEXT_WEIGHTS } from '../EditorialText.types';

const meta = {
  title: 'Typography/Editorial/EditorialText',
  component: EditorialText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: EDITORIAL_TEXT_SIZES,
      description: 'The size of the editorial text',
    },
    weight: {
      control: 'select',
      options: EDITORIAL_TEXT_WEIGHTS,
      description: 'The font weight of the editorial text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial text',
    },
  },
} satisfies Meta<typeof EditorialText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial text. Use it for long-form content and article bodies.',
  },
};

export const AllLevels: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial text',
  },
  render: () => (
    <View style={styles.container}>
      {EDITORIAL_TEXT_SIZES.map((size) => (
        <View key={size} style={styles.section}>
          <View style={styles.group}>
            {EDITORIAL_TEXT_WEIGHTS.map((weight) => (
              <EditorialText key={weight} size={size} weight={weight}>
                {`${size} / ${weight} editorial text`}
              </EditorialText>
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  container: { width: '100%', gap: 24 },
  section: { gap: 8 },
  group: { gap: 8 },
});

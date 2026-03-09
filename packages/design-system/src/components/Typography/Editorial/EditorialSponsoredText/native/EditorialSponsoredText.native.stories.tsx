import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import { EditorialSponsoredText } from './EditorialSponsoredText.native';
import {
  EDITORIAL_SPONSORED_TEXT_SIZES,
  EDITORIAL_SPONSORED_TEXT_WEIGHTS,
} from '../EditorialSponsoredText.types';

const meta = {
  title: 'Foundations/Typography/Editorial/EditorialSponsoredText',
  component: EditorialSponsoredText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: EDITORIAL_SPONSORED_TEXT_SIZES,
      description: 'The size of the editorial sponsored text',
    },
    weight: {
      control: 'select',
      options: EDITORIAL_SPONSORED_TEXT_WEIGHTS,
      description: 'The font weight of the editorial sponsored text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial sponsored text',
    },
  },
} satisfies Meta<typeof EditorialSponsoredText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial sponsored text. Use it for long-form content and article bodies.',
  },
};

export const AllVariants: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Sponsored Text',
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <View style={styles.grid}>
      {EDITORIAL_SPONSORED_TEXT_SIZES.flatMap((size) =>
        EDITORIAL_SPONSORED_TEXT_WEIGHTS.map((weight) => (
          <View key={`${size}-${weight}`} style={styles.item}>
            <EditorialSponsoredText size={size} weight={weight}>
              Editorial sponsored text - {size} / {weight}
            </EditorialSponsoredText>
          </View>
        ))
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

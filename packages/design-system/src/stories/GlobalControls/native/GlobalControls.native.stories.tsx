import { StyleSheet, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

type Brand = 'startribune' | 'varsity';
type Mode = 'light' | 'dark';

type GlobalControlDebugProps = {
  brand: Brand;
  mode: Mode;
};

const BRAND_SWATCH: Record<Brand, string> = {
  startribune: '#00854B',
  varsity: '#003D7D',
};

const meta = {
  title: 'Global/Brand + Mode',
  parameters: {
    controls: { expanded: true },
  },
  render: (args: GlobalControlDebugProps) => {
    const brand = args.brand ?? 'startribune';
    const mode = args.mode ?? 'light';
    const isDark = mode === 'dark';

    return (
      <View style={styles.container}>
        <Text style={[styles.heading, { color: isDark ? '#FFFFFF' : '#111111' }]}>
          Global Controls Debug
        </Text>

        <Text style={[styles.subheading, { color: isDark ? '#D1D5DB' : '#374151' }]}>
          Toggle `brand` and `mode` in Controls to confirm wiring.
        </Text>

        <View
          style={[
            styles.brandChip,
            {
              backgroundColor: BRAND_SWATCH[brand],
              borderColor: isDark ? '#1F2937' : '#D1D5DB',
            },
          ]}
        >
          <Text style={styles.brandChipText}>Brand: {brand}</Text>
        </View>

        <View
          style={[
            styles.modeChip,
            {
              backgroundColor: isDark ? '#000000' : '#FFFFFF',
              borderColor: isDark ? '#4B5563' : '#9CA3AF',
            },
          ]}
        >
          <Text style={[styles.modeChipText, { color: isDark ? '#FFFFFF' : '#111111' }]}>
            Mode: {mode}
          </Text>
        </View>
      </View>
    );
  },
} satisfies Meta<GlobalControlDebugProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    brand: 'startribune',
    mode: 'light',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 14,
  },
  brandChip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  brandChipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modeChip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modeChipText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

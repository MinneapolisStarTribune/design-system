import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, Text, View } from 'react-native';
import { SKELETON_VARIANTS, type SkeletonNativeProps } from '../Skeleton.types';
import { Skeleton } from './Skeleton.native';

const meta = {
  title: 'Status & Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: SKELETON_VARIANTS,
      description: 'Shape of the placeholder.',
      table: {
        type: { summary: "'circle' | 'rectangle'" },
        defaultValue: { summary: "'rectangle'" },
      },
    },
    animate: {
      control: 'boolean',
      description: 'Runs the shimmer animation when true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    width: {
      control: { type: 'number' },
      description:
        'Override default width. Pass a number for pixels (e.g. `200`) or a string in app code for CSS values (e.g. `"70%"`).',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '200 (rectangle) / 64 (circle)' },
      },
    },
    height: {
      control: { type: 'number' },
      description:
        'Override default height. Pass a number for pixels (e.g. `25`) or a string in app code for CSS values (e.g. `"100%"`).',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '25 (rectangle) / 64 (circle)' },
      },
    },
  },
} satisfies Meta<SkeletonNativeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    variant: 'rectangle',
    animate: true,
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>
          Rectangle — default (200px × 25px)
        </Text>
        <Skeleton variant="rectangle" />
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Rectangle — custom dimensions</Text>
        <Skeleton variant="rectangle" height={24} />
        <Skeleton variant="rectangle" height={32} width="70%" />
        <Skeleton variant="rectangle" height={180} />
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Circle — default (64px)</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Skeleton variant="circle" />
          <Skeleton variant="circle" width={32} height={32} />
          <Skeleton variant="circle" width={56} height={56} />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Circle — custom diameters</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Skeleton variant="circle" width={48} height={48} />
          <Skeleton variant="circle" width={80} height={80} />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>On light surface</Text>
        <View
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e5e8',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Skeleton variant="rectangle" />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>On dark surface</Text>
        <View
          style={{
            backgroundColor: '#0d0d0d',
            padding: 16,
            borderRadius: 8,
            gap: 12,
          }}
        >
          <Skeleton variant="rectangle" />
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Skeleton variant="circle" />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton variant="rectangle" height={12} />
              <Skeleton variant="rectangle" height={12} width="60%" />
            </View>
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Article card placeholder</Text>
        <Skeleton variant="rectangle" height={180} />
        <Skeleton variant="rectangle" height={24} />
        <Skeleton variant="rectangle" height={16} width="80%" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circle" width={32} height={32} />
          <Skeleton variant="rectangle" height={12} width={120} />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Static (animate=false)</Text>
        <Skeleton variant="rectangle" animate={false} />
      </View>
    </ScrollView>
  ),
};

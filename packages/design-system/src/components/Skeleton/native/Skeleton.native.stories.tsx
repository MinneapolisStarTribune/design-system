import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, Text, View } from 'react-native';
import {
  SKELETON_BACKGROUNDS,
  SKELETON_SIZES,
  SKELETON_VARIANTS,
  type SkeletonNativeProps,
} from '../Skeleton.types';
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
      description: 'Shape of the placeholder',
    },
    size: {
      control: 'radio',
      options: SKELETON_SIZES,
      description: 'Height (rectangle) or diameter (circle)',
    },
    background: {
      control: 'radio',
      options: SKELETON_BACKGROUNDS,
      description: 'Surface the skeleton sits on — light or dark',
    },
    animate: {
      control: 'boolean',
      description: 'Runs the pulse animation when true',
    },
    width: {
      control: 'text',
      description: 'Override default width',
    },
    height: {
      control: 'text',
      description: 'Override default height',
    },
  },
} satisfies Meta<SkeletonNativeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    variant: 'rectangle',
    size: 'medium',
    background: 'light',
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
      {/* Rectangle sizes */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Rectangle — Small</Text>
        <Skeleton variant="rectangle" size="small" />
      </View>
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Rectangle — Medium</Text>
        <Skeleton variant="rectangle" size="medium" />
      </View>
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Rectangle — Large</Text>
        <Skeleton variant="rectangle" size="large" />
      </View>

      {/* Circle sizes */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Skeleton variant="circle" size="small" />
          <Text style={{ fontSize: 12 }}>Small</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Skeleton variant="circle" size="medium" />
          <Text style={{ fontSize: 12 }}>Medium</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Skeleton variant="circle" size="large" />
          <Text style={{ fontSize: 12 }}>Large</Text>
        </View>
      </View>

      {/* Dark background */}
      <View style={{ backgroundColor: '#111', padding: 16, borderRadius: 8, gap: 12 }}>
        <Text style={{ fontWeight: '600', color: '#fff', marginBottom: 4 }}>Dark surface</Text>
        <Skeleton variant="rectangle" size="medium" background="dark" />
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Skeleton variant="circle" size="medium" background="dark" />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton variant="rectangle" size="small" background="dark" />
            <Skeleton variant="rectangle" size="small" background="dark" width="60%" />
          </View>
        </View>
      </View>

      {/* Article card placeholder */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Article card placeholder</Text>
        <Skeleton variant="rectangle" height={180} />
        <Skeleton variant="rectangle" size="large" />
        <Skeleton variant="rectangle" size="medium" width="80%" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circle" size="small" />
          <Skeleton variant="rectangle" size="small" width={120} />
        </View>
      </View>

      {/* No animation */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Static (animate=false)</Text>
        <Skeleton variant="rectangle" size="medium" animate={false} />
      </View>
    </ScrollView>
  ),
};

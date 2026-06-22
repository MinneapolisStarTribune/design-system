import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { UtilityLabel } from '@/components/index.native';
import {
  SKELETON_VARIANT_DEFAULTS,
  SKELETON_VARIANTS,
  type SkeletonNativeProps,
} from '../Skeleton.types';
import { resolveSkeletonDimensions } from '../resolveSkeletonDimensions';
import { Skeleton } from './Skeleton.native';

const SectionLabel = ({ children }: { children: string }) => (
  <UtilityLabel size="small" weight="semibold" style={{ marginBottom: 4 }}>
    {children}
  </UtilityLabel>
);

const getSkeletonDimensions = (
  variant: SkeletonNativeProps['variant'],
  width?: number | string,
  height?: number | string
) => {
  const resolvedVariant = variant ?? 'rectangle';
  const defaults = SKELETON_VARIANT_DEFAULTS[resolvedVariant];
  const resolved = resolveSkeletonDimensions(resolvedVariant, width, height);

  return {
    width: resolved.width ?? defaults.width,
    height: resolved.height ?? defaults.height,
  };
};

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
      description:
        'Shape of the placeholder. Preview uses that variant’s default width and height until you override them.',
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
        'Override default width. Pass a number for pixels (e.g. `200`) or a string in app code for CSS values (e.g. `"70%"`). Set to `0` to use the variant default.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '200 (rectangle) / 64 (circle)' },
      },
    },
    height: {
      control: { type: 'number' },
      description:
        'Override default height. Pass a number for pixels (e.g. `25`) or a string in app code for CSS values (e.g. `"100%"`). Set to `0` to use the variant default.',
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
  render: function ConfigurableSkeletonRender(args) {
    const variant = args.variant ?? 'rectangle';
    const { width, height } = getSkeletonDimensions(variant, args.width, args.height);

    return <Skeleton {...args} variant={variant} width={width} height={height} />;
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: function AllVariantsRender() {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
        <View style={{ gap: 12 }}>
          <SectionLabel>Rectangle — default (200px × 25px)</SectionLabel>
          <Skeleton variant="rectangle" />
        </View>

        <View style={{ gap: 12 }}>
          <SectionLabel>Rectangle — custom dimensions</SectionLabel>
          <Skeleton variant="rectangle" height={24} />
          <Skeleton variant="rectangle" height={32} width="70%" />
          <Skeleton variant="rectangle" height={180} />
        </View>

        <View style={{ gap: 12 }}>
          <SectionLabel>Circle — default (64px)</SectionLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Skeleton variant="circle" />
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="circle" width={56} height={56} />
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <SectionLabel>Circle — custom diameters</SectionLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Skeleton variant="circle" width={48} height={48} />
            <Skeleton variant="circle" width={80} height={80} />
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <SectionLabel>On light surface</SectionLabel>
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
          <SectionLabel>On dark surface</SectionLabel>
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
          <SectionLabel>Article card placeholder</SectionLabel>
          <Skeleton variant="rectangle" height={180} />
          <Skeleton variant="rectangle" height={24} />
          <Skeleton variant="rectangle" height={16} width="80%" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="rectangle" height={12} width={120} />
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <SectionLabel>Static (animate=false)</SectionLabel>
          <Skeleton variant="rectangle" animate={false} />
        </View>
      </ScrollView>
    );
  },
};

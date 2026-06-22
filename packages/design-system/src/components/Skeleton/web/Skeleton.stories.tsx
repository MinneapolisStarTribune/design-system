import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityLabel } from '@/components/Typography/Utility';
import {
  SKELETON_VARIANT_DEFAULTS,
  SKELETON_VARIANTS,
  type SkeletonVariant,
} from '@/components/Skeleton/Skeleton.types';
import { Skeleton, type SkeletonProps } from './Skeleton';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const resolveDimension = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === '' || value === 0) {
    return undefined;
  }
  return value;
};

const getSkeletonDimensions = (
  variant: SkeletonVariant,
  width?: number | string,
  height?: number | string
) => {
  const defaults = SKELETON_VARIANT_DEFAULTS[variant];

  return {
    width: resolveDimension(width) ?? defaults.width,
    height: resolveDimension(height) ?? defaults.height,
  };
};

const meta: Meta<SkeletonProps> = {
  title: 'Status & Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      canvas: {
        sourceState: 'hidden',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: [...SKELETON_VARIANTS],
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
};

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
  },
  render: function AllVariantsRender() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel>Rectangle — default (200px × 25px)</SectionLabel>
          <Skeleton variant="rectangle" />
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel>Rectangle — custom dimensions</SectionLabel>
          <Skeleton variant="rectangle" height={24} />
          <Skeleton variant="rectangle" height={32} width="70%" />
          <Skeleton variant="rectangle" height={180} />
        </section>

        <section>
          <SectionLabel>Circle — default (64px)</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <Skeleton variant="circle" />
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="circle" width={56} height={56} />
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel>On light surface</SectionLabel>
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e3e5e8',
              padding: 16,
              borderRadius: 8,
            }}
          >
            <Skeleton variant="rectangle" />
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel>On dark surface</SectionLabel>
          <div
            style={{
              backgroundColor: '#0d0d0d',
              padding: 16,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <Skeleton variant="rectangle" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Skeleton variant="circle" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton variant="rectangle" height={12} />
                <Skeleton variant="rectangle" height={12} width="60%" />
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel>Article card placeholder</SectionLabel>
          <Skeleton variant="rectangle" height={180} />
          <Skeleton variant="rectangle" height={24} />
          <Skeleton variant="rectangle" height={16} width="80%" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="rectangle" height={12} width={120} />
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel>Static (animate=false)</SectionLabel>
          <Skeleton variant="rectangle" animate={false} />
        </section>
      </div>
    );
  },
};

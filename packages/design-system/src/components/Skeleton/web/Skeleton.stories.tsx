import { useContext } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { UtilityLabel } from '@/components/Typography/Utility';
import {
  SKELETON_SURFACES,
  SKELETON_VARIANT_DEFAULTS,
  SKELETON_VARIANTS,
} from '@/components/Skeleton/Skeleton.types';
import { resolveSkeletonDimensions } from '@/components/Skeleton/resolveSkeletonDimensions';
import { Skeleton, type SkeletonProps } from './Skeleton';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const SurfaceExample = () => {
  const isDarkTheme = useContext(DesignSystemContext)?.colorScheme === 'dark';
  const surface = isDarkTheme ? 'light' : 'dark';

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionLabel>On {surface} surface (inverse of the theme)</SectionLabel>
      <div
        style={{
          backgroundColor: isDarkTheme
            ? 'var(--color-base-white)'
            : 'var(--color-background-dark-default)',
          padding: 16,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Skeleton variant="rectangle" surface={surface} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Skeleton variant="circle" surface={surface} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton variant="rectangle" surface={surface} height={12} />
            <Skeleton variant="rectangle" surface={surface} height={12} width="60%" />
          </div>
        </div>
      </div>
    </section>
  );
};

const getSkeletonDimensions = (
  variant: SkeletonProps['variant'],
  width?: number | string,
  height?: number | string
) => {
  const defaults = SKELETON_VARIANT_DEFAULTS[variant ?? 'rectangle'];
  const resolved = resolveSkeletonDimensions(variant ?? 'rectangle', width, height);

  return {
    width: resolved.width ?? defaults.width,
    height: resolved.height ?? defaults.height,
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
    surface: {
      control: 'radio',
      options: [...SKELETON_SURFACES],
      description:
        'Fixes the palette for a light or dark surface regardless of theme. Omit to follow the theme. Colors can still be overridden with `--skeleton-from` and `--skeleton-to`.',
      table: {
        type: { summary: "'light' | 'dark'" },
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
    radius: {
      control: { type: 'number' },
      description:
        'Corner radius for rounded rectangles such as chips, inputs and buttons. Pass a number for pixels or a string for CSS values.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '4 (rectangle) / full (circle)' },
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

export const Shapes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function ShapesRender() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel>Text bars</SectionLabel>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
          <Skeleton width={72} height={14} />
        </section>

        <section>
          <SectionLabel>Avatar circle</SectionLabel>
          <Skeleton variant="circle" width={32} />
        </section>

        <section>
          <SectionLabel>Rounded rectangles (chip, input, button)</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Skeleton width={72} height={32} radius={16} />
            <Skeleton width={240} height={40} radius={8} />
            <Skeleton width={96} height={40} radius={20} />
          </div>
        </section>

        <section>
          <SectionLabel>Square (checkbox) and kebab icon</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Skeleton width={16} height={16} radius={4} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton variant="circle" width={3} />
              <Skeleton variant="circle" width={3} />
              <Skeleton variant="circle" width={3} />
            </div>
          </div>
        </section>
      </div>
    );
  },
};

export const LoadingStatus: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function LoadingStatusRender() {
    return (
      <div
        role="status"
        aria-label="Loading roster"
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}
      >
        <Skeleton variant="circle" width={32} />
        <Skeleton width={160} height={14} />
        <Skeleton width={48} height={14} />
      </div>
    );
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

        <SurfaceExample />

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

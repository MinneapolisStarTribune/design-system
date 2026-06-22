import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SKELETON_VARIANTS, type SkeletonProps } from './Skeleton';

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
};

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
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>Rectangle — default (200px × 25px)</strong>
        <Skeleton variant="rectangle" />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>Rectangle — custom dimensions</strong>
        <Skeleton variant="rectangle" height={24} />
        <Skeleton variant="rectangle" height={32} width="70%" />
        <Skeleton variant="rectangle" height={180} />
      </section>

      <section>
        <strong>Circle — default (64px)</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <Skeleton variant="circle" />
          <Skeleton variant="circle" width={32} height={32} />
          <Skeleton variant="circle" width={56} height={56} />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>On light surface</strong>
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
        <strong>On dark surface</strong>
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
        <strong>Article card placeholder</strong>
        <Skeleton variant="rectangle" height={180} />
        <Skeleton variant="rectangle" height={24} />
        <Skeleton variant="rectangle" height={16} width="80%" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circle" width={32} height={32} />
          <Skeleton variant="rectangle" height={12} width={120} />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>Static (animate=false)</strong>
        <Skeleton variant="rectangle" animate={false} />
      </section>
    </div>
  ),
};

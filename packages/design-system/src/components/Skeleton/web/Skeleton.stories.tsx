import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Skeleton,
  SKELETON_BACKGROUNDS,
  SKELETON_SIZES,
  SKELETON_VARIANTS,
  type SkeletonProps,
} from './Skeleton';

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
      description: 'Shape of the placeholder',
    },
    size: {
      control: 'radio',
      options: [...SKELETON_SIZES],
      description: 'Height (rectangle) or diameter (circle)',
    },
    background: {
      control: 'radio',
      options: [...SKELETON_BACKGROUNDS],
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
};

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
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {/* Rectangle sizes */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>Rectangle</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton variant="rectangle" size="small" />
          <Skeleton variant="rectangle" size="medium" />
          <Skeleton variant="rectangle" size="large" />
        </div>
      </section>

      {/* Circle sizes */}
      <section>
        <strong>Circle</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Skeleton variant="circle" size="small" />
            <span style={{ fontSize: 12 }}>Small</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Skeleton variant="circle" size="medium" />
            <span style={{ fontSize: 12 }}>Medium</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Skeleton variant="circle" size="large" />
            <span style={{ fontSize: 12 }}>Large</span>
          </div>
        </div>
      </section>

      {/* Dark surface */}
      <section
        style={{
          backgroundColor: '#111',
          padding: 16,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <strong style={{ color: '#fff' }}>Dark surface</strong>
        <Skeleton variant="rectangle" size="medium" background="dark" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Skeleton variant="circle" size="medium" background="dark" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton variant="rectangle" size="small" background="dark" />
            <Skeleton variant="rectangle" size="small" background="dark" width="60%" />
          </div>
        </div>
      </section>

      {/* Article card placeholder */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>Article card placeholder</strong>
        <Skeleton variant="rectangle" height={180} />
        <Skeleton variant="rectangle" size="large" />
        <Skeleton variant="rectangle" size="medium" width="80%" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circle" size="small" />
          <Skeleton variant="rectangle" size="small" width={120} />
        </div>
      </section>

      {/* Static */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong>Static (animate=false)</strong>
        <Skeleton variant="rectangle" size="medium" animate={false} />
      </section>
    </div>
  ),
};

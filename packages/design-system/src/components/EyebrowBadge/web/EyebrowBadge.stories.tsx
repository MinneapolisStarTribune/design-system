import type { Meta, StoryObj } from '@storybook/react-vite';
import { EyebrowBadge } from './EyebrowBadge';
import {
  EYEBROW_BADGE_AS_ELEMENTS,
  EYEBROW_BADGE_VARIANTS,
} from '@/components/EyebrowBadge/EyebrowBadge.types';

const meta = {
  title: 'Feedback & Status/EyebrowBadge',
  component: EyebrowBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: EYEBROW_BADGE_VARIANTS,
    },
    as: {
      control: 'select',
      options: EYEBROW_BADGE_AS_ELEMENTS,
    },
    showDot: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof EyebrowBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'Live',
    secondaryLabel: 'Updated 12 mins ago',
    variant: 'live',
    showDot: true,
  },
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <EyebrowBadge label="Live" secondaryLabel="Updated 12 mins ago" variant="live" />
      <EyebrowBadge label="Breaking" secondaryLabel="Developing story" variant="breaking" />
      <EyebrowBadge label="Showcase" secondaryLabel="Series" variant="showcase" showDot={false} />
      <EyebrowBadge label="Sponsored" variant="sponsored" />
    </div>
  ),
};

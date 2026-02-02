import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityLabel } from '../../../../components/UtilityLabel';
import { UTILITY_LABEL_SIZES, UTILITY_LABEL_WEIGHTS } from '../../../../types/globalTypes';

const meta = {
  title: 'Foundations/Typography/Utility',
  component: UtilityLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: [...UTILITY_LABEL_SIZES] as string[],
      description: 'The size of the label',
    },
    weight: {
      control: 'select',
      options: [...UTILITY_LABEL_WEIGHTS] as string[],
      description: 'The font weight of the label',
    },
    capitalize: {
      control: 'boolean',
      description: 'Whether to apply uppercase transformation',
    },
  },
} satisfies Meta<typeof UtilityLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfigurableLabel: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
};

export const AllSizes: Story = {
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <UtilityLabel size="small">Small Label (12px)</UtilityLabel>
      <UtilityLabel size="medium">Medium Label (14px)</UtilityLabel>
      <UtilityLabel size="large">Large Label (16px)</UtilityLabel>
    </div>
  ),
};

export const WeightComparison: Story = {
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <UtilityLabel size="small" weight="regular">
          Small Regular (400)
        </UtilityLabel>
      </div>
      <div>
        <UtilityLabel size="small" weight="semibold">
          Small Semibold (600)
        </UtilityLabel>
      </div>
      <div>
        <UtilityLabel size="medium" weight="regular">
          Medium Regular (400)
        </UtilityLabel>
      </div>
      <div>
        <UtilityLabel size="medium" weight="semibold">
          Medium Semibold (600)
        </UtilityLabel>
      </div>
      <div>
        <UtilityLabel size="large" weight="regular">
          Large Regular (400)
        </UtilityLabel>
      </div>
      <div>
        <UtilityLabel size="large" weight="semibold">
          Large Semibold (600)
        </UtilityLabel>
      </div>
    </div>
  ),
};

export const WithCapitalization: Story = {
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <UtilityLabel size="small" weight="regular">
        Normal Text
      </UtilityLabel>
      <UtilityLabel size="small" weight="regular" capitalize>
        Capitalized Text
      </UtilityLabel>
      <UtilityLabel size="medium" weight="semibold">
        Normal Semibold
      </UtilityLabel>
      <UtilityLabel size="medium" weight="semibold" capitalize>
        Capitalized Semibold
      </UtilityLabel>
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>Small</h3>
      <UtilityLabel size="small" weight="regular">
        Label Small / Regular
      </UtilityLabel>
      <UtilityLabel size="small" weight="regular" capitalize>
        Label Small / Regular / All Caps
      </UtilityLabel>
      <UtilityLabel size="small" weight="semibold">
        Label Small / Bold
      </UtilityLabel>
      <UtilityLabel size="small" weight="semibold" capitalize>
        Label Small / Bold / All Caps
      </UtilityLabel>

      <h3 style={{ marginTop: '24px' }}>Medium</h3>
      <UtilityLabel size="medium" weight="regular">
        Label Medium / Regular
      </UtilityLabel>
      <UtilityLabel size="medium" weight="regular" capitalize>
        Label Medium / Regular / All Caps
      </UtilityLabel>
      <UtilityLabel size="medium" weight="semibold">
        Label Medium / Bold
      </UtilityLabel>
      <UtilityLabel size="medium" weight="semibold" capitalize>
        Label Medium / Bold / All Caps
      </UtilityLabel>

      <h3 style={{ marginTop: '24px' }}>Large</h3>
      <UtilityLabel size="large" weight="regular">
        Label Large / Regular
      </UtilityLabel>
      <UtilityLabel size="large" weight="regular" capitalize>
        Label Large / Regular / All Caps
      </UtilityLabel>
      <UtilityLabel size="large" weight="semibold">
        Label Large / Bold
      </UtilityLabel>
      <UtilityLabel size="large" weight="semibold" capitalize>
        Label Large / Bold / All Caps
      </UtilityLabel>
    </div>
  ),
};

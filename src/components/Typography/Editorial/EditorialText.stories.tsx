import { Meta, StoryObj } from '@storybook/react-vite';
import { FontWeight, SIZES } from '../../../types/globalTypes';
import { EditorialText } from './EditorialText';

const meta = {
  title: 'Foundations/Typography/Editorial/EditorialText',
  component: EditorialText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
      description: 'The size of the editorial text',
    },
    weight: {
      control: 'select',
      options: ['regular', 'bold'] as Extract<FontWeight, 'regular' | 'bold'>[],
      description: 'The font weight of the editorial text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial text',
    },
  },
} satisfies Meta<typeof EditorialText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfigurableEditorialText: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial text. Use it for long-form content and article bodies.',
  },
};

export const AllSizes: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <EditorialText size="xx-small" weight="regular">
        XX-Small editorial text
      </EditorialText>
      <EditorialText size="x-small" weight="regular">
        X-Small editorial text
      </EditorialText>
      <EditorialText size="small" weight="regular">
        Small editorial text
      </EditorialText>
      <EditorialText size="medium" weight="regular">
        Medium editorial text
      </EditorialText>
      <EditorialText size="large" weight="regular">
        Large editorial text
      </EditorialText>
    </div>
  ),
};

export const WeightComparison: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <EditorialText size="medium" weight="regular">
        Regular editorial text (400)
      </EditorialText>
      <EditorialText size="medium" weight="bold">
        Bold editorial text (700)
      </EditorialText>
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>XX-Small</h2>
      <EditorialText size="xx-small" weight="regular">
        XX-Small / Regular
      </EditorialText>
      <EditorialText size="xx-small" weight="bold">
        XX-Small / Bold
      </EditorialText>

      <h2 style={{ marginTop: '24px' }}>X-Small</h2>
      <EditorialText size="x-small" weight="regular">
        X-Small / Regular
      </EditorialText>
      <EditorialText size="x-small" weight="bold">
        X-Small / Bold
      </EditorialText>

      <h3>Small</h3>
      <EditorialText size="small" weight="regular">
        Small / Regular
      </EditorialText>
      <EditorialText size="small" weight="bold">
        Small / Bold
      </EditorialText>

      <h3 style={{ marginTop: '24px' }}>Medium</h3>
      <EditorialText size="medium" weight="regular">
        Medium / Regular
      </EditorialText>
      <EditorialText size="medium" weight="bold">
        Medium / Bold
      </EditorialText>

      <h3 style={{ marginTop: '24px' }}>Large</h3>
      <EditorialText size="large" weight="regular">
        Large / Regular
      </EditorialText>
      <EditorialText size="large" weight="bold">
        Large / Bold
      </EditorialText>
    </div>
  ),
};

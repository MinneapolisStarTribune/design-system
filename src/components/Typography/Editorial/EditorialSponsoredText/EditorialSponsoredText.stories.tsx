import { Meta, StoryObj } from '@storybook/react-vite';
import { FontWeight, SIZES } from '../../../../types/globalTypes';
import { EditorialSponsoredText } from './EditorialSponsoredText';

const meta = {
  title: 'Foundations/Typography/Editorial/EditorialSponsoredText',
  component: EditorialSponsoredText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
      description: 'The size of the editorial sponsored text',
    },
    weight: {
      control: 'select',
      options: ['regular', 'bold'] as Extract<FontWeight, 'regular' | 'bold'>[],
      description: 'The font weight of the editorial sponsored text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial sponsored text',
    },
  },
} satisfies Meta<typeof EditorialSponsoredText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfigurableEditorialSponsoredText: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial sponsored text. Use it for long-form content and article bodies.',
  },
};

export const AllSizes: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Sponsored Text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <EditorialSponsoredText size="xx-small" weight="regular">
        XX-Small editorial sponsored text
      </EditorialSponsoredText>
      <EditorialSponsoredText size="x-small" weight="regular">
        X-Small editorial sponsored text
      </EditorialSponsoredText>
      <EditorialSponsoredText size="small" weight="regular">
        Small editorial sponsored text
      </EditorialSponsoredText>
      <EditorialSponsoredText size="medium" weight="regular">
        Medium editorial sponsored text
      </EditorialSponsoredText>
      <EditorialSponsoredText size="large" weight="regular">
        Large editorial sponsored text
      </EditorialSponsoredText>
    </div>
  ),
};

export const WeightComparison: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Sponsored Text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <EditorialSponsoredText size="medium" weight="regular">
        Regular editorial sponsored text (400)
      </EditorialSponsoredText>
      <EditorialSponsoredText size="medium" weight="bold">
        Bold editorial sponsored text (700)
      </EditorialSponsoredText>
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Sponsored Text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>XX-Small</h2>
      <EditorialSponsoredText size="xx-small" weight="regular">
        XX-Small / Regular
      </EditorialSponsoredText>
      <EditorialSponsoredText size="xx-small" weight="bold">
        XX-Small / Bold
      </EditorialSponsoredText>

      <h2 style={{ marginTop: '24px' }}>X-Small</h2>
      <EditorialSponsoredText size="x-small" weight="regular">
        X-Small / Regular
      </EditorialSponsoredText>
      <EditorialSponsoredText size="x-small" weight="bold">
        X-Small / Bold
      </EditorialSponsoredText>

      <h3>Small</h3>
      <EditorialSponsoredText size="small" weight="regular">
        Small / Regular
      </EditorialSponsoredText>
      <EditorialSponsoredText size="small" weight="bold">
        Small / Bold
      </EditorialSponsoredText>

      <h3 style={{ marginTop: '24px' }}>Medium</h3>
      <EditorialSponsoredText size="medium" weight="regular">
        Medium / Regular
      </EditorialSponsoredText>
      <EditorialSponsoredText size="medium" weight="bold">
        Medium / Bold
      </EditorialSponsoredText>

      <h3 style={{ marginTop: '24px' }}>Large</h3>
      <EditorialSponsoredText size="large" weight="regular">
        Large / Regular
      </EditorialSponsoredText>
      <EditorialSponsoredText size="large" weight="bold">
        Large / Bold
      </EditorialSponsoredText>
    </div>
  ),
};

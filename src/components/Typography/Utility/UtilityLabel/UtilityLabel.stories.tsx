import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityLabel } from './UtilityLabel';
import { UtilityLabelSize, UtilityLabelWeight } from '../../../../types/globalTypes';

const meta = {
  title: 'Foundations/Typography/Utility/UtilityLabel',
  component: UtilityLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'] as UtilityLabelSize[],
      description: 'The size of the label',
    },
    weight: {
      control: 'select',
      options: ['regular', 'semibold'] as UtilityLabelWeight[],
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

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
  render: () => {
    const sizes = ['small', 'medium', 'large'] as const;
    const weights = ['regular', 'semibold'] as const;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {sizes.flatMap((size) =>
          weights.flatMap((weight) =>
            [false, true].map((capitalize) => (
              <div
                key={`${size}-${weight}-${capitalize}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {size} / {weight}
                  {capitalize ? ' / All caps' : ''}
                </span>
                <UtilityLabel size={size} weight={weight} capitalize={capitalize}>
                  Label
                </UtilityLabel>
              </div>
            ))
          )
        )}
      </div>
    );
  },
};

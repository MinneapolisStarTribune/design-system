import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, BUTTON_VARIANTS, BUTTON_COLORS, BUTTON_SIZES } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS] as string[],
    },
    color: {
      control: 'select',
      options: [...BUTTON_COLORS] as string[],
      description: 'The color token for the button',
    },
    size: {
      control: 'select',
      options: [...BUTTON_SIZES] as string[],
      description: 'The size of the button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'See More',
    onClick: () => alert('Hello'),
    variant: 'filled',
    size: 'large',
    color: 'brand',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_COLORS.flatMap((color) =>
          BUTTON_SIZES.map((size) => (
            <div
              key={`${variant}-${color}-${size}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {variant} / {color} / {size}
              </span>
              <Button label={`${color} ${size}`} variant={variant} color={color} size={size} />
            </div>
          ))
        )
      )}
    </div>
  ),
};

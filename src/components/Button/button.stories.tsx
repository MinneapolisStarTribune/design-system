import type { Meta, StoryObj } from '@storybook/react';

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

export const ConfigurableButton: Story = {
  args: {
    label: 'See More',
    onClick: () => alert('Hello'),
    variant: 'filled',
    size: 'large',
    color: 'brand',
  },
};

export const WithIcon: Story = {
  args: {
    ...ConfigurableButton.args,
    icon: 'camera-filled',
    iconPosition: 'start',
  },
};

export const ButtonWithIcon: Story = {
  args: {
    label: 'View All Sports Hubs',
    onClick: () => alert('Clicked'),
    variant: 'filled',
    icon: 'camera-filled',
    iconPosition: 'start',
  },
};

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

// Simple anchor component for Storybook links
const Anchor = (props: React.ComponentProps<'a'>) => <a {...props} />;

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfigurableButton: Story = {
  args: {
    label: 'See More',
    onClick: () => alert('Hello'),
    variant: 'filled',
    size: 'large',
    color: 'neutral',
  },
};

export const WithIcon: Story = {
  args: {
    ...ConfigurableButton.args,
    icon: 'camera-filled',
    iconPosition: 'start',
  },
};

export const PrimaryLink: Story = {
  args: {
    label: 'See More',
    as: Anchor, // <-- pass 'a' as Link component
    href: '#',
    variant: 'primary',
    size: 'large',
  },
};

export const SecondaryButton: Story = {
  args: {
    label: 'See More',
    onClick: () => alert('Hello'),
    variant: 'secondary',
  },
};

export const SecondaryLink: Story = {
  args: {
    label: 'See More',
    as: Anchor,
    href: '#',
    variant: 'secondary',
  },
};

export const TextLink: Story = {
  args: {
    label: 'See More',
    as: Anchor,
    href: '#',
    variant: 'text',
  },
};

export const ButtonWithIcon: Story = {
  args: {
    label: 'View All Sports Hubs',
    onClick: () => alert('Clicked'),
    variant: 'text',
    icon: 'camera-filled',
    iconPosition: 'start',
  },
};

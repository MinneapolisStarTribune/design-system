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

export const PrimaryButton: Story = {
  args: {
    label: 'See More',
    onClick: () => alert('Hello'),
    variant: 'primary',
    size: 'lg',
  },
};

export const PrimaryButtonIconStart: Story = {
  args: {
    ...PrimaryButton.args,
    iconPosition: 'start',
  },
};

export const PrimaryLink: Story = {
  args: {
    label: 'See More',
    as: Anchor, // <-- pass 'a' as Link component
    href: '#',
    variant: 'primary',
    size: 'lg',
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

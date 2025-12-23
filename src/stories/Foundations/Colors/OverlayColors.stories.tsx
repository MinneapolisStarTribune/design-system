import type { Meta, StoryObj } from '@storybook/react';
import { ThemeAwareColorCategory } from './ThemeAwareColorCategory';

const meta = {
  title: 'Foundations/Colors/Overlay Colors',
  component: () => null,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ThemeAwareColorCategory category="overlay" />,
};


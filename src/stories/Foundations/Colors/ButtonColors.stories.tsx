import type { Meta, StoryObj } from '@storybook/react';
import { ThemeAwareColorCategory } from './ThemeAwareColorCategory';

const meta = {
  title: 'Foundations/Colors/Button Colors',
  component: () => null,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Group button colors by type (filled, outlined, ghost, utility)
const groupButtonColors = (colorKey: string): string | null => {
  if (colorKey.includes('filled')) return 'filled';
  if (colorKey.includes('outlined')) return 'outlined';
  if (colorKey.includes('ghost')) return 'ghost';
  if (colorKey.includes('utility')) return 'utility';
  return null;
};

export const Default: Story = {
  render: () => <ThemeAwareColorCategory category="button" groupBy={groupButtonColors} />,
};


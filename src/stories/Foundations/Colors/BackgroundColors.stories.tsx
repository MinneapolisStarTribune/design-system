import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeAwareColorCategory } from './ThemeAwareColorCategory';

const meta = {
  title: 'Foundations/Colors/Background Colors',
  component: () => null,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <ThemeAwareColorCategory category="background" />,
};

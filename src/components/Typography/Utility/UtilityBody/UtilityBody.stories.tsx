// UtilityBody.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityBody } from './UtilityBody';

const meta = {
  title: 'Foundations/Typography/UtilityBody',
  component: UtilityBody,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'italic', 'medium', 'semibold', 'bold'],
    },
  },
} satisfies Meta<typeof UtilityBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Utility body text is designed for readability at a variety of sizes.',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CandyBar } from './CandyBar';

const meta = {
  title: 'Feedback & Status/CandyBar',
  component: CandyBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: 'text' },
    onClose: { action: 'onClose' },
  },
} satisfies Meta<typeof CandyBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'CandyBar',
    onClose: () => {},
  },
} satisfies Story;

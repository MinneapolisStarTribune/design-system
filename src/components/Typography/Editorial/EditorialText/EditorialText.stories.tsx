import type { Meta, StoryObj } from '@storybook/react-vite';
import { FontWeight, SIZES } from '../../../../types/globalTypes';
import { EditorialText } from './EditorialText';

const meta = {
  title: 'Foundations/Typography/Editorial/EditorialText',
  component: EditorialText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
      description: 'The size of the editorial text',
    },
    weight: {
      control: 'select',
      options: ['regular', 'bold'] as Extract<FontWeight, 'regular' | 'bold'>[],
      description: 'The font weight of the editorial text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial text',
    },
  },
} satisfies Meta<typeof EditorialText>;

export default meta;
type Story = StoryObj<typeof meta>;

// Configurable
export const Default: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial text. Use it for long-form content and article bodies.',
  },
};

// XX-Small
export const XxSmallRegular: Story = {
  name: 'XX-Small / Regular',
  args: { size: 'xx-small', weight: 'regular', children: 'XX-Small Regular editorial text' },
};

export const XxSmallBold: Story = {
  name: 'XX-Small / Bold',
  args: { size: 'xx-small', weight: 'bold', children: 'XX-Small Bold editorial text' },
};

// X-Small
export const XSmallRegular: Story = {
  name: 'X-Small / Regular',
  args: { size: 'x-small', weight: 'regular', children: 'X-Small Regular editorial text' },
};

export const XSmallBold: Story = {
  name: 'X-Small / Bold',
  args: { size: 'x-small', weight: 'bold', children: 'X-Small Bold editorial text' },
};

// Small
export const SmallRegular: Story = {
  name: 'Small / Regular',
  args: { size: 'small', weight: 'regular', children: 'Small Regular editorial text' },
};

export const SmallBold: Story = {
  name: 'Small / Bold',
  args: { size: 'small', weight: 'bold', children: 'Small Bold editorial text' },
};

// Medium
export const MediumRegular: Story = {
  name: 'Medium / Regular',
  args: { size: 'medium', weight: 'regular', children: 'Medium Regular editorial text' },
};

export const MediumBold: Story = {
  name: 'Medium / Bold',
  args: { size: 'medium', weight: 'bold', children: 'Medium Bold editorial text' },
};

// Large
export const LargeRegular: Story = {
  name: 'Large / Regular',
  args: { size: 'large', weight: 'regular', children: 'Large Regular editorial text' },
};

export const LargeBold: Story = {
  name: 'Large / Bold',
  args: { size: 'large', weight: 'bold', children: 'Large Bold editorial text' },
};

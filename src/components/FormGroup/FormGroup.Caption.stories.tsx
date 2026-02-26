import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';
import { FormControl } from '../FormControl/FormControl';

const meta = {
  title: 'Components/Actions & Inputs/FormGroup/Caption',
  component: FormGroup.Caption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'error', 'success'],
      description: 'Caption variant',
    },
    children: {
      control: 'text',
      description: 'Caption text',
    },
  },
  decorators: [
    (Story) => (
      <FormGroup>
        <FormGroup.Label>Email Address</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter your email" />
        <Story />
      </FormGroup>
    ),
  ],
} satisfies Meta<typeof FormGroup.Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'We recommend using a strong, unique password.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Please enter a valid email address.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Email format looks good.',
  },
};

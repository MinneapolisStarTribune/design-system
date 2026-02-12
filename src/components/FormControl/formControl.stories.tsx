import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from './FormControl';

const meta = {
  title: 'Components/Actions & Inputs/FormControl',
  component: FormControl,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the form control',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the form control is disabled',
    },
  },
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  parameters: {
    docs: {
      description: {
        component:
          'Text inputs allow users to enter short, single-line text such as names, email addresses, or search queries. They support multiple sizes, optional labels and descriptions, validation states, and icon affordances to accommodate a wide range of use cases across the product.',
      },
    },
  },
  render: () => <FormControl.TextInput placeholderText="Enter text" size="medium" />,
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';
import { FormControl } from '../FormControl/FormControl';

const meta = {
  title: 'Components/Actions & Inputs/FormGroup/Description',
  component: FormGroup.Description,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content of the description text.',
    },
    id: {
      control: 'text',
      description: 'Optional id attribute for the description element.',
    },
  },
} satisfies Meta<typeof FormGroup.Description>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCustomIdAndTestId: Story = {
  args: {
    id: 'email-description',
    children: 'Description with custom id.',
  },
};

export const LongText: Story = {
  args: {
    children:
      'This description provides additional context about the form field, explaining what information is required and how it will be used. It can span multiple sentences and should remain readable at smaller sizes.',
  },
};

export const WithLabel: Story = {
  args: {
    children: "We'll never share your email.",
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label>Email address</FormGroup.Label>
      <FormGroup.Description {...args} />
      <FormControl.TextInput placeholderText="you@example.com" />
    </FormGroup>
  ),
};

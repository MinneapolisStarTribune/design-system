import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';
import { FormControl } from '../FormControl/FormControl';

const meta = {
  title: 'Components/Actions & Inputs/FormGroup/FormGroup.Label',
  component: FormGroup.Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text',
    },
    id: {
      control: 'text',
      description: 'ID for the label element (falls back to FormGroup context labelId when inside FormGroup)',
    },
    htmlFor: {
      control: 'text',
      description:
        'Associates the label with a form control by id (falls back to FormGroup context inputId when inside FormGroup)',
    },
    required: {
      control: 'boolean',
      description: 'When true, appends " (Optional)" to the label',
    },
  },
} satisfies Meta<typeof FormGroup.Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label {...args} />
      <FormControl.TextInput placeholderText="Enter email" />
    </FormGroup>
  ),
};

export const Configurable: Story = {
  args: {
    children: 'Field Label',
    required: false,
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label {...args} />
      <FormControl.TextInput placeholderText="Placeholder" />
    </FormGroup>
  ),
};

export const WithOptional: Story = {
  args: {
    children: 'Phone Number',
    required: true,
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label {...args} />
      <FormControl.TextInput placeholderText="Optional field" />
    </FormGroup>
  ),
};

export const Standalone: Story = {
  args: {
    children: 'Standalone label (with htmlFor)',
    htmlFor: 'standalone-input',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <FormGroup.Label {...args} />
      <input id="standalone-input" type="text" placeholder="Associated input" />
    </div>
  ),
};

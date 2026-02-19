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
    element: {
      control: 'select',
      options: ['label', 'span', 'div'],
      description: 'HTML element to render',
    },
    size: {
      control: 'select',
      options: ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large'],
      description: 'Typography size (utility text class)',
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
      description: 'Typography weight (utility text class)',
    },
    required: {
      control: 'boolean',
      description: 'When true, appends " (Optional)" to the label',
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control by id',
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
    element: 'label',
    size: 'small',
    weight: 'regular',
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

export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormGroup>
        <FormGroup.Label size="xx-small" weight="regular">
          xx-small / regular
        </FormGroup.Label>
        <FormControl.TextInput placeholderText="Input" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label size="small" weight="regular">
          small / regular
        </FormGroup.Label>
        <FormControl.TextInput placeholderText="Input" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label size="medium" weight="semibold">
          medium / semibold
        </FormGroup.Label>
        <FormControl.TextInput placeholderText="Input" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label size="large" weight="bold">
          large / bold
        </FormGroup.Label>
        <FormControl.TextInput placeholderText="Input" />
      </FormGroup>
    </div>
  ),
};

export const Standalone: Story = {
  args: {
    children: 'Standalone label (with htmlFor)',
    htmlFor: 'standalone-input',
    size: 'small',
    weight: 'regular',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <FormGroup.Label {...args} />
      <input id="standalone-input" type="text" placeholder="Associated input" />
    </div>
  ),
};

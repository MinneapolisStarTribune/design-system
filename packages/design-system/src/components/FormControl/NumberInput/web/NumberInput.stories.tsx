import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

const meta = {
  title: 'Forms/FormControl/NumberInput',
  component: FormControl.NumberInput,
  parameters: {
    docs: {
      description: {
        component:
          'NumberInput is a numeric-only field built on TextInput. It renders an HTML number input with numeric keyboard hints and FormGroup accessibility wiring.',
      },
    },
  },
  argTypes: {
    placeholderText: {
      control: 'number',
      description: 'Numeric placeholder value shown when empty.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input size.',
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded corners.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    isError: {
      control: 'boolean',
      description: 'Error state (red border).',
    },
    isSuccess: {
      control: 'boolean',
      description: 'Success state (green border).',
    },
  },
} satisfies Meta<typeof FormControl.NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledNumberInput = (args: Record<string, unknown>) => {
  const [value, setValue] = useState('42');

  return (
    <FormGroup>
      <FormGroup.Label>Build Number</FormGroup.Label>
      <FormControl.NumberInput
        {...args}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        aria-label="Build number"
      />
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    placeholderText: 1234,
    size: 'large',
    rounded: false,
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
  render: (args) => <ControlledNumberInput {...args} />,
};

export const WithValidationCaption: Story = {
  args: {
    placeholderText: 1000,
    isError: true,
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label>Order Number</FormGroup.Label>
      <FormControl.NumberInput {...args} aria-label="Order number" />
      <FormGroup.Caption variant="error">Enter digits only.</FormGroup.Caption>
    </FormGroup>
  ),
};

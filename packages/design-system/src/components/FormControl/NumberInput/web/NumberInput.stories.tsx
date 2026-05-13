import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { NumberInputProps } from '../NumberInput.types';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

interface VariantCellProps extends NumberInputProps {
  label: string;
  description?: string;
  caption?: string;
  captionVariant?: 'info' | 'error' | 'success';
  optionalLabel?: boolean;
}

const VariantCell = ({
  label,
  description,
  caption,
  captionVariant = 'info',
  optionalLabel,
  ...inputProps
}: VariantCellProps) => (
  <div style={{ minWidth: 0 }}>
    <SectionLabel>{label}</SectionLabel>
    <FormGroup>
      <FormGroup.Label optional={optionalLabel}>Label</FormGroup.Label>
      {description && <FormGroup.Description>{description}</FormGroup.Description>}
      <FormControl.NumberInput {...inputProps} aria-label={label} />
      {caption && <FormGroup.Caption variant={captionVariant}>{caption}</FormGroup.Caption>}
    </FormGroup>
  </div>
);

const meta = {
  title: 'Forms/FormControl/NumberInput',
  component: FormControl.NumberInput,
  parameters: {
    docs: {
      description: {
        component:
          'NumberInput is a numeric-only field built on TextInput. It renders an HTML number input with numeric keyboard hints, built-in stepper controls, and FormGroup accessibility wiring.',
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
    isDisabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    isError: {
      control: 'boolean',
      description: 'Error state (red border).',
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
      {Boolean(args.isError) && (
        <FormGroup.Caption variant="error">Enter a valid number.</FormGroup.Caption>
      )}
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    placeholderText: 1234,
    size: 'medium',
    isDisabled: false,
    isError: false,
  },
  render: (args) => <ControlledNumberInput {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'All variants: Size, Label, States, and Captions.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2rem 1.5rem',
        padding: '1.5rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <VariantCell label="Size: Small" placeholderText={1234} size="small" />
      <VariantCell label="Size: Medium (Default)" placeholderText={1234} size="medium" />
      <VariantCell label="Size: Large" placeholderText={1234} size="large" />
      <VariantCell label="Label: Default" placeholderText={1234} />
      <VariantCell label="Label: Optional" placeholderText={1234} optionalLabel />
      <VariantCell
        label="Label + Description"
        placeholderText={1234}
        description="Enter a valid number"
      />
      <VariantCell label="State: Default" placeholderText={1234} />
      <VariantCell label="State: Filled" value={42} />
      <VariantCell label="State: Disabled" placeholderText={1234} isDisabled />
      <VariantCell
        label="State: Error"
        placeholderText={1234}
        isError
        caption="Enter a valid number."
        captionVariant="error"
      />
      <VariantCell
        label="Caption: Info"
        placeholderText={1234}
        caption="Digits only."
        captionVariant="info"
      />
    </div>
  ),
};

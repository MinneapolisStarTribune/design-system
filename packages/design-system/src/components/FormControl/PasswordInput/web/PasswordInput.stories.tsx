import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { PasswordInputProps } from '../PasswordInput.types';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

interface VariantCellProps extends PasswordInputProps {
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
      <FormControl.PasswordInput {...inputProps} aria-label={label} />
      {caption && <FormGroup.Caption variant={captionVariant}>{caption}</FormGroup.Caption>}
    </FormGroup>
  </div>
);

const meta = {
  title: 'Forms/FormControl/PasswordInput',
  component: FormControl.PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          'PasswordInput is a masked text field built on TextInput. It renders a password input with a show/hide toggle, screen reader announcements, and password-manager autocomplete hints.',
      },
    },
  },
  argTypes: {
    placeholderText: {
      control: 'text',
      description: 'Placeholder text when empty.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input size.',
    },
    autoComplete: {
      control: 'select',
      options: ['current-password', 'new-password'],
      description: 'Password manager hint (WCAG 1.3.5).',
    },
    defaultPasswordVisible: {
      control: 'boolean',
      description: 'Initial visibility when uncontrolled.',
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
} satisfies Meta<typeof FormControl.PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledPasswordInput = (args: Record<string, unknown>) => {
  const [value, setValue] = useState('password123!');

  return (
    <FormGroup>
      <FormGroup.Label>Password</FormGroup.Label>
      <FormControl.PasswordInput
        {...args}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        aria-label="Password"
        autoComplete="current-password"
      />
      {Boolean(args.isError) && (
        <FormGroup.Caption variant="error">Password is required.</FormGroup.Caption>
      )}
      {Boolean(args.isSuccess) && !args.isError && (
        <FormGroup.Caption variant="success">Password meets requirements.</FormGroup.Caption>
      )}
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    placeholderText: 'Placeholder text',
    size: 'medium',
    autoComplete: 'current-password',
    defaultPasswordVisible: false,
    isDisabled: false,
    isError: false,
    isSuccess: true,
  },
  render: (args) => <ControlledPasswordInput {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'All variants: size, labeling, states, and visibility.',
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
      <VariantCell
        label="Size: Small"
        placeholderText="Placeholder text"
        size="small"
        autoComplete="current-password"
      />
      <VariantCell
        label="Size: Medium (Default)"
        placeholderText="Placeholder text"
        size="medium"
        autoComplete="current-password"
      />
      <VariantCell
        label="Size: Large"
        placeholderText="Placeholder text"
        size="large"
        autoComplete="current-password"
      />
      <VariantCell
        label="Label: Default"
        placeholderText="Placeholder text"
        autoComplete="current-password"
      />
      <VariantCell
        label="Label: Optional"
        placeholderText="Placeholder text"
        optionalLabel
        autoComplete="current-password"
      />
      <VariantCell
        label="Label + Description"
        placeholderText="Placeholder text"
        description="Use at least 8 characters."
        autoComplete="new-password"
      />
      <VariantCell
        label="State: Default"
        placeholderText="Placeholder text"
        autoComplete="current-password"
      />
      <VariantCell label="State: Filled" value="password123!" autoComplete="current-password" />
      <VariantCell label="State: Hidden" value="password123!" autoComplete="current-password" />
      <VariantCell
        label="State: Visible"
        value="password123!"
        defaultPasswordVisible
        autoComplete="current-password"
      />
      <VariantCell
        label="State: Disabled"
        placeholderText="Placeholder text"
        isDisabled
        autoComplete="current-password"
      />
      <VariantCell
        label="State: Error"
        placeholderText="Placeholder text"
        isError
        caption="Password is required."
        captionVariant="error"
        autoComplete="current-password"
      />
      <VariantCell
        label="State: Error (Filled)"
        value="password123!"
        isError
        caption="Password is required."
        captionVariant="error"
        autoComplete="current-password"
      />
      <VariantCell
        label="State: Success"
        value="password123!"
        isSuccess
        caption="Password meets requirements."
        captionVariant="success"
        autoComplete="new-password"
      />
      <VariantCell
        label="State: Success (Visible)"
        value="password123!"
        isSuccess
        defaultPasswordVisible
        caption="Password meets requirements."
        captionVariant="success"
        autoComplete="new-password"
      />
      <VariantCell
        label="Rounded"
        placeholderText="Placeholder text"
        rounded
        autoComplete="current-password"
      />
      <VariantCell
        label="Caption: Info"
        placeholderText="Placeholder text"
        caption="We recommend using a strong, unique password."
        captionVariant="info"
        autoComplete="new-password"
      />
    </div>
  ),
};

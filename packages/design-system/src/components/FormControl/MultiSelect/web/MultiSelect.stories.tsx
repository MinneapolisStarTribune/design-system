import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { MultiSelectProps } from '../MultiSelect.types';

const OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
  disabled: i === 4, // Disable the 5th option for demonstration
}));

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const meta = {
  title: 'Forms/FormControl/MultiSelect',
  component: FormControl.MultiSelect,
  parameters: {
    docs: {
      description: {
        component:
          'MultiSelect allows users to toggle multiple choices in a dropdown without closing after each selection.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    rounded: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    success: {
      control: 'boolean',
    },
    placeholderText: {
      control: 'text',
    },
    options: {
      control: 'object',
    },
    value: {
      control: 'object',
      description: 'Controlled selected values array',
    },
  },
} satisfies Meta<typeof FormControl.MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfigurableComponent = (args: Partial<MultiSelectProps>) => {
  const [internalValue, setInternalValue] = useState<string[]>(args.value ?? []);
  const selectedValues = args.value ?? internalValue;

  return (
    <FormGroup>
      <FormGroup.Label>Interests</FormGroup.Label>
      <FormControl.MultiSelect
        {...args}
        id="multi-select-configurable"
        options={args.options ?? OPTIONS}
        value={selectedValues}
        onChange={(nextValues: string[]) => {
          setInternalValue(nextValues);
          args.onChange?.(nextValues);
        }}
      />
      {args.error ? (
        <FormGroup.Caption variant="error">Please select at least one option</FormGroup.Caption>
      ) : args.success ? (
        <FormGroup.Caption variant="success">Selection looks good</FormGroup.Caption>
      ) : (
        <FormGroup.Caption variant="info">Choose one or more options</FormGroup.Caption>
      )}
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    size: 'medium',
    rounded: false,
    disabled: false,
    error: false,
    success: false,
    placeholderText: 'Select your interests',
    options: OPTIONS,
  },
  render: (args) => <ConfigurableComponent {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => {
    const cellStyle = { minWidth: 0 };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={cellStyle}>
          <SectionLabel>Size: Small</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} size="small" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Medium</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} size="medium" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Large</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} size="large" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Pointy</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Rounded</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} rounded />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Disabled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} disabled value={['tech']} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Error</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} error />
            <FormGroup.Caption variant="error">Please select at least one option</FormGroup.Caption>
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Success</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} success value={['tech', 'sports']} />
            <FormGroup.Caption variant="success">Looks good</FormGroup.Caption>
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Disabled Option + Preselected</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Interests</FormGroup.Label>
            <FormControl.MultiSelect options={OPTIONS} value={['tech', 'music']} />
          </FormGroup>
        </div>
      </div>
    );
  },
};

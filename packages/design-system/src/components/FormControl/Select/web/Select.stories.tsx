import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import { SelectProps } from './Select.types';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const OPTIONS = [
  { value: '1', label: 'Option' },
  { value: '2', label: 'Option' },
  { value: '3', label: 'Option' },
  { value: '4', label: 'Option' },
  { value: '5', label: 'Option' },
  { value: '6', label: 'Option' },
  { value: '7', label: 'Option' },
  { value: '8', label: 'Option' },
  { value: '9', label: 'Option' },
  { value: '10', label: 'Option', disabled: true },
];

const meta = {
  title: 'Components/Actions & Inputs/Select',
  component: FormControl.Select,
  parameters: {
    docs: {
      description: {
        component:
          'Select allows users to choose one option from a dropdown list. Supports multiple sizes, validation states, labels, and integrates with FormGroup.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    radius: {
      control: 'select',
      options: ['pointy', 'rounded'],
    },
    isDisabled: {
      control: 'boolean',
    },
    isError: {
      control: 'boolean',
    },
    placeholderText: {
      control: 'text',
    },
    showPlaceholder: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormControl.Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfigurableComponent = (args: Partial<SelectProps>) => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <FormGroup>
      <FormGroup.Label>Label</FormGroup.Label>

      <FormControl.Select
        id="select-configurable"
        options={OPTIONS}
        {...args}
        value={value}
        onChange={setValue}
      />

      <FormGroup.Caption variant="info">Informational message</FormGroup.Caption>
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    size: 'medium',
    radius: 'pointy',
    isDisabled: false,
    isError: false,
    placeholderText: 'Select an option',
    showPlaceholder: true,
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Sizes */}
        <div style={cellStyle}>
          <SectionLabel>Size: Small</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="small" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Medium</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="medium" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Large</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="large" />
          </FormGroup>
        </div>

        {/* Radius */}
        <div style={cellStyle}>
          <SectionLabel>Radius: Pointy</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} radius="pointy" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Rounded</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} radius="rounded" />
          </FormGroup>
        </div>

        {/* Label Variants */}
        <div style={cellStyle}>
          <SectionLabel>Label: Default</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Label: Optional</SectionLabel>
          <FormGroup>
            <FormGroup.Label optional>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Label + Description</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormGroup.Description>Description text here</FormGroup.Description>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>No Label</SectionLabel>
          <FormControl.Select options={OPTIONS} aria-label="No label select" />
        </div>

        {/* Placeholder */}
        <div style={cellStyle}>
          <SectionLabel>Placeholder: True</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select
              options={OPTIONS}
              placeholderText="Select an option"
              showPlaceholder
            />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Placeholder: False</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} showPlaceholder={false} />
          </FormGroup>
        </div>

        {/* States */}
        <div style={cellStyle}>
          <SectionLabel>State: Default</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Filled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} value="us" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Error</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} isError />
            <FormGroup.Caption variant="error">Error message</FormGroup.Caption>
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Disabled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} isDisabled />
          </FormGroup>
        </div>
      </div>
    );
  },
};

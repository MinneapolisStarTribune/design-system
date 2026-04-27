import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { SelectProps } from '../Select.types';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const OPTIONS = [
  { value: '1', label: 'Option-1' },
  { value: '2', label: 'Option-2' },
  { value: '3', label: 'Option-3' },
  { value: '4', label: 'Option-4' },
  { value: '5', label: 'Option-5' },
  { value: '6', label: 'Option-6' },
  { value: '7', label: 'Option-7' },
  { value: '8', label: 'Option-8' },
  { value: '9', label: 'Option-9' },
  { value: '10', label: 'Option-0', disabled: true },
];

const meta = {
  title: 'Forms/FormControl/Select',
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
      description: 'Select visual size.',
    },
    rounded: {
      control: 'boolean',
      description: 'Applies pill-style rounded corners.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled styling.',
    },
    isError: {
      control: 'boolean',
      description: 'Applies error state styling.',
    },
    placeholderText: {
      control: 'text',
      description: 'Placeholder text shown when no option is selected.',
    },
    showPlaceholder: {
      control: 'boolean',
      description: 'Whether placeholder text is shown when value is empty.',
    },
    value: {
      control: 'text',
      description: 'Controlled selected option value.',
    },
  },
} satisfies Meta<typeof FormControl.Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfigurableComponent = (args: Partial<SelectProps>) => {
  const [internalValue, setInternalValue] = useState<string | undefined>();

  const isControlled = args.value !== undefined;
  const value = isControlled ? args.value : internalValue;

  return (
    <FormGroup>
      <FormGroup.Label>Label</FormGroup.Label>

      <FormControl.Select
        id="select-configurable"
        {...args}
        options={args.options ?? OPTIONS}
        value={value}
        onChange={(val: string) => {
          if (!isControlled) setInternalValue(val);
          args.onChange?.(val);
        }}
      />

      {args.isError ? (
        <FormGroup.Caption variant="error">Error message</FormGroup.Caption>
      ) : (
        <FormGroup.Caption variant="info">Informational message</FormGroup.Caption>
      )}
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    size: 'medium',
    rounded: false,
    isDisabled: false,
    isError: false,
    placeholderText: 'Select an option',
    showPlaceholder: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<FormGroup>
  <FormGroup.Label>Country</FormGroup.Label>
  <FormControl.Select
    id="country-select"
    options={options}
    value={value}
    onChange={setValue}
    placeholderText="Select an option"
    showPlaceholder
    size="medium"
  />
</FormGroup>`,
      },
    },
  },
  render: (args) => <ConfigurableComponent {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      source: {
        code: `<div
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
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Rounded</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} rounded />
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
            <FormControl.Select options={OPTIONS} value="1" />
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
      </div>`,
      },
    },
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
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Rounded</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} rounded />
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
            <FormControl.Select options={OPTIONS} value="1" />
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

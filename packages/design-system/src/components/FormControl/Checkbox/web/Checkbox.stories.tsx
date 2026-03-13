import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { UtilityLabel } from '@/components/Typography/Utility';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const meta = {
  title: 'Components/Actions & Inputs/Checkbox',
  component: FormControl.Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Checkboxes allow users to select multiple options in forms, filters, and settings. Use neutral checkboxes by default. Brand checkboxes are for specific uses within a brand. Supports optional labels and captions. The indeterminate state signifies mixed selection and must be set programmatically.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Required label text',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Indeterminate state (mixed selection). Set programmatically; user interaction transitions to checked or unchecked.',
    },
    variant: {
      control: 'select',
      options: ['neutral', 'brand'],
      description: 'Color variant',
    },
    caption: {
      control: 'text',
      description: 'Optional caption text below the label',
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Checkbox size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
  },
} satisfies Meta<typeof FormControl.Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'Subscribe to newsletter',
    caption: 'Will sign you up for a daily email.',
    checked: false,
    indeterminate: false,
    variant: 'brand',
    size: 'default',
    disabled: false,
    error: false,
  },
  render: function ConfigurableRender(args) {
    const [checked, setChecked] = useState(args.checked);
    useEffect(() => {
      setChecked(args.checked);
    }, [args.checked]);
    return (
      <FormControl.Checkbox
        {...args}
        checked={checked}
        onChange={setChecked}
        dataTestId="checkbox-configurable"
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All variants per the design spec: neutral and brand, unchecked/checked/indeterminate, disabled, error, and size options.',
      },
    },
  },
  render: function AllVariantsRender() {
    const [states, setStates] = useState<Record<string, boolean>>({});
    const toggle = (key: string) => setStates((s) => ({ ...s, [key]: !s[key] }));

    const cellStyle = { minWidth: 0 };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Neutral - Unchecked (Default) */}
        <div style={cellStyle}>
          <SectionLabel>Neutral / Unchecked (Default)</SectionLabel>
          <FormControl.Checkbox
            label="Option"
            checked={false}
            onChange={() => {}}
            variant="neutral"
            size="default"
            dataTestId="neutral-unchecked"
          />
        </div>

        {/* Neutral - Checked (Small) */}
        <div style={cellStyle}>
          <SectionLabel>Neutral / Checked (Small)</SectionLabel>
          <FormControl.Checkbox
            label="Option"
            checked={true}
            onChange={() => {}}
            variant="neutral"
            size="small"
            dataTestId="neutral-checked"
          />
        </div>

        {/* Neutral - Indeterminate (Default) */}
        <div style={cellStyle}>
          <SectionLabel>Neutral / Indeterminate (Default)</SectionLabel>
          <FormControl.Checkbox
            label="Select all"
            checked={false}
            indeterminate
            onChange={() => {}}
            variant="neutral"
            size="default"
            dataTestId="neutral-indeterminate"
          />
        </div>

        {/* Brand - Unchecked (Small) */}
        <div style={cellStyle}>
          <SectionLabel>Brand / Unchecked (Small)</SectionLabel>
          <FormControl.Checkbox
            label="Option"
            checked={false}
            onChange={() => {}}
            variant="brand"
            size="small"
            dataTestId="brand-unchecked"
          />
        </div>

        {/* Brand - Checked (Default) */}
        <div style={cellStyle}>
          <SectionLabel>Brand / Checked (Default)</SectionLabel>
          <FormControl.Checkbox
            label="Option"
            checked={true}
            onChange={() => {}}
            variant="brand"
            size="default"
            dataTestId="brand-checked"
          />
        </div>

        {/* With caption (Default) */}
        <div style={cellStyle}>
          <SectionLabel>With Caption (Default)</SectionLabel>
          <FormControl.Checkbox
            label="Subscribe"
            caption="Daily email updates"
            checked={states.withDesc ?? false}
            onChange={() => toggle('withDesc')}
            variant="neutral"
            size="default"
            dataTestId="with-caption"
          />
        </div>

        {/* Error (Small) */}
        <div style={cellStyle}>
          <SectionLabel>Error State (Small)</SectionLabel>
          <FormControl.Checkbox
            label="Required option"
            caption="You must select this"
            checked={false}
            error
            onChange={() => {}}
            variant="neutral"
            size="small"
            dataTestId="error-state"
          />
        </div>

        {/* Disabled unchecked (Default) */}
        <div style={cellStyle}>
          <SectionLabel>Disabled / Unchecked (Default)</SectionLabel>
          <FormControl.Checkbox
            label="Option"
            checked={false}
            disabled
            onChange={() => {}}
            variant="neutral"
            size="default"
            dataTestId="disabled-unchecked"
          />
        </div>

        {/* Disabled checked (Small) */}
        <div style={cellStyle}>
          <SectionLabel>Disabled / Checked (Small)</SectionLabel>
          <FormControl.Checkbox
            label="Option"
            checked={true}
            disabled
            onChange={() => {}}
            variant="neutral"
            size="small"
            dataTestId="disabled-checked"
          />
        </div>

        {/* Default size */}
        <div style={cellStyle}>
          <SectionLabel>Default Size</SectionLabel>
          <FormControl.Checkbox
            label="Standard option"
            checked={states.defaultSize ?? false}
            onChange={() => toggle('defaultSize')}
            variant="neutral"
            size="default"
            dataTestId="default-size"
          />
        </div>

        {/* Small size */}
        <div style={cellStyle}>
          <SectionLabel>Small Size</SectionLabel>
          <FormControl.Checkbox
            label="Compact option"
            checked={states.small ?? false}
            onChange={() => toggle('small')}
            variant="neutral"
            size="small"
            dataTestId="small-size"
          />
        </div>
      </div>
    );
  },
};

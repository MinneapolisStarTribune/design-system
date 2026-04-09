import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Actions & Inputs/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Required title text',
    },
    description: {
      control: 'text',
      description: 'Optional description text below the title',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
      description: 'Color variant',
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
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    title: 'Subscribe to newsletter',
    description: "You'll receive weekly updates and announcements.",
    checked: false,
    color: 'brand',
    disabled: false,
    error: false,
  },
  render: function ConfigurableRender(args) {
    const [checked, setChecked] = useState(args.checked);

    useEffect(() => {
      setChecked(args.checked);
    }, [args.checked]);

    return (
      <Radio {...args} checked={checked} onChange={setChecked} dataTestId="radio-configurable" />
    );
  },
};

export const Unchecked: Story = {
  render: () => (
    <Radio
      title="Receive product updates"
      description="We send one message each week."
      checked={false}
      onChange={() => {}}
      dataTestId="radio-unchecked"
    />
  ),
};

export const Checked: Story = {
  render: () => (
    <Radio
      title="Receive product updates"
      description="We send one message each week."
      checked={true}
      color="brand"
      onChange={() => {}}
      dataTestId="radio-checked"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Radio
      title="Disabled option"
      description="This choice is not available."
      checked={false}
      disabled
      onChange={() => {}}
      dataTestId="radio-disabled"
    />
  ),
};

export const Error: Story = {
  render: function ErrorRender() {
    const [checked, setChecked] = useState(false);
    return (
      <Radio
        title="Required choice"
        description="You must select one option."
        checked={checked}
        error
        onChange={setChecked}
        dataTestId="radio-error"
      />
    );
  },
};

export const ColorVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function ColorVariantsRender() {
    const [neutralChecked, setNeutralChecked] = useState(false);
    const [brandChecked, setBrandChecked] = useState(true);

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Radio
          title="Neutral (default)"
          description="Used for most forms."
          checked={neutralChecked}
          color="neutral"
          onChange={setNeutralChecked}
          dataTestId="radio-neutral"
        />
        <Radio
          title="Brand"
          description="Use when brand emphasis is required."
          checked={brandChecked}
          color="brand"
          onChange={setBrandChecked}
          dataTestId="radio-brand"
        />
      </div>
    );
  },
};

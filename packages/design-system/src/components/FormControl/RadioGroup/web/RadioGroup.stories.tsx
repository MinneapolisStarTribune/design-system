import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { RadioOption } from './RadioGroup';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const options: RadioOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B' },
  { value: 'c', title: 'Option C' },
];

const planOptions: RadioOption[] = [
  { value: 'basic', title: 'Basic' },
  { value: 'pro', title: 'Pro' },
  { value: 'enterprise', title: 'Enterprise' },
];

const meta = {
  title: 'Forms/FormControl/RadioGroup',
  component: FormControl.RadioGroup,
  argTypes: {
    name: {
      control: 'text',
      description: 'Shared input name for native radio behavior',
    },
    value: {
      control: 'text',
      description: 'Current selected option value',
    },
    options: {
      control: 'object',
      description: 'Options rendered in the group',
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
      description: 'Color variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state for every radio in the group',
    },
    error: {
      control: 'boolean',
      description: 'Error state for every radio in the group',
    },
  },
} satisfies Meta<typeof FormControl.RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    name: 'option',
    value: 'a',
    options,
    color: 'neutral',
    disabled: false,
    error: false,
  },
  render: function ConfigurableRender(args) {
    const [value, setValue] = useState<string | null | undefined>(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <FormGroup>
        <FormGroup.Label>Choose an option</FormGroup.Label>
        <FormControl.RadioGroup
          {...args}
          value={value}
          onChange={setValue}
          dataTestId="radio-group-configurable"
        />
      </FormGroup>
    );
  },
};

export const Optional: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function OptionalRender() {
    const [value, setValue] = useState<string | null>('a');

    return (
      <FormGroup>
        <FormGroup.Label optional>Select an option</FormGroup.Label>
        <FormControl.RadioGroup
          name="optional-example"
          value={value}
          onChange={setValue}
          options={options}
          dataTestId="radio-group-optional"
        />
      </FormGroup>
    );
  },
};

export const WithDescription: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function WithDescriptionRender() {
    const [value, setValue] = useState<string | null>('a');

    return (
      <FormGroup>
        <FormGroup.Label>Select an option</FormGroup.Label>
        <FormGroup.Description>Select only one</FormGroup.Description>
        <FormControl.RadioGroup
          name="with-description-example"
          value={value}
          onChange={setValue}
          options={options}
          dataTestId="radio-group-with-description"
        />
      </FormGroup>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: function AllVariantsRender() {
    const [neutralValue, setNeutralValue] = useState<string | null>('a');
    const [brandValue, setBrandValue] = useState<string | null>('pro');

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <SectionLabel>Neutral</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Select an option</FormGroup.Label>
            <FormControl.RadioGroup
              name="all-neutral"
              value={neutralValue}
              onChange={setNeutralValue}
              options={options}
              color="neutral"
              dataTestId="all-neutral"
            />
          </FormGroup>
        </div>

        <div>
          <SectionLabel>Brand + Description</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Select an option</FormGroup.Label>
            <FormGroup.Description>Select only one</FormGroup.Description>
            <FormControl.RadioGroup
              name="all-brand"
              value={brandValue}
              onChange={setBrandValue}
              options={planOptions}
              color="brand"
              dataTestId="all-brand"
            />
          </FormGroup>
        </div>

        <div>
          <SectionLabel>Disabled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Select an option</FormGroup.Label>
            <FormControl.RadioGroup
              name="all-disabled"
              value="b"
              onChange={() => {}}
              options={options}
              disabled
              dataTestId="all-disabled"
            />
          </FormGroup>
        </div>

        <div>
          <SectionLabel>Error</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Subscription Plan</FormGroup.Label>
            <FormGroup.Description>Select one</FormGroup.Description>
            <FormControl.RadioGroup
              name="all-error"
              value={null}
              onChange={() => {}}
              options={planOptions}
              color="brand"
              error
              dataTestId="all-error"
            />
            <FormGroup.Caption variant="error">Please select a plan</FormGroup.Caption>
          </FormGroup>
        </div>
      </div>
    );
  },
};

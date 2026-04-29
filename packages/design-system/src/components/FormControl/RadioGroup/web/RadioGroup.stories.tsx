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

const configurableOptions: RadioOption[] = [
  { value: 'cat', title: 'Cat' },
  { value: 'frog', title: 'Frog' },
  { value: 'dog', title: 'Dog' },
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
      description:
        'Options rendered in the group. Edit each item `title` to use any label (for example: Cat, Frog, Dog).',
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
    value: 'cat',
    options: configurableOptions,
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

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: function AllVariantsRender() {
    const [neutralValue, setNeutralValue] = useState<string | null>('a');
    const [optionalValue, setOptionalValue] = useState<string | null>('a');
    const [withDescriptionValue, setWithDescriptionValue] = useState<string | null>('a');
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
          <SectionLabel>Optional</SectionLabel>
          <FormGroup>
            <FormGroup.Label optional>Select an option</FormGroup.Label>
            <FormControl.RadioGroup
              name="all-optional"
              value={optionalValue}
              onChange={setOptionalValue}
              options={options}
              dataTestId="all-optional"
            />
          </FormGroup>
        </div>

        <div>
          <SectionLabel>With Description</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Select an option</FormGroup.Label>
            <FormGroup.Description>Select only one</FormGroup.Description>
            <FormControl.RadioGroup
              name="all-with-description"
              value={withDescriptionValue}
              onChange={setWithDescriptionValue}
              options={options}
              dataTestId="all-with-description"
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

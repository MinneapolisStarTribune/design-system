import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { CheckboxOption, CheckboxCategory } from './CheckboxGroup';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const meta = {
  title: 'Forms/FormControl/CheckboxGroup',
  component: FormControl.CheckboxGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox groups allow users to select multiple options within forms, filters, or settings. Supports flat mode (simple list) and category mode (organized into labeled sub-groups). Category labels show indeterminate state when some options are selected and toggle all options in that category when clicked.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: 'Array of selected option values',
    },
    options: {
      control: 'object',
      description: 'Options for flat mode (ignored when categories is provided)',
    },
    categories: {
      control: 'object',
      description: 'Categories for grouped mode (takes precedence over options)',
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
      description: 'Color variant. Neutral is default.',
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
} satisfies Meta<typeof FormControl.CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const flatOptions: CheckboxOption[] = [
  { value: 'email', title: 'Email', description: 'Receive email notifications' },
  { value: 'sms', title: 'SMS', description: 'Receive text messages' },
  { value: 'push', title: 'Push', description: 'Browser push notifications' },
];

export const Configurable: Story = {
  args: {
    value: [],
    options: flatOptions,
    color: 'neutral',
    disabled: false,
    error: false,
  },
  render: function ConfigurableRender(args) {
    const [value, setValue] = useState<string[]>(args.value ?? []);
    return (
      <FormGroup>
        <FormGroup.Label>Notification Preferences</FormGroup.Label>
        <FormGroup.Description>Choose how you&apos;d like to be notified</FormGroup.Description>
        <FormControl.CheckboxGroup
          {...args}
          value={value}
          onChange={setValue}
          options={args.options ?? flatOptions}
          dataTestId="checkbox-group-configurable"
        />
        {args.error && (
          <FormGroup.Caption variant="error">Select an option below to continue</FormGroup.Caption>
        )}
      </FormGroup>
    );
  },
};

const categoryOptions: CheckboxCategory[] = [
  {
    parentOption: {
      value: 'news',
      title: 'News',
      description: 'Stay informed with the latest news',
    },
    options: [
      { value: 'breaking', title: 'Breaking News' },
      { value: 'politics', title: 'Politics' },
      { value: 'sports', title: 'Sports' },
      { value: 'business', title: 'Business' },
    ],
  },
  {
    parentOption: {
      value: 'entertainment',
      title: 'Entertainment',
      description: 'Movies, TV, and celebrity news',
    },
    options: [
      { value: 'movies', title: 'Movies' },
      { value: 'tv', title: 'TV Shows' },
      { value: 'music', title: 'Music' },
    ],
  },
  {
    parentOption: { value: 'lifestyle', title: 'Lifestyle' },
    options: [
      { value: 'food', title: 'Food & Dining' },
      { value: 'travel', title: 'Travel' },
    ],
  },
];

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All variants: flat mode, category mode, neutral/brand colors, disabled, and error states.',
      },
    },
  },
  render: function AllVariantsRender() {
    const [flatVal, setFlatVal] = useState<string[]>([]);
    const [flatBrandVal, setFlatBrandVal] = useState<string[]>([]);
    const [categoryVal, setCategoryVal] = useState<string[]>([]);
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
          <SectionLabel>Flat Mode / Neutral</SectionLabel>
          <FormControl.CheckboxGroup
            value={flatVal}
            onChange={setFlatVal}
            options={flatOptions}
            color="neutral"
            dataTestId="all-variants-flat-neutral"
          />
        </div>
        <div style={cellStyle}>
          <SectionLabel>Flat Mode / Brand</SectionLabel>
          <FormControl.CheckboxGroup
            value={flatBrandVal}
            onChange={setFlatBrandVal}
            options={flatOptions}
            color="brand"
            dataTestId="all-variants-flat-brand"
          />
        </div>
        <div style={cellStyle}>
          <SectionLabel>Categories / Brand</SectionLabel>
          <FormControl.CheckboxGroup
            value={categoryVal}
            onChange={setCategoryVal}
            categories={categoryOptions}
            color="brand"
            dataTestId="all-variants-categories"
          />
        </div>
        <div style={cellStyle}>
          <SectionLabel>Disabled</SectionLabel>
          <FormControl.CheckboxGroup
            value={['email']}
            onChange={() => {}}
            options={flatOptions}
            disabled
            dataTestId="all-variants-disabled"
          />
        </div>
        <div style={cellStyle}>
          <SectionLabel>Error</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Select options</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={[]}
              onChange={() => {}}
              options={flatOptions}
              error
              dataTestId="all-variants-error"
            />
            <FormGroup.Caption variant="error">
              Select an option below to continue
            </FormGroup.Caption>
          </FormGroup>
        </div>
      </div>
    );
  },
};

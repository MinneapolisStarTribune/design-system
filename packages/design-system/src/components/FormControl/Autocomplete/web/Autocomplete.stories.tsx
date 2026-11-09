import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './Autocomplete';
import type { AutocompleteProps } from '../Autocomplete.types';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

const options = [
  { value: 'baseball', label: 'Baseball' },
  { value: 'softball', label: 'Softball' },
  { value: 'boys-basketball', label: 'Boys Basketball' },
  { value: 'girls-basketball', label: 'Girls Basketball' },
  { value: 'football', label: 'Football' },
  { value: 'girls-flag-football', label: 'Girls Flag Football' },
];
const meta = {
  title: 'FormControl/Autocomplete',
  component: Autocomplete,
  args: { id: 'sport', options, placeholderText: 'Select sport...' },
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState<string>();
    return <Autocomplete {...args} multiple={false} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof Autocomplete>;
export default meta;
type Story = StoryObj<
  Omit<AutocompleteProps, 'value' | 'onChange' | 'multiple'> & { multiple?: boolean }
>;
export const Default: Story = {};
export const Loading: Story = {
  name: 'Loading — Text',
  args: { options: [], loading: true, loadingVariant: 'text' },
};
export const LoadingIconText: Story = {
  name: 'Loading — Icon and Text',
  args: { options: [], loading: true, loadingVariant: 'icon-text' },
};
export const Empty: Story = { args: { options: [], noOptionsText: 'No schools found' } };
export const Disabled: Story = { args: { isDisabled: true } };
export const Error: Story = {
  args: { isError: true },
  render: function ErrorExample(args) {
    const [value, setValue] = useState<string>();
    return (
      <FormGroup>
        <FormGroup.Label htmlFor={args.id}>Sport</FormGroup.Label>
        <Autocomplete {...args} multiple={false} value={value} onChange={setValue} />
        <FormGroup.Caption variant="error">Please select a sport.</FormGroup.Caption>
      </FormGroup>
    );
  },
};
export const Checkboxes: Story = {
  args: { multiple: true },
  render: function CheckboxExample(args) {
    const [value, setValue] = useState<string[]>([]);
    return (
      <FormGroup>
        <FormGroup.Label htmlFor={args.id}>Sport</FormGroup.Label>
        <Autocomplete {...args} multiple value={value} onChange={setValue} />
      </FormGroup>
    );
  },
};
export const TeamOptions: Story = {
  args: {
    id: 'team',
    placeholderText: 'Select team...',
    options: Array.from({ length: 12 }, (_, index) => ({
      value: String(index),
      label: `Team ${index + 1}`,
    })),
    renderOption: ({ key, ...props }, option) => (
      <li key={key} {...props}>
        <img
          width={32}
          height={32}
          alt=""
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23eee'/%3E%3Cpath d='M16 5l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z' fill='%23234b75'/%3E%3C/svg%3E"
        />
        {option.label}
      </li>
    ),
  },
};

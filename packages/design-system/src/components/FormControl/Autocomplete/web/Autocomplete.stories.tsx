import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Autocomplete } from './Autocomplete';
import {
  AUTOCOMPLETE_LOADING_VARIANTS,
  AUTOCOMPLETE_SIZES,
  type AutocompleteProps,
} from '../Autocomplete.types';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import styles from './Autocomplete.stories.module.scss';

const options = [
  { value: 'baseball', label: 'Baseball' },
  { value: 'softball', label: 'Softball' },
  { value: 'boys-basketball', label: 'Boys Basketball' },
  { value: 'girls-basketball', label: 'Girls Basketball' },
  { value: 'football', label: 'Football' },
  { value: 'girls-flag-football', label: 'Girls Flag Football' },
];
type StoryArgs = AutocompleteProps;
const meta = {
  title: 'FormControl/Autocomplete',
  component: Autocomplete,
  args: {
    id: 'sport',
    options,
    placeholderText: 'Select sport...',
    loading: false,
    loadingVariant: 'text',
    size: 'medium',
  },
  argTypes: {
    value: { control: 'text' },
    size: { control: 'select', options: AUTOCOMPLETE_SIZES },
    loadingVariant: { control: 'select', options: AUTOCOMPLETE_LOADING_VARIANTS },
    isDisabled: { control: 'boolean' },
    isError: { control: 'boolean' },
    rounded: { control: 'boolean' },
    filterOptions: { control: 'boolean' },
  },
} satisfies Meta<typeof Autocomplete>;
export default meta;
type Story = StoryObj<StoryArgs>;

export const Configurable: Story = {
  render: function Render() {
    const [args, updateArgs] = useArgs<StoryArgs>();
    const { value, ...rest } = args;
    return (
      <div className={styles.preview}>
        <FormGroup>
          <FormGroup.Label htmlFor={args.id}>Sport</FormGroup.Label>
          <Autocomplete
            {...rest}
            value={value}
            onChange={(next) => {
              args.onChange?.(next);
              updateArgs({ value: next });
            }}
            onInputChange={(next) => {
              args.onInputChange?.(next);
              if (args.inputValue !== undefined) updateArgs({ inputValue: next });
            }}
          />
          {args.isError && (
            <FormGroup.Caption variant="error">Please select a sport.</FormGroup.Caption>
          )}
        </FormGroup>
      </div>
    );
  },
};

function Example({ label, ...args }: StoryArgs & { label: string }) {
  const [single, setSingle] = useState<string>();
  return (
    <section className={styles.example}>
      <FormGroup>
        <FormGroup.Label htmlFor={args.id}>{label}</FormGroup.Label>
        <Autocomplete {...args} value={single} onChange={setSingle} />
        {args.isError && (
          <FormGroup.Caption variant="error">Please select an option.</FormGroup.Caption>
        )}
      </FormGroup>
    </section>
  );
}

const renderTeam: AutocompleteProps['renderOption'] = ({ key, ...props }, option) => (
  <li key={key} {...props}>
    <img
      className={styles.logo}
      alt=""
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23eee'/%3E%3Cpath d='M16 5l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z' fill='%23234b75'/%3E%3C/svg%3E"
    />
    {option.label}
  </li>
);

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.variants}>
      {AUTOCOMPLETE_SIZES.map((size) => (
        <Example
          key={size}
          id={`size-${size}`}
          label={`${size} size`}
          options={options}
          size={size}
        />
      ))}
      <Example id="rounded" label="Rounded" options={options} rounded />
      <Example id="disabled" label="Disabled" options={options} isDisabled />
      <Example id="error" label="Error" options={options} isError />
      <Example id="empty" label="Empty results" options={[]} noOptionsText="No options found" />
      {AUTOCOMPLETE_LOADING_VARIANTS.map((loadingVariant) => (
        <Example
          key={loadingVariant}
          id={`loading-${loadingVariant}`}
          label={`Loading: ${loadingVariant}`}
          options={[]}
          loading
          loadingVariant={loadingVariant}
        />
      ))}
      <Example
        id="team"
        label="Custom team options"
        options={Array.from({ length: 12 }, (_, index) => ({
          value: String(index),
          label: `Team ${index + 1}`,
        }))}
        renderOption={renderTeam}
      />
    </div>
  ),
};

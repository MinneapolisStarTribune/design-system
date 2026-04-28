import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FormControl } from '@/components/FormControl/FormControl.native';
import { FormGroupNative as FormGroup, UtilityBody } from '@/components/index.native';
import type { SelectNativeProps } from '../Select.types';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom', disabled: true },
];

function SectionLabel({ children }: { children: string }) {
  return <UtilityBody weight="bold">{children}</UtilityBody>;
}

const meta = {
  title: 'Forms/FormControl/Select',
  component: FormControl.Select,
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'React Native select shell: shows the selected option or placeholder, sizes, rounded corners, and error/disabled styling. Use inside `FormGroup` for labels and captions. Full reference: **Select (Native)** in web Storybook docs.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Visual size of the control.',
    },
    rounded: { control: 'boolean', description: 'Pill-shaped border radius.' },
    isDisabled: { control: 'boolean' },
    isError: { control: 'boolean' },
    placeholderText: { control: 'text' },
    showPlaceholder: { control: 'boolean' },
    value: { control: 'text', description: 'Controlled selected option `value`.' },
  },
} satisfies Meta<typeof FormControl.Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfigurableSelect(args: Partial<SelectNativeProps>) {
  const [value, setValue] = useState<string | undefined>(args.value);

  return (
    <FormGroup>
      <FormGroup.Label optional={false}>Country</FormGroup.Label>
      <FormGroup.Description>Choose a shipping region.</FormGroup.Description>
      <FormControl.Select
        id="select-native-configurable"
        {...args}
        options={args.options ?? OPTIONS}
        value={value}
        onChange={(next: string) => setValue(next)}
      />
      {args.isError ? (
        <FormGroup.Caption variant="error">This field is required.</FormGroup.Caption>
      ) : (
        <FormGroup.Caption variant="info">Helper text for the field.</FormGroup.Caption>
      )}
    </FormGroup>
  );
}

export const Configurable: Story = {
  args: {
    size: 'medium',
    rounded: false,
    isDisabled: false,
    isError: false,
    placeholderText: 'Select an option',
    showPlaceholder: true,
    options: OPTIONS,
  },
  parameters: {
    docs: {
      source: {
        code: `<FormGroup>
  <FormGroup.Label optional={false}>Country</FormGroup.Label>
  <FormGroup.Description>Choose a shipping region.</FormGroup.Description>
  <FormControl.Select
    id="select-native-configurable"
    options={[
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
      { value: 'uk', label: 'United Kingdom', disabled: true },
    ]}
    placeholderText="Select an option"
    showPlaceholder
    size="medium"
  />
  <FormGroup.Caption variant="info">Helper text for the field.</FormGroup.Caption>
</FormGroup>`,
      },
    },
  },
  render: (args) => <ConfigurableSelect key={String(args.value ?? '')} {...args} />,
};

type VariantRow = {
  title: string;
  props: Partial<SelectNativeProps> & Pick<SelectNativeProps, 'id' | 'options'>;
};

const VARIANT_ROWS: VariantRow[] = [
  {
    title: 'Default (medium)',
    props: {
      id: 'select-variant-default',
      options: OPTIONS,
      placeholderText: 'Select an option',
      size: 'medium',
    },
  },
  {
    title: 'Small',
    props: {
      id: 'select-variant-small',
      options: OPTIONS,
      value: 'ca',
      size: 'small',
    },
  },
  {
    title: 'Large',
    props: {
      id: 'select-variant-large',
      options: OPTIONS,
      value: 'us',
      size: 'large',
    },
  },
  {
    title: 'Rounded',
    props: {
      id: 'select-variant-rounded',
      options: OPTIONS,
      rounded: true,
      value: 'mx',
    },
  },
  {
    title: 'Error',
    props: {
      id: 'select-variant-error',
      options: OPTIONS,
      isError: true,
      placeholderText: 'Required',
    },
  },
  {
    title: 'Disabled',
    props: {
      id: 'select-variant-disabled',
      options: OPTIONS,
      value: 'us',
      isDisabled: true,
    },
  },
  {
    title: 'No placeholder text',
    props: {
      id: 'select-variant-no-placeholder',
      options: OPTIONS,
      showPlaceholder: false,
    },
  },
];

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Common sizes and states for native `FormControl.Select`.',
      },
    },
  },
  render: () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {VARIANT_ROWS.map(({ title, props }) => (
        <View key={props.id} style={styles.row}>
          <SectionLabel>{title}</SectionLabel>
          <FormGroup>
            <FormGroup.Label optional={false}>Label</FormGroup.Label>
            <FormControl.Select {...props} />
          </FormGroup>
        </View>
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  scrollContent: { gap: 24, padding: 16, paddingBottom: 32 },
  row: { gap: 8, maxWidth: 420 },
});

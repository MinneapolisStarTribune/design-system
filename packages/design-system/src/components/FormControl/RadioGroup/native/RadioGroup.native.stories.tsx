import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RadioGroup } from './RadioGroup.native';
import type { RadioGroupProps } from './RadioGroup.native';
import type { RadioOption } from '../RadioGroup.types';

const meta = {
  title: 'Forms/FormControl/RadioGroup',
  component: RadioGroup,
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A RadioGroup allows users to select exactly one option from a list. It is a controlled component and supports neutral (default) and brand variants, disabled state, and error state.',
      },
    },
  },
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    options: { control: false },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS: RadioOption[] = [
  { value: 'credit', title: 'Credit Card', description: 'Visa, Mastercard, Amex' },
  { value: 'paypal', title: 'PayPal' },
  { value: 'bank', title: 'Bank Transfer', description: 'Direct ACH transfer' },
];

export const Configurable: Story = {
  args: {
    name: 'payment',
    value: 'credit',
    options: OPTIONS,
    color: 'brand',
    disabled: false,
    error: false,
    onChange: () => {},
  },
  render: function ConfigurableRender(args: RadioGroupProps) {
    const [value, setValue] = useState(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <RadioGroup
        {...args}
        value={value}
        onChange={setValue}
        dataTestId="radio-group-configurable"
      />
    );
  },
};

type DemoRow = {
  label: string;
} & RadioGroupProps;

const DEMO_ROWS: DemoRow[] = [
  {
    label: 'Neutral',
    name: 'demo1',
    value: 'a',
    options: [
      { value: 'a', title: 'Option A' },
      { value: 'b', title: 'Option B' },
      { value: 'c', title: 'Option C' },
    ],
    color: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Brand',
    name: 'demo2',
    value: 'b',
    options: [
      { value: 'a', title: 'Option A' },
      { value: 'b', title: 'Option B' },
      { value: 'c', title: 'Option C' },
    ],
    color: 'brand',
    onChange: () => {},
  },
  {
    label: 'With descriptions',
    name: 'demo3',
    value: 'paypal',
    options: OPTIONS,
    color: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Error state',
    name: 'demo4',
    value: '',
    options: OPTIONS,
    error: true,
    color: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Disabled',
    name: 'demo5',
    value: 'credit',
    options: OPTIONS,
    disabled: true,
    color: 'neutral',
    onChange: () => {},
  },
];

const DemoRowItem = ({ label, ...props }: DemoRow) => {
  const [value, setValue] = useState(props.value);

  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{label}</Text>

      <RadioGroup
        {...props}
        value={value}
        onChange={setValue}
        dataTestId={`radio-group-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
    </View>
  );
};

export const AllVariants: Story = {
  args: {
    name: 'demo',
    value: '',
    options: [],
    onChange: () => {},
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {DEMO_ROWS.map(({ label, ...props }) => (
        <DemoRowItem key={label} label={label} {...props} />
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  scrollContent: { gap: 20, paddingBottom: 24 },
  row: { gap: 8, maxWidth: 400 },
  rowTitle: { fontSize: 13, fontWeight: '600' },
});

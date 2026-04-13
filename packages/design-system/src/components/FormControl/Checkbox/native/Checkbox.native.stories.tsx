import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Checkbox, CHECKBOX_VARIANTS } from './Checkbox.native';

const meta = {
  title: 'Components/Actions & Inputs/Checkbox',
  component: Checkbox,
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A single checkbox with required title and optional description. Supports neutral (default) and brand colors, disabled and error states, and an indeterminate (mixed) state that must be set via props. When indeterminate, the first user activation calls `onChange(true)` so the parent can clear mixed selection.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Label text (required)' },
    description: { control: 'text', description: 'Optional supporting text' },
    checked: { control: 'boolean' },
    indeterminate: {
      control: 'boolean',
      description:
        'Mixed state (visual). Set programmatically; user interaction moves to checked/unchecked via `onChange`.',
    },
    variant: {
      control: 'select',
      options: [...CHECKBOX_VARIANTS],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    title: 'Subscribe to newsletter',
    description: 'Will sign you up for a daily email.',
    checked: false,
    indeterminate: false,
    variant: 'brand',
    disabled: false,
    error: false,
    onChange: () => {},
  },
  render: function ConfigurableRender(args) {
    const [checked, setChecked] = useState(args.checked);

    useEffect(() => {
      setChecked(args.checked);
    }, [args.checked]);

    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={setChecked}
        dataTestId="checkbox-configurable"
      />
    );
  },
};

type DemoRow = { label: string } & React.ComponentProps<typeof Checkbox>;

const DEMO_ROWS: DemoRow[] = [
  {
    label: 'Neutral / unchecked',
    title: 'Option',
    checked: false,
    variant: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Neutral / checked',
    title: 'Option',
    checked: true,
    variant: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Neutral / indeterminate',
    title: 'Select all',
    checked: false,
    indeterminate: true,
    variant: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Brand / checked',
    title: 'Option',
    checked: true,
    variant: 'brand',
    onChange: () => {},
  },
  {
    label: 'With description',
    title: 'Subscribe',
    description: 'Daily email updates',
    checked: false,
    variant: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Error',
    title: 'Required option',
    description: 'You must select this',
    checked: false,
    error: true,
    variant: 'neutral',
    onChange: () => {},
  },
  {
    label: 'Disabled',
    title: 'Option',
    checked: true,
    disabled: true,
    variant: 'neutral',
    onChange: () => {},
  },
];

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  args: {
    title: '',
    checked: false,
    onChange: () => {},
  },
  render: () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {DEMO_ROWS.map(({ label, ...checkboxProps }) => (
        <View key={label} style={styles.row}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Checkbox
            {...checkboxProps}
            dataTestId={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
        </View>
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

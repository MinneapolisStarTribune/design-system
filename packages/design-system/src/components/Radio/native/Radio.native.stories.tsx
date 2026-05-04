import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { Radio } from './Radio.native';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <View style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </View>
);

const meta: Meta<typeof Radio> = {
  title: 'Forms/FormControl/Radio',
  component: Radio,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    checked: { control: 'boolean' },
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  grid: {
    gap: 24,
  },
  cell: {
    gap: 8,
  },
  group: {
    gap: 12,
  },
});

export const Configurable: Story = {
  args: {
    label: 'Subscribe to newsletter',
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
      <View style={styles.container}>
        <Radio {...args} checked={checked} onChange={setChecked} dataTestId="radio-configurable" />
      </View>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function AllVariantsRender() {
    const [withDescription, setWithDescription] = useState(false);
    const [neutralInGroup, setNeutralInGroup] = useState(false);
    const [brandInGroup, setBrandInGroup] = useState(true);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {/* Neutral Unchecked */}
          <View style={styles.cell}>
            <SectionLabel>Neutral / Unchecked</SectionLabel>
            <Radio
              label="Receive product updates"
              description="We send one message each week."
              checked={false}
              color="neutral"
              onChange={() => {}}
            />
          </View>

          {/* Neutral Checked */}
          <View style={styles.cell}>
            <SectionLabel>Neutral / Checked</SectionLabel>
            <Radio
              label="Receive product updates"
              description="We send one message each week."
              checked
              color="neutral"
              onChange={() => {}}
            />
          </View>

          {/* Brand Checked */}
          <View style={styles.cell}>
            <SectionLabel>Brand / Checked</SectionLabel>
            <Radio
              label="Receive product updates"
              description="We send one message each week."
              checked
              color="brand"
              onChange={() => {}}
            />
          </View>

          {/* Group */}
          <View style={styles.cell}>
            <SectionLabel>Neutral + Brand (group)</SectionLabel>
            <View style={styles.group}>
              <Radio
                label="Neutral (default)"
                description="Used for most forms."
                checked={neutralInGroup}
                color="neutral"
                onChange={() => {
                  setNeutralInGroup(true);
                  setBrandInGroup(false);
                }}
              />
              <Radio
                label="Brand"
                description="Use when brand emphasis is required."
                checked={brandInGroup}
                color="brand"
                onChange={() => {
                  setBrandInGroup(true);
                  setNeutralInGroup(false);
                }}
              />
            </View>
          </View>

          {/* With Description */}
          <View style={styles.cell}>
            <SectionLabel>With Description</SectionLabel>
            <Radio
              label="Subscribe to newsletter"
              description="Daily updates; unsubscribe anytime."
              checked={withDescription}
              onChange={setWithDescription}
            />
          </View>

          {/* Error */}
          <View style={styles.cell}>
            <SectionLabel>Error</SectionLabel>
            <Radio
              label="Required choice"
              description="You must select one option."
              checked={false}
              error
              onChange={() => {}}
            />
          </View>

          {/* Disabled */}
          <View style={styles.cell}>
            <SectionLabel>Disabled / Unchecked</SectionLabel>
            <Radio
              label="Disabled option"
              description="This choice is not available."
              checked={false}
              disabled
              onChange={() => {}}
            />
          </View>

          <View style={styles.cell}>
            <SectionLabel>Disabled / Checked</SectionLabel>
            <Radio
              label="Disabled option"
              description="Previously selected; cannot change."
              checked
              disabled
              onChange={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Radio } from './Radio.native';

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

export const Configurable: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Weekly updates',
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
      <View style={{ padding: 16 }}>
        <Radio {...args} checked={checked} onChange={setChecked} />
      </View>
    );
  },
};

export const AllVariants: Story = {
  render: function AllVariantsRender() {
    const [neutral, setNeutral] = useState(false);
    const [brand, setBrand] = useState(true);

    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        <Radio
          label="Neutral unchecked"
          description="Default state"
          checked={false}
          onChange={() => {}}
        />

        <Radio label="Neutral checked" checked onChange={() => {}} />

        <Radio label="Brand checked" color="brand" checked onChange={() => {}} />

        <Radio
          label="Error state"
          description="Required field"
          error
          checked={false}
          onChange={() => {}}
        />

        <Radio label="Disabled unchecked" disabled checked={false} onChange={() => {}} />

        <Radio label="Disabled checked" disabled checked onChange={() => {}} />

        <View style={{ gap: 12 }}>
          <Radio
            label="Neutral option"
            checked={neutral}
            onChange={() => {
              setNeutral(true);
              setBrand(false);
            }}
          />
          <Radio
            label="Brand option"
            color="brand"
            checked={brand}
            onChange={() => {
              setBrand(true);
              setNeutral(false);
            }}
          />
        </View>
      </ScrollView>
    );
  },
};

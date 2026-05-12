import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { CheckboxGroup } from './CheckboxGroup.native';
import type { CheckboxCategory, CheckboxOption } from '../CheckboxGroup.types';

const FLAT_OPTIONS: CheckboxOption[] = [
  { value: 'email', title: 'Email', description: 'Receive email notifications' },
  { value: 'sms', title: 'SMS', description: 'Receive text messages' },
  { value: 'push', title: 'Push', description: 'Receive browser push notifications' },
];

const CATEGORY_OPTIONS: CheckboxCategory[] = [
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
    ],
  },
];

const meta = {
  title: 'Forms/FormControl/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type ConfigurableArgs = {
  value?: string[];
  options?: CheckboxOption[];
  color?: 'neutral' | 'brand';
  disabled?: boolean;
  error?: boolean;
  dataTestId?: string;
};

function ConfigurableStory(args: ConfigurableArgs) {
  const [value, setValue] = useState<string[]>(args.value ?? []);

  return (
    <CheckboxGroup
      value={value}
      onChange={setValue}
      options={args.options ?? FLAT_OPTIONS}
      color={args.color}
      disabled={args.disabled}
      error={args.error}
      dataTestId={args.dataTestId}
    />
  );
}

function AllVariantsStory() {
  const [flatNeutral, setFlatNeutral] = useState<string[]>([]);
  const [flatBrand, setFlatBrand] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <UtilityLabel size="small" weight="semibold">
          Flat / Neutral
        </UtilityLabel>
        <CheckboxGroup
          value={flatNeutral}
          onChange={setFlatNeutral}
          options={FLAT_OPTIONS}
          color="neutral"
          dataTestId="all-variants-flat-neutral"
        />
      </View>

      <View style={styles.section}>
        <UtilityLabel size="small" weight="semibold">
          Flat / Brand
        </UtilityLabel>
        <CheckboxGroup
          value={flatBrand}
          onChange={setFlatBrand}
          options={FLAT_OPTIONS}
          color="brand"
          dataTestId="all-variants-flat-brand"
        />
      </View>

      <View style={styles.section}>
        <UtilityLabel size="small" weight="semibold">
          Categories / Brand
        </UtilityLabel>
        <CheckboxGroup
          value={categories}
          onChange={setCategories}
          categories={CATEGORY_OPTIONS}
          color="brand"
          dataTestId="all-variants-categories"
        />
      </View>

      <View style={styles.section}>
        <UtilityLabel size="small" weight="semibold">
          Disabled
        </UtilityLabel>
        <CheckboxGroup
          value={['email']}
          onChange={() => {}}
          options={FLAT_OPTIONS}
          disabled
          dataTestId="all-variants-disabled"
        />
      </View>
    </ScrollView>
  );
}

export const Configurable: Story = {
  args: {
    value: [],
    options: FLAT_OPTIONS,
    color: 'neutral',
    disabled: false,
    error: false,
    dataTestId: 'checkbox-group-configurable',
    onChange: () => {},
  },
  render: (args) => <ConfigurableStory {...args} />,
};

export const AllVariants: Story = {
  args: {
    value: [],
    options: FLAT_OPTIONS,
    onChange: () => {},
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => <AllVariantsStory />,
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    gap: 20,
    paddingBottom: 24,
  },
  section: {
    gap: 8,
  },
});

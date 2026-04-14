import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FormGroupNative as FormGroup } from '@/components/FormGroup/native/FormGroup.native';
import { TextInput, type TextInputProps } from './TextInput.native';

function StoryIcon() {
  return <View style={styles.storyIcon} />;
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function ConfigurableInput(args: TextInputProps) {
  const { value: initialValue, onChangeText, ...rest } = args;
  const [value, setValue] = useState(initialValue ?? '');

  return (
    <FormGroup>
      <FormGroup.Label optional={false}>Label</FormGroup.Label>
      <View style={styles.configurableWrap}>
        <TextInput
          {...rest}
          value={value}
          onChangeText={(nextValue) => {
            setValue(nextValue);
            onChangeText?.(nextValue);
          }}
        />
      </View>
    </FormGroup>
  );
}

interface VariantRow {
  title: string;
  props: TextInputProps;
  label?: string;
  optional?: boolean;
  description?: string;
  caption?: {
    text: string;
    variant: 'info' | 'error' | 'success';
  };
}

const cellStyle = { minWidth: 0 } as const;

const ALL_VARIANTS: VariantRow[] = [
  {
    title: 'Size: Small',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      size: 'small',
      accessibilityLabel: 'Small',
    },
  },
  {
    title: 'Size: Medium (Default)',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      size: 'medium',
      accessibilityLabel: 'Medium',
    },
  },
  {
    title: 'Size: Large',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      size: 'large',
      accessibilityLabel: 'Large',
    },
  },
  {
    title: 'Label: Default',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      accessibilityLabel: 'Default label',
    },
  },
  {
    title: 'Label: Optional',
    label: 'Label',
    optional: true,
    props: {
      placeholderText: 'Placeholder text',
      accessibilityLabel: 'Optional label',
    },
  },
  {
    title: 'Label + Description',
    label: 'Label',
    description: 'Description of the label',
    props: {
      placeholderText: 'Placeholder text',
      accessibilityLabel: 'Label with description',
    },
  },
  {
    title: 'Placeholder: True',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      accessibilityLabel: 'With placeholder',
    },
  },
  {
    title: 'Placeholder: False',
    label: 'Label',
    props: {
      accessibilityLabel: 'No placeholder',
    },
  },
  {
    title: 'Rounded',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      rounded: true,
      accessibilityLabel: 'Rounded input',
    },
  },
  {
    title: 'Left Icon',
    label: 'Label',
    props: {
      placeholderText: 'Search User Here',
      icon: <StoryIcon />,
      iconPosition: 'start',
      accessibilityLabel: 'Left icon',
    },
  },
  {
    title: 'Right Icon',
    label: 'Label',
    props: {
      placeholderText: 'Search User Here',
      icon: <StoryIcon />,
      iconPosition: 'end',
      accessibilityLabel: 'Right icon',
    },
  },
  {
    title: 'Caption: Informational',
    label: 'Label',
    caption: {
      text: 'Informational text here',
      variant: 'info',
    },
    props: {
      placeholderText: 'Placeholder text',
      accessibilityLabel: 'Info caption',
    },
  },
  {
    title: 'Caption: Error',
    label: 'Label',
    caption: {
      text: 'Error message here',
      variant: 'error',
    },
    props: {
      placeholderText: 'Placeholder text',
      isError: true,
      accessibilityLabel: 'Error caption',
    },
  },
  {
    title: 'Caption: Success',
    label: 'Label',
    caption: {
      text: 'Success message here',
      variant: 'success',
    },
    props: {
      placeholderText: 'Placeholder text',
      isSuccess: true,
      accessibilityLabel: 'Success caption',
    },
  },
  {
    title: 'State: Default',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      accessibilityLabel: 'Default state',
    },
  },
  {
    title: 'State: Filled',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      value: 'Some text',
      accessibilityLabel: 'Filled state',
    },
  },
  {
    title: 'State: Error',
    label: 'Label',
    caption: {
      text: 'Error message',
      variant: 'error',
    },
    props: {
      placeholderText: 'Placeholder text',
      isError: true,
      accessibilityLabel: 'Error state',
    },
  },
  {
    title: 'State: Success',
    label: 'Label',
    caption: {
      text: 'Success message',
      variant: 'success',
    },
    props: {
      placeholderText: 'Placeholder text',
      isSuccess: true,
      accessibilityLabel: 'Success state',
    },
  },
  {
    title: 'State: Disabled',
    label: 'Label',
    props: {
      placeholderText: 'Placeholder text',
      isDisabled: true,
      accessibilityLabel: 'Disabled state',
    },
  },
];

function VariantField({ title, props, label, optional, description, caption }: VariantRow) {
  return (
    <View style={styles.variantCell}>
      <SectionLabel>{title}</SectionLabel>
      <FormGroup>
        {label ? <FormGroup.Label optional={optional}>{label}</FormGroup.Label> : null}
        {description ? <FormGroup.Description>{description}</FormGroup.Description> : null}
        <TextInput {...props} />
        {caption ? (
          <FormGroup.Caption variant={caption.variant}>{caption.text}</FormGroup.Caption>
        ) : null}
      </FormGroup>
    </View>
  );
}

const meta = {
  title: 'Forms/FormControl/TextInput',
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'Text Inputs allow users to enter, edit, and/or view text such as names, email addresses, or search queries. They support multiple sizes, optional labels and descriptions, validation states, and can effortlessly be customized for a wide range of native use cases via the prop API.',
      },
    },
  },
  argTypes: {
    placeholderText: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input size',
    },
    icon: {
      control: 'boolean',
      mapping: {
        true: <StoryIcon />,
        false: undefined,
      },
      options: [false, true],
      description: 'Optional icon',
    },
    iconPosition: {
      control: 'radio',
      options: ['start', 'end'],
      description: 'Icon position (when icon is set)',
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded corners',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    isError: {
      control: 'boolean',
      description: 'Error state (red border)',
    },
    isSuccess: {
      control: 'boolean',
      description: 'Success state (green border)',
    },
    value: {
      control: 'text',
      description: 'Controlled value (shows filled state when non-empty)',
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    placeholderText: 'Placeholder text',
    size: 'medium',
    icon: undefined,
    iconPosition: 'end',
    rounded: false,
    isDisabled: false,
    isError: false,
    isSuccess: false,
    value: '',
    accessibilityLabel: 'Configurable input',
  },
  render: (args) => <ConfigurableInput key={String(args.value ?? '')} {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All variants per the design spec: Size, Label, Placeholder, Icons, Caption, and States.',
      },
    },
  },
  render: () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {ALL_VARIANTS.map((variant) => (
        <View key={variant.title} style={cellStyle}>
          <VariantField {...variant} />
        </View>
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  configurableWrap: {
    width: '100%',
    maxWidth: 400,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  variantCell: {
    gap: 8,
    maxWidth: 400,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  storyIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: 'rgba(128, 128, 128, 0.9)',
  },
});

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FormGroupNative as FormGroup, UtilityBody } from '@/components/index.native';
import { TextInput, type TextInputProps } from './TextInput.native';

import {
  CalendarIcon,
  LocationIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from '@/icons';

const DEFAULT_ICON_COLOR = '#585C5F'; // theme.colorTextOnLightTertiary
const ICON_MAP = {
  None: undefined,
  Search: <SearchIcon fill={DEFAULT_ICON_COLOR} />,
  Mail: <MailIcon fill={DEFAULT_ICON_COLOR} />,
  User: <UserIcon fill={DEFAULT_ICON_COLOR} />,
  Lock: <LockIcon fill={DEFAULT_ICON_COLOR} />,
  Calendar: <CalendarIcon fill={DEFAULT_ICON_COLOR} />,
  Phone: <PhoneIcon fill={DEFAULT_ICON_COLOR} />,
  Location: <LocationIcon fill={DEFAULT_ICON_COLOR} />,
} as const;

type IconOptionKey = keyof typeof ICON_MAP;

function resolveIcon(icon: TextInputProps['icon'] | IconOptionKey | undefined) {
  if (!icon) return undefined;
  if (typeof icon === 'string') return ICON_MAP[icon as IconOptionKey];
  return icon;
}

type ConfigurableTextInputArgs = Omit<TextInputProps, 'icon'> & {
  icon?: TextInputProps['icon'] | IconOptionKey;
};

function SectionLabel({ children }: { children: string }) {
  return <UtilityBody weight="bold">{children}</UtilityBody>;
}

function ConfigurableInput(args: ConfigurableTextInputArgs) {
  const { value: initialValue, onChangeText, icon, ...rest } = args;
  const [value, setValue] = useState(initialValue ?? '');

  return (
    <FormGroup>
      <FormGroup.Label optional={false}>Label</FormGroup.Label>
      <View style={styles.configurableWrap}>
        <TextInput
          {...rest}
          icon={resolveIcon(icon)}
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
      icon: ICON_MAP.User,
      iconPosition: 'start',
      accessibilityLabel: 'Left icon',
    },
  },
  {
    title: 'Right Icon',
    label: 'Label',
    props: {
      placeholderText: 'Search User Here',
      icon: ICON_MAP.User,
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
        <TextInput {...props} icon={resolveIcon(props.icon)} />
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
          'Text Input component for native apps with icons, validation, and accessibility support.',
      },
    },
  },
  argTypes: {
    placeholderText: { control: 'text' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    icon: {
      control: 'select',
      options: Object.keys(ICON_MAP),
    },
    iconPosition: {
      control: 'radio',
      options: ['start', 'end'],
    },
    rounded: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isError: { control: 'boolean' },
    isSuccess: { control: 'boolean' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    placeholderText: 'Placeholder text',
    size: 'medium',
    icon: 'None',
    iconPosition: 'end',
    rounded: false,
    isDisabled: false,
    isError: false,
    isSuccess: false,
    value: '',
  },
  render: (args) => <ConfigurableInput key={String(args.value ?? '')} {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: {
      exclude: [
        'placeholderText',
        'size',
        'icon',
        'iconPosition',
        'rounded',
        'isDisabled',
        'isError',
        'isSuccess',
        'value',
      ],
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All variants per the design spec: Size, Label, Placeholder, Icons, Caption, and States.',
      },
    },
  },
  render: (_args) => {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {ALL_VARIANTS.map((v) => (
          <VariantField key={v.title} {...v} />
        ))}
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  variantCell: { gap: 8, maxWidth: 420 },
  configurableWrap: { width: '100%', maxWidth: 400 },
});

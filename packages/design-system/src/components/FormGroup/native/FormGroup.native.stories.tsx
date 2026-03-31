import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FormGroupProvider, useFormGroupContext } from '../FormGroupContext';
import {
  FormGroupCaption,
  FORM_GROUP_CAPTION_VARIANTS,
  type FormGroupCaptionVariant,
} from './caption/FormGroup.Caption.native';
import { FormGroupDescription } from './description/FormGroup.Description.native';
import { FormGroupLabel } from './label/FormGroup.Label.native';

interface FormGroupNativeStoryArgs {
  showLabel: boolean;
  labelText: string;
  optional: boolean;
  showDescription: boolean;
  descriptionText: string;
  showCaption: boolean;
  captionText: string;
  captionVariant: FormGroupCaptionVariant;
  placeholderText: string;
}

interface FormGroupNativeStoryProps extends FormGroupNativeStoryArgs {
  testIdPrefix?: string;
}

const FormGroupStoryTextInput: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  const context = useFormGroupContext();
  return (
    <TextInput
      nativeID={context?.inputId}
      placeholder={placeholder}
      style={styles.input}
      editable
    />
  );
};

const FormGroupNativeStory: React.FC<FormGroupNativeStoryProps> = ({
  testIdPrefix = 'story-form-group',
  showLabel,
  labelText,
  optional,
  showDescription,
  descriptionText,
  showCaption,
  captionText,
  captionVariant,
  placeholderText,
}) => (
  <FormGroupProvider
    hasLabel={showLabel}
    hasDescription={showDescription}
    hasCaption={showCaption}
    captionVariant={showCaption ? captionVariant : undefined}
  >
    <View style={styles.stack}>
      {showLabel ? (
        <FormGroupLabel optional={optional} dataTestId={`${testIdPrefix}-label`}>
          {labelText}
        </FormGroupLabel>
      ) : null}
      {showDescription ? (
        <FormGroupDescription dataTestId={`${testIdPrefix}-description`}>
          {descriptionText}
        </FormGroupDescription>
      ) : null}
      <FormGroupStoryTextInput placeholder={placeholderText} />
      {showCaption ? (
        <FormGroupCaption variant={captionVariant} dataTestId={`${testIdPrefix}-caption`}>
          {captionText}
        </FormGroupCaption>
      ) : null}
    </View>
  </FormGroupProvider>
);

const meta = {
  title: 'Forms/FormGroup',
  component: FormGroupNativeStory,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    showLabel: { control: 'boolean' },
    labelText: {
      control: 'text',
      if: { arg: 'showLabel', eq: true },
    },
    optional: {
      control: 'boolean',
      if: { arg: 'showLabel', eq: true },
    },
    showDescription: { control: 'boolean' },
    descriptionText: {
      control: 'text',
      if: { arg: 'showDescription', eq: true },
    },
    showCaption: { control: 'boolean' },
    captionText: {
      control: 'text',
      if: { arg: 'showCaption', eq: true },
    },
    captionVariant: {
      control: 'select',
      options: [...FORM_GROUP_CAPTION_VARIANTS],
      if: { arg: 'showCaption', eq: true },
    },
    placeholderText: { control: 'text' },
  },
} satisfies Meta<typeof FormGroupNativeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    showLabel: true,
    labelText: 'Email Address',
    optional: false,
    showDescription: true,
    descriptionText: "We'll never share your email",
    showCaption: true,
    captionText: 'Please enter a valid email address',
    captionVariant: 'error',
    placeholderText: 'Enter your email',
  },
};

export const WithErrorCaption: Story = {
  args: {
    showLabel: true,
    labelText: 'Password',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: true,
    captionText: 'Password is required',
    captionVariant: 'error',
    placeholderText: 'Enter password',
  },
};

type AllVariantRow = {
  title: string;
  testIdPrefix: string;
} & FormGroupNativeStoryArgs;

const ALL_VARIANT_ROWS: AllVariantRow[] = [
  {
    title: 'Label only',
    testIdPrefix: 'allvariants-label-only',
    showLabel: true,
    labelText: 'Email',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: false,
    captionText: '',
    captionVariant: 'info',
    placeholderText: 'Placeholder',
  },
  {
    title: 'Label (optional)',
    testIdPrefix: 'allvariants-label-optional',
    showLabel: true,
    labelText: 'Email',
    optional: true,
    showDescription: false,
    descriptionText: '',
    showCaption: false,
    captionText: '',
    captionVariant: 'info',
    placeholderText: 'Placeholder',
  },
  {
    title: 'Label + Description',
    testIdPrefix: 'allvariants-label-and-description',
    showLabel: true,
    labelText: 'Email',
    optional: false,
    showDescription: true,
    descriptionText: "We'll never share your email",
    showCaption: false,
    captionText: '',
    captionVariant: 'info',
    placeholderText: 'you@example.com',
  },
  {
    title: 'Label + Description + Caption',
    testIdPrefix: 'allvariants-label-description-and-caption',
    showLabel: true,
    labelText: 'Email',
    optional: false,
    showDescription: true,
    descriptionText: "We'll never share your email",
    showCaption: true,
    captionText: 'Please enter a valid email address',
    captionVariant: 'error',
    placeholderText: 'you@example.com',
  },
  {
    title: 'Label + Caption (info)',
    testIdPrefix: 'allvariants-label-and-caption-info',
    showLabel: true,
    labelText: 'Username',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: true,
    captionText: 'Choose a unique username',
    captionVariant: 'info',
    placeholderText: 'Enter username',
  },
  {
    title: 'Label + Caption (error)',
    testIdPrefix: 'allvariants-label-and-caption-error',
    showLabel: true,
    labelText: 'Password',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: true,
    captionText: 'Password is required',
    captionVariant: 'error',
    placeholderText: 'Enter password',
  },
  {
    title: 'Label + Caption (success)',
    testIdPrefix: 'allvariants-label-and-caption-success',
    showLabel: true,
    labelText: 'Password',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: true,
    captionText: 'Account created successfully',
    captionVariant: 'success',
    placeholderText: 'Enter password',
  },
  {
    title: 'Search (no icon — native TextInput placeholder)',
    testIdPrefix: 'allvariants-search-placeholder-no-icon',
    showLabel: true,
    labelText: 'Search',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: false,
    captionText: '',
    captionVariant: 'info',
    placeholderText: 'Search',
  },
];

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  args: {
    showLabel: true,
    labelText: '',
    optional: false,
    showDescription: false,
    descriptionText: '',
    showCaption: false,
    captionText: '',
    captionVariant: 'info',
    placeholderText: '',
  },
  render: () => (
    <ScrollView style={styles.allVariantsScroll} contentContainerStyle={styles.allVariantsContent}>
      {ALL_VARIANT_ROWS.map(({ title, testIdPrefix, ...args }) => (
        <View key={title} style={styles.variantCell}>
          <Text style={styles.variantTitle}>{title}</Text>
          <FormGroupNativeStory {...args} testIdPrefix={testIdPrefix} />
        </View>
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  allVariantsScroll: {
    flex: 1,
    width: '100%',
  },
  allVariantsContent: {
    paddingBottom: 24,
    gap: 16,
  },
  variantCell: {
    gap: 8,
    maxWidth: 400,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stack: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});

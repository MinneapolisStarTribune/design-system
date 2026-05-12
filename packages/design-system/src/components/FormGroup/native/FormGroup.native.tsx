import React, { Children, isValidElement } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { NativeBaseProps } from '@/types/native-base-props';
import { FormGroupProvider } from '../FormGroupContext';
import {
  FormGroupCaption,
  type FormGroupCaptionNativeProps,
  type FormGroupCaptionVariant,
} from './Caption/FormGroup.Caption.native';
import {
  FormGroupDescription,
  type FormGroupDescriptionNativeProps,
} from './Description/FormGroup.Description.native';
import { FormGroupLabel, type FormGroupLabelNativeProps } from './Label/FormGroup.Label.native';

export interface FormGroupNativeRootProps extends NativeBaseProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Type map for native FormGroup */
export interface FormGroupNativeProps {
  Props: FormGroupNativeRootProps;
  Label: FormGroupLabelNativeProps;
  Description: FormGroupDescriptionNativeProps;
  Caption: FormGroupCaptionNativeProps;
}

export const FormGroupNative: React.FC<FormGroupNativeRootProps> & {
  Label: React.FC<FormGroupLabelNativeProps>;
  Description: React.FC<FormGroupDescriptionNativeProps>;
  Caption: React.FC<FormGroupCaptionNativeProps>;
} = ({ children, style, dataTestId }) => {
  const childrenArray = Children.toArray(children);

  let hasLabel = false,
    hasDescription = false,
    hasCaption = false;
  let captionVariant: FormGroupCaptionVariant | undefined;

  const slots = {
    label: null as React.ReactNode,
    description: null as React.ReactNode,
    control: null as React.ReactNode,
    caption: null as React.ReactNode,
  };

  const isLabelElement = (child: React.ReactNode) =>
    isValidElement(child) && child.type === FormGroupLabel;

  const isDescriptionElement = (child: React.ReactNode) =>
    isValidElement(child) && child.type === FormGroupDescription;

  const isCaptionElement = (
    child: React.ReactNode
  ): child is React.ReactElement<FormGroupCaptionNativeProps> =>
    isValidElement(child) && child.type === FormGroupCaption;

  const isValidCaptionVariant = (value: unknown): value is FormGroupCaptionVariant =>
    value === 'info' || value === 'error' || value === 'success';

  childrenArray.forEach((child) => {
    if (!isValidElement(child)) {
      if (slots.control == null) slots.control = child;
      return;
    }

    if (isLabelElement(child)) {
      hasLabel = true;
      slots.label = child;
      return;
    }

    if (isDescriptionElement(child)) {
      hasDescription = true;
      slots.description = child;
      return;
    }

    if (isCaptionElement(child)) {
      hasCaption = true;
      slots.caption = child;

      const captionVariantProp = child.props.variant;
      if (isValidCaptionVariant(captionVariantProp)) {
        captionVariant = captionVariantProp;
      }
      return;
    }

    if (slots.control == null) {
      slots.control = child;
    }
  });

  const above = slots.label || slots.description;

  return (
    <FormGroupProvider
      hasLabel={hasLabel}
      hasDescription={hasDescription}
      hasCaption={hasCaption}
      captionVariant={captionVariant}
    >
      <View style={style} testID={dataTestId}>
        {above ? (
          <View>
            {slots.label}
            {slots.description}
          </View>
        ) : null}
        {slots.control != null ? <View>{slots.control}</View> : null}
        {slots.caption}
      </View>
    </FormGroupProvider>
  );
};

FormGroupNative.Label = FormGroupLabel;
FormGroupNative.Description = FormGroupDescription;
FormGroupNative.Caption = FormGroupCaption;

/** Web-aligned name; same reference as {@link FormGroupNative} (includes `.Label`, `.Description`, `.Caption`). */
export const FormGroup = FormGroupNative;

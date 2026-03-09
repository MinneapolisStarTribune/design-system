import React, { Children, isValidElement } from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { FormGroupLabel, type FormGroupLabelProps } from './label/FormGroup.Label';
import {
  FormGroupDescription,
  type FormGroupDescriptionProps,
} from './description/FormGroup.Description';
import { FormGroupCaption, type FormGroupCaptionProps } from './caption/FormGroup.Caption';
import { FormGroupProvider } from '../FormGroupContext';
import styles from './FormGroup.module.scss';

export interface FormGroupRootProps extends BaseProps {
  children: React.ReactNode;
}

/** Type map for FormGroup prop types. In consuming apps use FormGroupProps['Props'], FormGroupProps['Label'], etc. */
export interface FormGroupProps {
  Props: FormGroupRootProps;
  Label: FormGroupLabelProps;
  Description: FormGroupDescriptionProps;
  Caption: FormGroupCaptionProps;
}

export const FormGroup: React.FC<FormGroupProps['Props']> & {
  Label: React.FC<FormGroupLabelProps>;
  Description: React.FC<FormGroupDescriptionProps>;
  Caption: React.FC<FormGroupCaptionProps>;
} = ({ children, className, dataTestId }) => {
  /**
   * First pass: Identify which children are present BEFORE calling any hooks.
   *
   * We need unique, stable IDs for accessibility attributes (`aria-labelledby`, `aria-describedby`)
   * that connect form controls to their labels, descriptions, and captions.
   *
   * React's Rules of Hooks require that hooks are called in the same order on every render.
   * We cannot conditionally call `useId()` based on what children are present, as this would
   * violate the rules of hooks and cause React errors.
   *
   * Therefore, we do a two-pass approach:
   * 1. First pass (here): Identify which subcomponents exist (Label, Description, Caption)
   *    without calling any hooks. This happens before any hook calls.
   * 2. Second pass (in FormGroupProvider): Always call `useId()` three times unconditionally,
   *    but only expose the IDs when the corresponding element is present (based on the flags
   *    we pass down).
   */
  const childrenArray = Children.toArray(children);

  // Track which subcomponents are present (used to determine which IDs to expose in FormGroupProvider)
  let hasLabel = false;
  let hasDescription = false;
  let hasCaption = false;

  childrenArray.forEach((child) => {
    if (isValidElement(child)) {
      if (child.type === FormGroup.Label) hasLabel = true;
      else if (child.type === FormGroup.Description) hasDescription = true;
      else if (child.type === FormGroup.Caption) hasCaption = true;
    }
  });

  return (
    <FormGroupProvider hasLabel={hasLabel} hasDescription={hasDescription} hasCaption={hasCaption}>
      <div className={classNames(styles['form-group'], className)} data-testid={dataTestId}>
        {children}
      </div>
    </FormGroupProvider>
  );
};

// Attach subcomponents
FormGroup.Label = FormGroupLabel;
FormGroup.Description = FormGroupDescription;
FormGroup.Caption = FormGroupCaption;

// Export types so they come from one place (individual types for internal/deep imports)
export type { FormGroupCaptionProps } from './caption/FormGroup.Caption';
export type { FormGroupDescriptionProps } from './description/FormGroup.Description';
export type { FormGroupLabelProps } from './label/FormGroup.Label';

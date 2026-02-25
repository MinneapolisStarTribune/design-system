// NOTE - THIS IS A STUBBED OUT COMPONENT ONLY.
// PLEASE SEE https://minneapolisstartribune.atlassian.net/browse/SUS-140 FOR MORE INFORMATION.
import React, { Children, isValidElement } from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { FormGroupLabel, type FormGroupLabelProps } from './FormGroupLabel';
import { FormGroupDescription, type FormGroupDescriptionProps } from './FormGroupDescription';
import { FormGroupCaption, type FormGroupCaptionProps } from './FormGroup.Caption';
import { FormGroupProvider } from './FormGroupContext';

export interface FormGroupProps extends BaseProps {
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> & {
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
      <div className={classNames('form-group', className)} data-testid={dataTestId}>
        {children}
      </div>
    </FormGroupProvider>
  );
};

// Attach subcomponents
FormGroup.Label = FormGroupLabel;
FormGroup.Description = FormGroupDescription;
FormGroup.Caption = FormGroupCaption;

// Re-export types so they come from one place
export type { FormGroupLabelProps } from './FormGroupLabel';
export type { FormGroupDescriptionProps } from './FormGroupDescription';
export type { FormGroupCaptionProps } from './FormGroup.Caption';

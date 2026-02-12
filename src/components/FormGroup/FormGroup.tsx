import React, { Children, isValidElement } from 'react';
import classNames from 'classnames';
import { BaseProps } from '../../types/globalTypes';
import { FormGroupLabel, type FormGroupLabelProps } from './FormGroupLabel';
import { FormGroupDescription, type FormGroupDescriptionProps } from './FormGroupDescription';
import { FormGroupCaption, type FormGroupCaptionProps } from './FormGroupCaption';
import { FormGroupProvider } from './FormGroupContext';

export interface FormGroupProps extends BaseProps {
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> & {
  Label: React.FC<FormGroupLabelProps>;
  Description: React.FC<FormGroupDescriptionProps>;
  Caption: React.FC<FormGroupCaptionProps>;
} = ({ children, className, dataTestId }) => {
  // First pass: identify what children we have to generate IDs upfront
  // This ensures hooks are always called in the same order
  const childrenArray = Children.toArray(children);

  // Count elements that need IDs (only ONE caption allowed)
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
export type { FormGroupCaptionProps } from './FormGroupCaption';

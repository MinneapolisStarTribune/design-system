'use client';

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
} = ({ children, className }) => {
  /**
   * WHY WE SCAN CHILDREN BEFORE RENDERING
   *
   * We need to do two things before we can render:
   *   1. Know which subcomponents are present so we can wire up accessibility attributes.
   *   2. Extract each child into a named slot so the CSS subgrid layout works correctly
   *      for horizontal orientation.
   *
   * ACCESSIBILITY (aria-labelledby / aria-describedby)
   * Form controls need to be programmatically associated with their label, description,
   * and caption so screen readers can announce them correctly. We do this by generating
   * stable IDs (via useId in FormGroupProvider) and passing them to the control via
   * aria-labelledby and aria-describedby. We pass `hasLabel`, `hasDescription`, and
   * `hasCaption` flags to FormGroupProvider so it only exposes an ID for elements that
   * actually exist — a control shouldn't point to an ID that isn't in the DOM.
   *
   * React's Rules of Hooks mean we cannot call useId() conditionally, so we always call
   * it three times inside FormGroupProvider unconditionally, and then selectively expose
   * each ID based on the flags we pass in.
   *
   * SUBGRID SLOTTING
   * When a FormGroup is wrapped in a <Form> parent and has a horizontal orientation,
   * it uses a 3-track CSS subgrid so that all inputs across every FormGroup align to the
   * same row, regardless of whether individual groups have labels, descriptions, or captions.
   *
   * For this to work, every FormGroup must output exactly 3 wrapper divs in the same
   * order — above (label + description), control, caption — even when some are empty.
   * CSS grid assigns children to tracks by DOM position, so a missing div would shift
   * every subsequent child onto the wrong track, breaking alignment across the whole row.
   *
   * Empty slots are rendered as aria-hidden divs so they occupy the correct grid track
   * without contributing layout height or being announced by assistive technology.
   */
  const childrenArray = Children.toArray(children);

  let hasLabel = false,
    hasDescription = false,
    hasCaption = false;
  const slots = {
    label: null as React.ReactNode,
    description: null as React.ReactNode,
    control: null as React.ReactNode,
    caption: null as React.ReactNode,
  };

  childrenArray.forEach((child) => {
    if (!isValidElement(child)) {
      if (slots.control == null) slots.control = child;
      return;
    }
    if (child.type === FormGroup.Label) {
      hasLabel = true;
      slots.label = child;
    } else if (child.type === FormGroup.Description) {
      hasDescription = true;
      slots.description = child;
    } else if (child.type === FormGroup.Caption) {
      hasCaption = true;
      slots.caption = child;
    } else if (slots.control == null) {
      slots.control = child;
    }
  });

  const slot = (slotClass: string, content: React.ReactNode) =>
    content != null ? (
      <div className={slotClass}>{content}</div>
    ) : (
      <div className={slotClass} aria-hidden />
    );

  return (
    <FormGroupProvider hasLabel={hasLabel} hasDescription={hasDescription} hasCaption={hasCaption}>
      <div className={classNames(styles['form-group'], 'form-group', className)}>
        {slot(
          'form-group__above',
          slots.label || slots.description ? (
            <>
              {slots.label}
              {slots.description}
            </>
          ) : null
        )}
        {slot('form-group__control', slots.control)}
        {slot('form-group__caption', slots.caption)}
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

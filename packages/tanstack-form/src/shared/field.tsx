'use client';

import React, { useId } from 'react';
import { FormGroup } from '@minneapolisstartribune/design-system/web';
import { type AnyFieldApi, type AnyFieldMeta, useSelector } from '@tanstack/react-form';

/**
 * A `form.Field` field holding `TValue`. `TChange` is what the adapter writes back, so an adapter
 * can read a wider type than it writes (e.g. read `string | null`, write `string`).
 */
export type BoundField<TValue, TChange = TValue> = Pick<
  AnyFieldApi,
  'name' | 'form' | 'handleBlur'
> & {
  state: { value: TValue; meta: AnyFieldMeta };
  handleChange: (value: TChange) => void;
};

/** Omit that keeps union members apart (for union prop types like CheckboxGroup's). */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Label/description/caption props shared by adapters that render their own FormGroup label. */
export interface FieldLabelProps {
  /** Renders `FormGroup.Label`, associated with the control. */
  label?: React.ReactNode;
  /** Renders `FormGroup.Description` below the label. */
  description?: React.ReactNode;
  /** Info caption below the control. Replaced by the validation error when one is visible. */
  caption?: React.ReactNode;
  /** Shows the "(Optional)" marker next to the label. */
  optional?: boolean;
}

/** Validation errors can be issues (`{ message }`) or plain strings depending on the validator. */
const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return undefined;
};

/**
 * First of `field.state.meta.errors`, once the field has been blurred or the form has been
 * submitted. `undefined` otherwise.
 */
export const useFieldError = (
  field: Pick<BoundField<unknown, never>, 'form' | 'state'>
): string | undefined => {
  const submissionAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const showErrors = field.state.meta.isBlurred || submissionAttempts > 0;
  return showErrors ? field.state.meta.errors.map(getErrorMessage).find(Boolean) : undefined;
};

/** Ids for controls that don't read FormGroup context and need aria wired by hand. */
export interface FieldGroupIds {
  label: string;
  description: string;
  caption: string;
}

export const useFieldGroupIds = (): FieldGroupIds => {
  const id = useId();
  return { label: `${id}-label`, description: `${id}-description`, caption: `${id}-caption` };
};

interface FieldGroupProps extends FieldLabelProps {
  errorMessage: string | undefined;
  /** Explicit ids for label/description/caption. Leave unset when the control reads FormGroup context. */
  ids?: FieldGroupIds;
  /** The control's id when the caller sets one, so the label still points at it. */
  htmlFor?: string;
  children: React.ReactNode;
}

/** FormGroup with the label, description and info/error caption every adapter renders. */
export const FieldGroup = ({
  label,
  description,
  caption,
  optional,
  errorMessage,
  ids,
  htmlFor,
  children,
}: FieldGroupProps) => (
  <FormGroup>
    {label != null && (
      <FormGroup.Label id={ids?.label} htmlFor={htmlFor} optional={optional}>
        {label}
      </FormGroup.Label>
    )}
    {description != null && (
      <FormGroup.Description id={ids?.description}>{description}</FormGroup.Description>
    )}
    {children}
    {errorMessage !== undefined ? (
      <FormGroup.Caption id={ids?.caption} variant="error">
        {errorMessage}
      </FormGroup.Caption>
    ) : (
      caption != null && (
        <FormGroup.Caption id={ids?.caption} variant="info">
          {caption}
        </FormGroup.Caption>
      )
    )}
  </FormGroup>
);

/** `aria-describedby` for hand-wired controls, pointing only at elements that are rendered. */
export const describedBy = (
  ids: FieldGroupIds,
  { description, caption, errorMessage }: FieldLabelProps & { errorMessage: string | undefined }
): string | undefined =>
  [
    description != null && ids.description,
    (errorMessage !== undefined || caption != null) && ids.caption,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

/**
 * Calls `onLeave` when focus moves out of the wrapped control, for controls that don't take an
 * `onBlur`. Moving focus between parts of the control (radios, options, the trigger) doesn't count.
 * `display: contents` keeps it out of layout.
 */
export const FocusBoundary = ({
  onLeave,
  children,
  ...rest
}: { onLeave: () => void; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...rest}
    style={{ display: 'contents' }}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onLeave();
    }}
  >
    {children}
  </div>
);

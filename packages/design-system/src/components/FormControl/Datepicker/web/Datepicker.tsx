'use client';

import { useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
import { DatepickerRoot } from '@/components/Datepicker/web/DatepickerRoot';
import { TextInput } from '@/components/FormControl/TextInput/web/TextInput';
import { FormGroupCaption } from '@/components/FormGroup/web/Caption/FormGroup.Caption';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { CalendarIcon, ChevronDownIcon } from '@/icons';
import { displayDateInput, parseDateInput, validateDateInput } from '../dateInput';
import type { FormControlDatepickerProps } from '../Datepicker.types';
import styles from './Datepicker.module.scss';

export type { FormControlDatepickerProps } from '../Datepicker.types';

export function FormControlDatepicker({
  value,
  defaultValue = '',
  onChange,
  min,
  max,
  required,
  calendarLabel = 'Choose a date',
  onTouched,
  name,
  className,
  size = 'medium',
  rounded = false,
  isDisabled = false,
  readOnly = false,
  isError,
  onFocus,
  onBlur,
  onInvalid,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: FormControlDatepickerProps) {
  const group = useFormGroupContext();
  const errorId = useId();
  const fieldAnchor = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  // Keep the typed text while focused: padding a partial month/day moves the caret.
  const [draft, setDraft] = useState<{ text: string; value: string } | null>(null);
  const [touched, setTouched] = useState(false);
  const currentValue = (value === undefined ? uncontrolledValue : value) ?? '';
  const calendarDisabled = isDisabled || readOnly;
  const error = validateDateInput(currentValue, { min, max, required });
  // Explicit isError lets form adapters own visibility and reset without duplicate messages.
  const localError =
    isError === undefined && !group?.hasError && touched && !calendarDisabled ? error : undefined;

  useEffect(() => {
    root.current?.querySelector('input')?.setCustomValidity(calendarDisabled ? '' : (error ?? ''));
  }, [error, calendarDisabled]);

  useEffect(() => {
    const form = root.current?.querySelector('input')?.form;
    if (!form || value !== undefined) return;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (!event.defaultPrevented) {
          setUncontrolledValue(defaultValue ?? '');
          setTouched(false);
          setDraft(null);
        }
      });
    };
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [defaultValue, value, props.form]);

  const change = (next: string) => {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };
  const touch = () => {
    setTouched(true);
    onTouched?.();
  };
  const description =
    [describedBy, group?.descriptionId, group?.captionId, localError && errorId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div
      ref={root}
      className={styles.root}
      onBlur={({ currentTarget, relatedTarget }) => {
        if (currentTarget.contains(relatedTarget)) return;
        // The calendar is rendered in a portal but is part of this field.
        const dialogId = currentTarget
          .querySelector('button[aria-controls]')
          ?.getAttribute('aria-controls');
        if (
          dialogId &&
          currentTarget.ownerDocument.getElementById(dialogId)?.contains(relatedTarget)
        )
          return;
        touch();
      }}
    >
      <div
        ref={fieldAnchor}
        className={classNames(styles.field, styles[size], rounded && styles.rounded)}
      >
        <TextInput
          {...props}
          size={size}
          rounded={rounded}
          isDisabled={isDisabled}
          readOnly={readOnly}
          required={required}
          placeholderText={props.placeholderText ?? 'Select date...'}
          className={classNames(styles.input, className)}
          value={
            draft?.value === currentValue
              ? draft.text
              : displayDateInput(currentValue, draft !== null)
          }
          icon={
            <CalendarIcon
              size={size === 'small' ? 'x-small' : 'small'}
              className={styles.fieldIcon}
              aria-hidden
            />
          }
          iconPosition="start"
          showSuccessIcon={false}
          isError={localError ? true : isError}
          aria-invalid={localError ? true : ariaInvalid}
          aria-describedby={description}
          onChange={(event) => {
            const text = event.target.value;
            const next = parseDateInput(text);
            setDraft((previous) => previous && { text, value: next });
            change(next);
          }}
          onFocus={(event) => {
            setDraft({ text: displayDateInput(currentValue, true), value: currentValue });
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setDraft(null);
            onBlur?.(event);
          }}
          onInvalid={(event) => {
            touch();
            onInvalid?.(event);
          }}
        />
        <DatepickerRoot
          fieldAnchor={fieldAnchor}
          key={calendarDisabled ? 'disabled' : 'enabled'}
          value={currentValue}
          min={min}
          max={max}
          label={calendarLabel}
          onChange={(next) => {
            change(next);
            touch();
          }}
          trigger={
            <button
              type="button"
              className={styles.trigger}
              disabled={calendarDisabled}
              aria-label={calendarLabel}
              aria-describedby={props['aria-labelledby'] ?? group?.labelId}
            >
              <ChevronDownIcon
                size={size === 'small' ? 'x-small' : 'small'}
                className={styles.fieldIcon}
                aria-hidden
              />
            </button>
          }
        />
        {name && (
          <input
            type="hidden"
            name={name}
            value={currentValue}
            disabled={isDisabled}
            form={props.form}
          />
        )}
      </div>
      {localError && (
        <FormGroupCaption id={errorId} variant="error" className={styles.error}>
          {localError}
        </FormGroupCaption>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { TextInput } from '@/components/FormControl/TextInput/web/TextInput';
import { DatePickerPopover } from '@/components/DatePicker/web/DatePickerPopover';
import type { CalendarDate } from '@/components/DatePicker/DatePicker.types';
import { formatLongDate, parseDateText } from '@/components/DatePicker/calendarDate';
import { useControllableValue } from '@/components/DatePicker/useControllableValue';
import type { IconSize } from '@/components/Icon/Icon.types';
import type { TextInputSize } from '@/components/FormControl/TextInput/TextInput.types';
import { CalendarIcon } from '@/icons';
import styles from './DatePicker.module.scss';
import type { FormControlDatePickerProps } from '../DatePicker.types';

const ICON_SIZE: Record<TextInputSize, IconSize> = {
  small: 'x-small',
  medium: 'small',
  large: 'small',
};

const toText = (value: CalendarDate | null) => (value ? formatLongDate(value) : '');

/**
 * `FormControl.DatePicker`: a text field for a date, with a calendar button that opens the
 * `DatePicker` calendar in a popover. Accepts typed dates like `MM/DD/YYYY` and shows them as
 * `November 30, 2026`; values are timezone-free `YYYY-MM-DD` strings.
 */
export const FormControlDatePicker: React.FC<FormControlDatePickerProps> = ({
  value: valueProp,
  defaultValue = null,
  onChange,
  min,
  max,
  minMessage,
  maxMessage,
  size = 'medium',
  isDisabled = false,
  isError = false,
  placeholderText = 'MM/DD/YYYY',
  name,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  dataTestId = 'date-picker',
}) => {
  const [value, setControllableValue] = useControllableValue(valueProp, defaultValue);

  // What's in the field. It only becomes `value` once committed, so typing isn't interrupted.
  const [text, setText] = useState(() => toText(value));
  const [isInvalid, setIsInvalid] = useState(false);

  // Show a value set from outside (or by the calendar) in the field.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setText(toText(value));
    setIsInvalid(false);
  }

  const setValue = (next: CalendarDate | null) => {
    setControllableValue(next);
    if (next !== value) onChange?.(next);
  };

  const commitText = () => {
    if (!text.trim()) {
      setIsInvalid(false);
      setValue(null);
      return;
    }
    // `YYYY-MM-DD` strings sort chronologically, so plain comparison works.
    const parsed = parseDateText(text);
    const isAllowed = !!parsed && (!min || parsed >= min) && (!max || parsed <= max);
    setIsInvalid(!isAllowed);
    if (!isAllowed) return;
    // Normalize e.g. `3/1/2026` to `March 1, 2026`, even when the date itself didn't change.
    setText(formatLongDate(parsed));
    setValue(parsed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitText();
    }
  };

  return (
    <div className={classNames(styles.root, className)} data-testid={dataTestId}>
      <TextInput
        id={id}
        size={size}
        isDisabled={isDisabled}
        isError={isError || isInvalid}
        placeholderText={placeholderText}
        value={text}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
        onBlur={commitText}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={classNames(styles.input, styles[size])}
        dataTestId={`${dataTestId}-input`}
      />
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <div className={classNames(styles.trailing, styles[size])}>
        <DatePickerPopover
          min={min}
          max={max}
          minMessage={minMessage}
          maxMessage={maxMessage}
          value={value}
          onChange={setValue}
          label="Choose date"
          isDisabled={isDisabled}
          dataTestId={`${dataTestId}-calendar`}
          trigger={
            <button
              type="button"
              className={styles.toggle}
              aria-label={
                value ? `Choose date, selected date is ${formatLongDate(value)}` : 'Choose date'
              }
              disabled={isDisabled}
              data-testid={`${dataTestId}-toggle`}
            >
              <CalendarIcon size={ICON_SIZE[size]} style={{ color: 'currentColor' }} aria-hidden />
            </button>
          }
        />
      </div>
    </div>
  );
};

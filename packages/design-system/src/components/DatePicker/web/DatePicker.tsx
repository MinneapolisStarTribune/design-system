'use client';

import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { TextInput } from '@/components/FormControl/TextInput/web/TextInput';
import { TriggerablePopover } from '@/components/TriggerablePopover/TriggerablePopover';
import { StaticDatePicker } from '@/components/StaticDatePicker/web/StaticDatePicker';
import type { CalendarDate } from '@/components/StaticDatePicker/StaticDatePicker.types';
import { formatLongDate, parseDateText } from '@/components/StaticDatePicker/calendarDate';
import type { IconSize } from '@/components/Icon/Icon.types';
import type { TextInputSize } from '@/components/FormControl/TextInput/TextInput.types';
import { CalendarIcon } from '@/icons';
import styles from './DatePicker.module.scss';
import type { DatePickerProps } from '../DatePicker.types';

const ICON_SIZE: Record<TextInputSize, IconSize> = {
  small: 'x-small',
  medium: 'small',
  large: 'small',
};

const toText = (value: CalendarDate | null) => (value ? formatLongDate(value) : '');

/**
 * Text field for a date, with a calendar button that opens a `StaticDatePicker` in a popover.
 * Accepts typed dates like `MM/DD/YYYY` and shows them as `November 30, 2026`; values are timezone-free `YYYY-MM-DD` strings.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
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
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolledValue;

  const [open, setOpen] = useState(false);
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
    if (!isControlled) setUncontrolledValue(next);
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

  const handleCalendarChange = (next: CalendarDate) => {
    setValue(next);
    setOpen(false);
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
        <TriggerablePopover
          open={open}
          onOpenChange={setOpen}
          isDisabled={isDisabled}
          aria-label="Choose date"
          containerClassName={styles.popoverContainer}
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
        >
          <StaticDatePicker
            value={value}
            onChange={handleCalendarChange}
            min={min}
            max={max}
            minMessage={minMessage}
            maxMessage={maxMessage}
          />
        </TriggerablePopover>
      </div>
    </div>
  );
};

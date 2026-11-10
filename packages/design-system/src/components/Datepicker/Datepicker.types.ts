import type { ReactElement } from 'react';

/** Date strings use zero-padded YYYY-MM-DD format (years 0001–9999). */
export interface DatepickerProps {
  /** Selected date. Pass null for an empty controlled selection. */
  value?: string | null;
  /** Initial selection for an uncontrolled calendar. */
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  /** Names the calendar/popover and describes the trigger. Defaults to 'Choose a date'. */
  label?: string;
  /** Earliest selectable date, inclusive. */
  min?: string;
  /** Latest selectable date, inclusive. */
  max?: string;
  /** A focusable element that forwards its ref and DOM props. Omit to render inline. */
  trigger?: ReactElement;
}

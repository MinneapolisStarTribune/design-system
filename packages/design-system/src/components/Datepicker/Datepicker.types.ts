import type { ReactElement } from 'react';

/** A real calendar date in zero-padded YYYY-MM-DD format (years 0001–9999). */
type CalendarDate = `${number}-${number}-${number}`;

export interface DatepickerProps {
  /** Selected date. Pass null for an empty controlled selection. */
  value?: CalendarDate | null;
  /** Initial selection for an uncontrolled calendar. */
  defaultValue?: CalendarDate | null;
  onChange?: (value: CalendarDate) => void;
  /** Names the calendar/popover and describes the trigger. Defaults to 'Choose a date'. */
  label?: string;
  /** Earliest selectable date, inclusive. */
  min?: CalendarDate;
  /** Latest selectable date, inclusive. */
  max?: CalendarDate;
  /** A focusable element that forwards its ref and DOM props. Omit to render inline. */
  trigger?: ReactElement;
}

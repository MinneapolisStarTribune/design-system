import type { ReactElement } from 'react';
import type { BaseProps, Position } from '@/types/globalTypes';

/**
 * A calendar date as an ISO `YYYY-MM-DD` string, e.g. `'2026-03-10'`.
 *
 * Deliberately not a `Date`: a `Date` is an instant in time, so the day it lands on depends on the
 * viewer's timezone. A plain date string is the same day everywhere, on the server and the client.
 */
export type CalendarDate = `${number}-${number}-${number}`;

/** Calendar options shared by `DatePicker` and `FormControl.DatePicker`. */
export interface DatePickerCalendarOptions {
  /**
   * Earliest selectable date, e.g. a season's first game. Earlier days are disabled and the
   * previous-month arrow stops at this month.
   */
  min?: CalendarDate;
  /** Latest selectable date. Later days are disabled and the next-month arrow stops at this month. */
  max?: CalendarDate;
  /**
   * Tooltip on the previous-month arrow once it reaches `min`'s month, e.g. "No games to display
   * before November 2025".
   * @default 'No dates available before {Month Year}'
   */
  minMessage?: string;
  /**
   * Tooltip on the next-month arrow once it reaches `max`'s month.
   * @default 'No dates available after {Month Year}'
   */
  maxMessage?: string;
}

interface DatePickerBaseProps extends DatePickerCalendarOptions, BaseProps {
  /** Selected date (controlled). Pass `null` for no selection. */
  value?: CalendarDate | null;
  /** Initially selected date when uncontrolled. */
  defaultValue?: CalendarDate | null;
  /** Called with the picked date. */
  onChange?: (value: CalendarDate) => void;
  /**
   * Accessible name for the calendar. With a `trigger`, it also names the popover and describes the
   * trigger, so it's announced as e.g. "March 10, 2026, button, Choose a date".
   * @default 'Choose a date'
   */
  label?: string;
}

/** Any element; its own `aria-label` / `aria-describedby` are read to decide how to describe it. */
export type DatePickerTrigger = ReactElement<{
  'aria-label'?: string;
  'aria-describedby'?: string;
}>;

interface DatePickerInlineProps extends DatePickerBaseProps {
  trigger?: undefined;
  placement?: never;
  portalRoot?: never;
}

interface DatePickerPopoverProps extends DatePickerBaseProps {
  /**
   * Opens the calendar in a popover when clicked, e.g. a `Button` showing the date. Without it, the
   * calendar renders inline. The popover closes when a day is picked.
   */
  trigger: DatePickerTrigger;
  /**
   * Which side of the trigger the popover appears on.
   * @default 'bottom'
   */
  placement?: Position;
  /** Renders the popover into this element instead of `document.body`, e.g. inside a modal. */
  portalRoot?: HTMLElement | null;
}

export type DatePickerProps = DatePickerInlineProps | DatePickerPopoverProps;

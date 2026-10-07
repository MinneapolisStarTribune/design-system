import type { BaseProps } from '@/types/globalTypes';

/**
 * A calendar date as an ISO `YYYY-MM-DD` string, e.g. `'2026-03-10'`.
 *
 * Deliberately not a `Date`: a `Date` is an instant in time, so the day it lands on depends on the
 * viewer's timezone. A plain date string is the same day everywhere, on the server and the client.
 */
export type CalendarDate = `${number}-${number}-${number}`;

export interface StaticDatePickerProps extends BaseProps {
  /** Selected date (controlled). Pass `null` for no selection. */
  value?: CalendarDate | null;
  /** Initially selected date when uncontrolled. */
  defaultValue?: CalendarDate | null;
  /** Called with the clicked date. */
  onChange?: (value: CalendarDate) => void;
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
  /**
   * Accessible name for the calendar.
   * @default 'Choose a date'
   */
  label?: string;
}

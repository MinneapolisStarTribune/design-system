import { parseDate } from '../../Datepicker/calendarDates';
import type { DateInputLimits } from './Datepicker.types';

const dateLabel = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function parseDateInput(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (parseDate(trimmed) !== null) return trimmed;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (match) {
    const [, month, day, year] = match;
    const value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (parseDate(value) !== null) return value;
  }
  // Keeping invalid edits in form state prevents submission of an old selection.
  return text;
}

export function displayDateInput(value: string, editing = false): string {
  const date = parseDate(value);
  if (date === null) return value;
  if (editing) {
    const [year, month, day] = value.split('-');
    return `${month}/${day}/${year}`;
  }
  return dateLabel.format(date);
}

/** Use the same limits in field validators to guard programmatic form submissions. */
export function validateDateInput(
  value: string | null,
  { min, max, required }: DateInputLimits = {}
): string | undefined {
  if (!value) return required ? 'Choose a date.' : undefined;
  if (parseDate(value) === null) return 'Enter a valid date in MM/DD/YYYY format.';
  if (min && parseDate(min) !== null && value < min)
    return `Choose a date on or after ${displayDateInput(min)}.`;
  if (max && parseDate(max) !== null && value > max)
    return `Choose a date on or before ${displayDateInput(max)}.`;
  return undefined;
}

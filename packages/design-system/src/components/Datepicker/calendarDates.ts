import type { DatepickerProps } from './Datepicker.types';

// UTC is used only for calendar arithmetic; values never represent a consumer's instant in time.
export const DAY = 86_400_000;

function dateAt(year: number, month: number, day: number): number {
  const date = new Date(0);
  date.setUTCFullYear(year, month, day);
  return date.getTime();
}

export const FIRST_DATE = dateAt(1, 0, 1);
export const LAST_DATE = dateAt(9999, 11, 31);

export function parseDate(value: string | null | undefined): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const result = dateAt(year, month - 1, day);
  const date = new Date(result);
  return year >= 1 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? result
    : null;
}

export function formatDate(day: number): NonNullable<DatepickerProps['value']> {
  const date = new Date(day);
  return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}` as NonNullable<
    DatepickerProps['value']
  >;
}

export function today(): number {
  const now = new Date();
  return dateAt(now.getFullYear(), now.getMonth(), now.getDate());
}

export function monthStart(day: number): number {
  const date = new Date(day);
  return dateAt(date.getUTCFullYear(), date.getUTCMonth(), 1);
}

export function addMonths(day: number, amount: number): number {
  const date = new Date(day);
  const lastDay = new Date(dateAt(date.getUTCFullYear(), date.getUTCMonth() + amount + 1, 0));
  return dateAt(
    lastDay.getUTCFullYear(),
    lastDay.getUTCMonth(),
    Math.min(date.getUTCDate(), lastDay.getUTCDate())
  );
}

export function clampDate(day: number, min: number, max: number): number {
  return Math.max(min, Math.min(day, max));
}

export const monthLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const dayLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

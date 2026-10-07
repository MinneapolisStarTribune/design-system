import type { CalendarDate } from './StaticDatePicker.types';

/*
 * Calendar math on plain year/month/day numbers. `Date` is only used through its UTC methods, which
 * never shift with the viewer's timezone or daylight saving, so no date library is needed.
 */

/** `month` is 0-based, like `Date`. */
export interface YearMonth {
  year: number;
  month: number;
}

const pad = (n: number, length = 2) => String(n).padStart(length, '0');

export const toCalendarDate = (year: number, month: number, day: number): CalendarDate =>
  `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}` as CalendarDate;

export const parseCalendarDate = (value: CalendarDate) => {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month: month - 1, day };
};

/** Today in the viewer's own calendar. */
export const getToday = (): CalendarDate => {
  const now = new Date();
  return toCalendarDate(now.getFullYear(), now.getMonth(), now.getDate());
};

/** Shifts a date by `days`, rolling over months and years. */
export const addDays = (value: CalendarDate, days: number): CalendarDate => {
  const { year, month, day } = parseCalendarDate(value);
  const shifted = new Date(Date.UTC(year, month, day + days));
  return toCalendarDate(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
};

export const addMonths = ({ year, month }: YearMonth, months: number): YearMonth => {
  const total = year * 12 + month + months;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
};

/** Day 0 of the next month is the last day of this one. */
export const getDaysInMonth = ({ year, month }: YearMonth) =>
  new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

export interface CalendarDay {
  date: CalendarDate;
  day: number;
  /** False for the previous/next month's days that pad out the first and last weeks. */
  inMonth: boolean;
}

/** The month's days in Sunday-first weeks, padded with neighboring months' days. */
export const getMonthWeeks = (yearMonth: YearMonth): CalendarDay[][] => {
  const { year, month } = yearMonth;
  const leading = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = getDaysInMonth(yearMonth);
  const weekCount = Math.ceil((leading + daysInMonth) / 7);
  const firstShown = addDays(toCalendarDate(year, month, 1), -leading);

  return Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = addDays(firstShown, week * 7 + weekday);
      const parsed = parseCalendarDate(date);
      return { date, day: parsed.day, inMonth: parsed.month === month };
    })
  );
};

// Hardcoded rather than `Intl` so server and client render identical text.
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** `2026-11-30` → `November 30, 2026` */
export const formatLongDate = (value: CalendarDate) => {
  const { year, month, day } = parseCalendarDate(value);
  return `${MONTH_NAMES[month]} ${day}, ${year}`;
};

/** 1-based month for a full or abbreviated (3+ letter) English month name, e.g. `nov` → 11. */
const parseMonthName = (name: string) => {
  const lower = name.toLowerCase();
  const index =
    lower.length >= 3
      ? MONTH_NAMES.findIndex((month) => month.toLowerCase().startsWith(lower))
      : -1;
  return index + 1 || null;
};

/**
 * Parses what someone typed: `M/D/YYYY` (also with `-` or `.`), ISO `YYYY-MM-DD`, or
 * `November 30, 2026` (also `Nov 30 2026`). Returns `null` for anything that isn't a real date,
 * e.g. `02/30/2026`.
 */
export const parseDateText = (text: string): CalendarDate | null => {
  const trimmed = text.trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  const us = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(trimmed);
  const long = /^([a-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/i.exec(trimmed);
  const parts = iso
    ? [iso[1], iso[2], iso[3]]
    : us
      ? [us[3], us[1], us[2]]
      : long
        ? [long[3], parseMonthName(long[1]), long[2]]
        : null;
  if (!parts) return null;

  const [year, month, day] = parts.map(Number);
  if (!month || month > 12 || day < 1) return null;
  if (day > getDaysInMonth({ year, month: month - 1 })) return null;
  return toCalendarDate(year, month - 1, day);
};

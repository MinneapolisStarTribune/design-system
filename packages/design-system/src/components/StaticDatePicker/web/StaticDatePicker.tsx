'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';
import styles from './StaticDatePicker.module.scss';
import type { CalendarDate, StaticDatePickerProps } from '../StaticDatePicker.types';
import {
  addDays,
  addMonths,
  getDaysInMonth,
  getMonthWeeks,
  getToday,
  MONTH_NAMES,
  parseCalendarDate,
  toCalendarDate,
  type YearMonth,
} from '../calendarDate';

const WEEKDAYS = [
  { short: 'Su', long: 'Sunday' },
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
];

const KEY_DAY_OFFSETS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

const toYearMonth = (date: CalendarDate): YearMonth => {
  const { year, month } = parseCalendarDate(date);
  return { year, month };
};

const monthIndex = ({ year, month }: YearMonth) => year * 12 + month;

const isInMonth = (date: CalendarDate, yearMonth: YearMonth) =>
  monthIndex(toYearMonth(date)) === monthIndex(yearMonth);

const formatMonth = ({ year, month }: YearMonth) => `${MONTH_NAMES[month]} ${year}`;

/**
 * Month-view calendar that's always shown, with no text input or popover. Values are timezone-free
 * `YYYY-MM-DD` strings.
 */
export const StaticDatePicker: React.FC<StaticDatePickerProps> = ({
  value: valueProp,
  defaultValue = null,
  onChange,
  min,
  max,
  minMessage,
  maxMessage,
  label = 'Choose a date',
  className,
  style,
  dataTestId = 'static-date-picker',
}) => {
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolledValue;

  // `YYYY-MM-DD` strings sort chronologically, so plain comparison works.
  const clampDate = (date: CalendarDate) =>
    min && date < min ? min : max && date > max ? max : date;
  const isInRange = (date: CalendarDate) => (!min || date >= min) && (!max || date <= max);

  const [today] = useState(getToday);
  const [visibleMonth, setVisibleMonth] = useState(() => toYearMonth(clampDate(value ?? today)));
  // Day that holds the calendar's single Tab stop and moves with the arrow keys.
  const [focusedDate, setFocusedDate] = useState(() => clampDate(value ?? today));

  // Follow a controlled value to its month when it changes from outside.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value) {
      setVisibleMonth(toYearMonth(value));
      setFocusedDate(value);
    }
  }

  const gridRef = useRef<HTMLTableElement>(null);
  const shouldMoveFocus = useRef(false);
  useEffect(() => {
    if (!shouldMoveFocus.current) return;
    shouldMoveFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusedDate}"]`)?.focus();
  }, [focusedDate]);

  const headingId = useId();
  const tabStop = isInMonth(focusedDate, visibleMonth)
    ? focusedDate
    : value && isInMonth(value, visibleMonth)
      ? value
      : clampDate(toCalendarDate(visibleMonth.year, visibleMonth.month, 1));

  const canShowPrevious = !min || monthIndex(visibleMonth) > monthIndex(toYearMonth(min));
  const canShowNext = !max || monthIndex(visibleMonth) < monthIndex(toYearMonth(max));

  const select = (date: CalendarDate) => {
    setFocusedDate(date);
    if (!isControlled) setUncontrolledValue(date);
    onChange?.(date);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    let next: CalendarDate | undefined;
    if (event.key in KEY_DAY_OFFSETS) {
      next = addDays(tabStop, KEY_DAY_OFFSETS[event.key]);
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const { day } = parseCalendarDate(tabStop);
      const target = addMonths(toYearMonth(tabStop), event.key === 'PageUp' ? -1 : 1);
      // Clamp to the target month's length, e.g. Mar 31 → Feb 28.
      next = toCalendarDate(target.year, target.month, Math.min(day, getDaysInMonth(target)));
    }
    if (!next) return;

    event.preventDefault();
    next = clampDate(next);
    shouldMoveFocus.current = true;
    setFocusedDate(next);
    if (!isInMonth(next, visibleMonth)) setVisibleMonth(toYearMonth(next));
  };

  const renderNavButton = (direction: 'previous' | 'next') => {
    const isPrevious = direction === 'previous';
    const enabled = isPrevious ? canShowPrevious : canShowNext;
    const limitMessage = isPrevious
      ? (minMessage ?? `No dates available before ${formatMonth(visibleMonth)}`)
      : (maxMessage ?? `No dates available after ${formatMonth(visibleMonth)}`);

    // Stays focusable and hoverable while unavailable (`aria-disabled`, not `disabled`) so the
    // tooltip explaining why can still show. Always wrapped, so it doesn't remount and lose focus.
    return (
      <Tooltip label={limitMessage} pointer="bottom" isDisabled={enabled}>
        <button
          type="button"
          className={styles.navButton}
          aria-label={isPrevious ? 'Previous month' : 'Next month'}
          aria-disabled={!enabled || undefined}
          onClick={() => {
            if (enabled) setVisibleMonth((current) => addMonths(current, isPrevious ? -1 : 1));
          }}
          data-testid={`${dataTestId}-${direction}`}
        >
          {isPrevious ? (
            <ChevronLeftIcon size="small" aria-hidden />
          ) : (
            <ChevronRightIcon size="small" aria-hidden />
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={classNames(styles.root, className)}
      style={style}
      data-testid={dataTestId}
    >
      <div className={styles.header}>
        {renderNavButton('previous')}
        <div
          id={headingId}
          className={classNames(styles.heading, 'typography-utility-text-medium-small')}
          aria-live="polite"
        >
          {formatMonth(visibleMonth)}
        </div>
        {renderNavButton('next')}
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={headingId}
        className={styles.grid}
        onKeyDown={handleKeyDown}
      >
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th
                key={weekday.short}
                scope="col"
                abbr={weekday.long}
                className={classNames(styles.weekday, 'typography-utility-label-medium')}
              >
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getMonthWeeks(visibleMonth).map((week) => (
            <tr key={week[0].date}>
              {week.map(({ date, day, inMonth }, weekday) => {
                if (!inMonth) {
                  return (
                    <td key={date} className={styles.cell}>
                      <span
                        className={classNames(
                          styles.day,
                          styles.unavailable,
                          'typography-utility-label-medium'
                        )}
                        aria-hidden="true"
                      >
                        {day}
                      </span>
                    </td>
                  );
                }

                const selected = date === value;
                const available = isInRange(date);
                return (
                  <td key={date} className={styles.cell} aria-selected={selected}>
                    <button
                      type="button"
                      data-date={date}
                      tabIndex={date === tabStop ? 0 : -1}
                      disabled={!available}
                      aria-label={`${WEEKDAYS[weekday].long}, ${MONTH_NAMES[visibleMonth.month]} ${day}, ${visibleMonth.year}`}
                      aria-current={date === today ? 'date' : undefined}
                      className={classNames(
                        styles.day,
                        { [styles.selected]: selected, [styles.unavailable]: !available },
                        'typography-utility-label-medium'
                      )}
                      onClick={() => select(date)}
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

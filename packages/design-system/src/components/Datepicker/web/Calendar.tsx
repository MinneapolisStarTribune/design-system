'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import classNames from 'classnames';
import { UtilityButton } from '@/components/Button/web/UtilityButton';
import { UtilityLabel } from '@/components/Typography/Utility';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';
import {
  addMonths,
  clampDate,
  DAY,
  dayLabel,
  monthLabel,
  monthStart,
  today,
} from '../calendarDates';
import styles from './Datepicker.module.scss';

const subscribeToToday = () => () => undefined;
const getServerToday = () => null;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface CalendarProps {
  selected: number | null;
  min: number;
  max: number;
  label: string;
  onSelect: (day: number) => void;
  initialFocusRef: RefObject<HTMLElement | null>;
}

/** Shared calendar body. Selection is separate from the day used for navigation and focus. */
export function Calendar({ selected, min, max, label, onSelect, initialFocusRef }: CalendarProps) {
  const labelId = useId();
  const monthId = useId();
  const helpId = useId();
  const restoreDayFocus = useRef(false);
  const currentDay = useSyncExternalStore(subscribeToToday, today, getServerToday);
  const [navigation, setNavigation] = useState(() => {
    const day = selected ?? currentDay;
    return { selected, min, max, day: day === null ? null : clampDate(day, min, max) };
  });

  // Reconcile before rendering so changed limits never leave a disabled day as the sole tab stop.
  if (
    navigation.selected !== selected ||
    navigation.min !== min ||
    navigation.max !== max ||
    (navigation.day === null && currentDay !== null)
  ) {
    const day =
      navigation.selected !== selected || navigation.day === null
        ? (selected ?? currentDay)
        : navigation.day;
    setNavigation({ selected, min, max, day: day === null ? null : clampDate(day, min, max) });
  }

  const focusedDay = clampDate(navigation.day ?? min, min, max);
  const month = monthStart(focusedDay);
  const nextMonth = addMonths(month, 1);
  const gridStart = month - new Date(month).getUTCDay() * DAY;
  const weekCount = Math.ceil((nextMonth - gridStart) / DAY / 7);
  const emptyRange = min > max;
  const previousDisabled = emptyRange || month <= monthStart(min);
  const nextDisabled = emptyRange || nextMonth > max;

  useEffect(() => {
    if (restoreDayFocus.current) initialFocusRef.current?.focus();
  }, [focusedDay, min, max, initialFocusRef]);

  function navigate(day: number) {
    if (!emptyRange) setNavigation({ selected, min, max, day: clampDate(day, min, max) });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: number) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let target: number;
    switch (event.key) {
      case 'ArrowLeft':
        target = day - DAY;
        break;
      case 'ArrowRight':
        target = day + DAY;
        break;
      case 'ArrowUp':
        target = day - 7 * DAY;
        break;
      case 'ArrowDown':
        target = day + 7 * DAY;
        break;
      case 'Home':
        target = day - new Date(day).getUTCDay() * DAY;
        break;
      case 'End':
        target = day + (6 - new Date(day).getUTCDay()) * DAY;
        break;
      case 'PageUp':
        target = addMonths(day, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        target = addMonths(day, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    navigate(target);
  }

  // Without a selected date, the server cannot know which local month to show.
  if (navigation.day === null) {
    return <div className={styles.calendar} aria-label={label} aria-busy="true" />;
  }

  return (
    <div
      className={styles.calendar}
      onFocusCapture={(event) => {
        restoreDayFocus.current = event.target.hasAttribute('data-calendar-day') || emptyRange;
      }}
      onBlurCapture={() => {
        restoreDayFocus.current = false;
      }}
    >
      <span id={labelId} className={styles.srOnly}>
        {label}
      </span>
      <span id={helpId} className={styles.srOnly}>
        Use arrow keys to move by day or week, Home and End within a week, and Page Up and Page Down
        to change months.
      </span>
      <div className={styles.header}>
        <UtilityButton
          size="small"
          icon={<ChevronLeftIcon />}
          className={styles.navigation}
          aria-label="Previous month"
          aria-disabled={previousDisabled}
          onClick={() => {
            if (!previousDisabled) navigate(addMonths(focusedDay, -1));
          }}
        />
        <div id={monthId} aria-live="polite" aria-atomic="true">
          <UtilityLabel size="medium" weight="semibold">
            {monthLabel.format(month)}
          </UtilityLabel>
        </div>
        <UtilityButton
          size="small"
          icon={<ChevronRightIcon />}
          className={styles.navigation}
          aria-label="Next month"
          aria-disabled={nextDisabled}
          onClick={() => {
            if (!nextDisabled) navigate(addMonths(focusedDay, 1));
          }}
        />
      </div>
      <table
        role="grid"
        className={styles.grid}
        aria-labelledby={`${labelId} ${monthId}`}
        aria-describedby={helpId}
        tabIndex={emptyRange ? 0 : undefined}
        ref={(node) => {
          if (emptyRange) initialFocusRef.current = node;
        }}
      >
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day} scope="col" abbr={day}>
                <UtilityLabel size="small" weight="regular">
                  {day.slice(0, 2)}
                </UtilityLabel>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: weekCount }, (_, week) => (
            <tr key={week}>
              {WEEKDAYS.map((_, weekday) => {
                const day = gridStart + (week * 7 + weekday) * DAY;
                const outsideMonth = day < month || day >= nextMonth;
                const disabled = outsideMonth || emptyRange || day < min || day > max;
                const isSelected = !outsideMonth && day === selected;
                return (
                  <td key={weekday} role="gridcell" aria-selected={isSelected}>
                    <button
                      type="button"
                      data-calendar-day=""
                      className={classNames(styles.day, isSelected && styles.selected)}
                      disabled={disabled}
                      tabIndex={!disabled && day === focusedDay ? 0 : -1}
                      ref={
                        day === focusedDay && !disabled
                          ? (node) => {
                              initialFocusRef.current = node;
                            }
                          : undefined
                      }
                      aria-label={dayLabel.format(day)}
                      aria-current={day === currentDay ? 'date' : undefined}
                      onFocus={() => navigate(day)}
                      onKeyDown={(event) => handleKeyDown(event, day)}
                      onClick={() => onSelect(day)}
                    >
                      <UtilityLabel size="small" weight="regular">
                        {new Date(day).getUTCDate()}
                      </UtilityLabel>
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
}

'use client';

import { cloneElement, useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { TriggerablePopover } from '@/components/TriggerablePopover/TriggerablePopover';
import type { Position } from '@/types/globalTypes';
import styles from './DatePickerPopover.module.scss';
import { DatePickerCalendar } from './DatePickerCalendar';
import type {
  CalendarDate,
  DatePickerCalendarOptions,
  DatePickerTrigger,
} from '../DatePicker.types';

export interface DatePickerPopoverProps extends DatePickerCalendarOptions {
  trigger: DatePickerTrigger;
  value: CalendarDate | null;
  onChange: (value: CalendarDate) => void;
  label: string;
  placement?: Position;
  portalRoot?: HTMLElement | null;
  isDisabled?: boolean;
  dataTestId?: string;
}

/**
 * Internal: the calendar in a modal popover, shared by `DatePicker` (with a `trigger`) and
 * `FormControl.DatePicker`. Opens with focus on the selected day, closes on pick, and closes with a
 * single Escape even while an arrow's tooltip is showing.
 */
export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  trigger,
  value,
  onChange,
  label,
  placement = 'bottom',
  portalRoot,
  isDisabled,
  dataTestId,
  ...calendarOptions
}) => {
  const [open, setOpen] = useState(false);
  const hintId = useId();

  // A trigger that shows the date (e.g. "March 10, 2026") doesn't say what it does, so describe it
  // with `label`. Skipped when the trigger names itself, e.g. an icon-only button.
  const hasOwnLabel = Boolean(trigger.props['aria-label']);
  const describedTrigger = hasOwnLabel
    ? trigger
    : cloneElement(trigger, {
        'aria-describedby': [trigger.props['aria-describedby'], hintId].filter(Boolean).join(' '),
      });

  // Capture phase: the arrow tooltip handles Escape on the arrow itself and stops propagation, so a
  // bubbling handler here would never see it and the first press would close only the tooltip.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <>
      {!hasOwnLabel && (
        <span id={hintId} hidden>
          {label}
        </span>
      )}
      <TriggerablePopover
        trigger={describedTrigger}
        open={open}
        onOpenChange={setOpen}
        isDisabled={isDisabled}
        placement={placement}
        portalRoot={portalRoot}
        modal
        // The calendar focuses the selected day itself (`autoFocus`).
        initialFocus={-1}
        aria-label={label}
        containerClassName={styles.container}
      >
        <div onKeyDownCapture={handleKeyDown}>
          <DatePickerCalendar
            {...calendarOptions}
            value={value}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
            label={label}
            autoFocus
            dataTestId={dataTestId}
          />
        </div>
      </TriggerablePopover>
    </>
  );
};

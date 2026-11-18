'use client';

import { cloneElement, useEffect, useId, useRef, useState } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { useInteractions } from '@floating-ui/react';
import { FloatingSurface, useFloatingSurface } from '@/components/FloatingSurface/FloatingSurface';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { FIRST_DATE, formatDate, LAST_DATE, parseDate } from '../calendarDates';
import type { DatepickerProps } from '../Datepicker.types';
import { Calendar } from './Calendar';
import styles from './Datepicker.module.scss';

interface DatepickerRootProps extends DatepickerProps {
  fieldAnchor?: RefObject<HTMLDivElement | null>;
  calendarKey?: number;
  arrowStaticOffset?: number;
  footer?: ReactNode;
}

/** Internal composition shared by Datepicker and the Today action example. */
export function DatepickerRoot({
  value,
  defaultValue = null,
  onChange,
  label = 'Choose a date',
  min,
  max,
  trigger,
  fieldAnchor,
  calendarKey,
  arrowStaticOffset,
  footer,
}: DatepickerRootProps) {
  useBrandValidation('Datepicker');
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const descriptionId = useId();
  const initialFocus = useRef<HTMLElement | null>(null);
  const surface = useFloatingSurface({
    open,
    onOpenChange: setOpen,
    placement: fieldAnchor ? 'bottom-start' : 'bottom-end',
    hideArrow: !!fieldAnchor,
    matchAnchorWidth: !!fieldAnchor,
  });
  // Keep keyboard focus on the trigger while positioning the panel against the entire field.
  const { setPositionReference } = surface.context.refs;
  useEffect(() => {
    if (fieldAnchor) setPositionReference(fieldAnchor.current);
  }, [fieldAnchor, setPositionReference]);

  const interactions = useInteractions(surface.interactions);
  const selected = parseDate(value !== undefined ? value : uncontrolledValue);

  function select(day: number) {
    const nextValue = formatDate(day);
    if (value === undefined) setUncontrolledValue(nextValue);
    setOpen(false);
    onChange?.(nextValue);
  }

  const calendar = (
    <Calendar
      key={calendarKey}
      selected={selected}
      min={parseDate(min) ?? FIRST_DATE}
      max={parseDate(max) ?? LAST_DATE}
      label={label}
      onSelect={select}
      initialFocusRef={initialFocus}
    />
  );

  if (!trigger) return calendar;

  const element = trigger as ReactElement<{ 'aria-describedby'?: string }>;
  const describedTrigger = cloneElement(element, {
    'aria-describedby': [element.props['aria-describedby'], descriptionId]
      .filter(Boolean)
      .join(' '),
  });

  return (
    <>
      <span id={descriptionId} className={styles.srOnly}>
        {label}
      </span>
      <FloatingSurface
        surface={surface}
        interactions={interactions}
        trigger={describedTrigger}
        initialFocus={initialFocus}
        arrowStaticOffset={arrowStaticOffset}
        className={fieldAnchor ? `${styles.popover} ${styles.fieldPopover}` : styles.popover}
        containerClassName={styles.popoverContainer}
        aria-label={label}
      >
        {calendar}
        {footer}
      </FloatingSurface>
    </>
  );
}

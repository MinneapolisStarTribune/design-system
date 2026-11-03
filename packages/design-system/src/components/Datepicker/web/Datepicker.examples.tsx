import { cloneElement, forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactElement, RefObject } from 'react';
import { UtilityButton } from '@/components/Button/web/UtilityButton';
import { useBreakpoint } from '@/hooks/useResponsiveValue';
import { CalendarIcon, ChevronUpIcon } from '@/icons';
import { FIRST_DATE, formatDate, LAST_DATE, parseDate, today } from '../calendarDates';
import type { DatepickerProps } from './Datepicker';
import { DatepickerRoot } from './DatepickerRoot';
import styles from './Datepicker.module.scss';

interface TodayTriggerProps extends ComponentPropsWithoutRef<'button'> {
  isMobile: boolean;
  todayAction: ReactElement<ComponentPropsWithoutRef<typeof UtilityButton>>;
  todayRef: RefObject<HTMLButtonElement | null>;
}

// Consumer-owned composition: FloatingSurface forwards its state and handlers to this trigger.
const TodayTrigger = forwardRef<HTMLDivElement, TodayTriggerProps>(
  ({ isMobile, todayAction, todayRef, ...triggerProps }, ref) => {
    const toggleRef = useRef<HTMLButtonElement>(null);
    const expanded =
      triggerProps['aria-expanded'] === true || triggerProps['aria-expanded'] === 'true';
    const showToday = expanded && !isMobile;
    useLayoutEffect(() => {
      if (!showToday && todayRef.current?.ownerDocument.activeElement === todayRef.current) {
        toggleRef.current?.focus();
      }
    }, [showToday, todayRef]);

    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={styles.calendarControls}
        data-mobile={isMobile}
        onFocus={(event) => {
          // Return focus from the popover to the actual toggle within this compound reference.
          if (event.target === event.currentTarget) toggleRef.current?.focus();
        }}
      >
        {!isMobile && (
          <div className={styles.todayReveal} data-visible={showToday} aria-hidden={!showToday}>
            <div className={styles.todayClip}>
              {cloneElement(todayAction, { tabIndex: showToday ? undefined : -1 })}
            </div>
          </div>
        )}
        <UtilityButton
          ref={toggleRef}
          icon={showToday ? <ChevronUpIcon /> : <CalendarIcon />}
          className={showToday ? styles.joinedCalendarToggle : styles.calendarToggle}
          aria-label={expanded ? 'Close calendar' : 'Open calendar'}
          aria-expanded={triggerProps['aria-expanded']}
          aria-controls={triggerProps['aria-controls']}
          aria-haspopup={triggerProps['aria-haspopup']}
          aria-describedby={triggerProps['aria-describedby']}
          onClick={triggerProps.onClick}
          onPointerDown={triggerProps.onPointerDown}
          onMouseDown={triggerProps.onMouseDown}
          onKeyDown={triggerProps.onKeyDown}
          onKeyUp={triggerProps.onKeyUp}
          style={triggerProps.style}
        />
      </div>
    );
  }
);

TodayTrigger.displayName = 'TodayTrigger';

/** Story-only example of a consumer owning its date and Today action. */
export function TodayDatepickerExample({
  defaultValue = formatDate(today()),
  min,
  max,
  onChange,
}: Pick<DatepickerProps, 'defaultValue' | 'min' | 'max' | 'onChange'>) {
  const [date, setDate] = useState(defaultValue);
  const [calendarKey, setCalendarKey] = useState(0);
  const isMobile = useBreakpoint() === 'small';
  const todayRef = useRef<HTMLButtonElement>(null);
  const restoreTodayFocus = useRef(false);
  const setTodayRef = useCallback((button: HTMLButtonElement | null) => {
    todayRef.current = button;
    return () => {
      restoreTodayFocus.current = button !== null && button.ownerDocument.activeElement === button;
      todayRef.current = null;
    };
  }, []);
  useLayoutEffect(() => {
    // Preserve keyboard focus when the action moves between the trigger and footer.
    if (restoreTodayFocus.current && todayRef.current?.tabIndex !== -1) todayRef.current?.focus();
    restoreTodayFocus.current = false;
  }, [isMobile]);
  const currentDay = today();
  const earliest = parseDate(min) ?? FIRST_DATE;
  const latest = parseDate(max) ?? LAST_DATE;

  function selectDate(value: NonNullable<DatepickerProps['value']>) {
    setDate(value);
    onChange?.(value);
  }

  function selectToday() {
    const day = today();
    if (day >= earliest && day <= latest) {
      selectDate(formatDate(day));
      // Reset browsing even when today is already selected.
      setCalendarKey((key) => key + 1);
    }
  }

  const todayAction = (
    <UtilityButton
      ref={setTodayRef}
      label="Today"
      isDisabled={currentDay < earliest || currentDay > latest}
      className={styles.todayButton}
      onClick={selectToday}
    />
  );

  return (
    <DatepickerRoot
      calendarKey={calendarKey}
      // Center the 16px arrow beneath the 40px toggle at the end of the compound reference.
      arrowStaticOffset={(40 - 16) / 2}
      value={date}
      onChange={selectDate}
      min={min}
      max={max}
      footer={isMobile ? <div className={styles.todayFooter}>{todayAction}</div> : undefined}
      trigger={<TodayTrigger isMobile={isMobile} todayAction={todayAction} todayRef={todayRef} />}
    />
  );
}

'use client';

import type { CalendarDate, DatePickerProps } from '../DatePicker.types';
import { useControllableValue } from '../useControllableValue';
import { DatePickerCalendar } from './DatePickerCalendar';
import { DatePickerPopover } from './DatePickerPopover';

/**
 * Month-view calendar for picking a date. Renders inline, or in a popover opened by `trigger`.
 * Values are timezone-free `YYYY-MM-DD` strings. For a text field, use `FormControl.DatePicker`.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value: valueProp,
  defaultValue = null,
  onChange,
  label = 'Choose a date',
  trigger,
  placement,
  portalRoot,
  min,
  max,
  minMessage,
  maxMessage,
  className,
  style,
  dataTestId = 'date-picker',
}) => {
  const [value, setValue] = useControllableValue(valueProp, defaultValue);

  const handleChange = (next: CalendarDate) => {
    setValue(next);
    onChange?.(next);
  };

  const calendarOptions = { min, max, minMessage, maxMessage };

  if (trigger) {
    return (
      <DatePickerPopover
        {...calendarOptions}
        trigger={trigger}
        value={value}
        onChange={handleChange}
        label={label}
        placement={placement}
        portalRoot={portalRoot}
        dataTestId={dataTestId}
      />
    );
  }

  return (
    <DatePickerCalendar
      {...calendarOptions}
      value={value}
      onChange={handleChange}
      label={label}
      className={className}
      style={style}
      dataTestId={dataTestId}
    />
  );
};

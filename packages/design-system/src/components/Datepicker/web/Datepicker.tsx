'use client';

import type { DatepickerProps } from '../Datepicker.types';
import { DatepickerRoot } from './DatepickerRoot';

export type { DatepickerProps } from '../Datepicker.types';

export function Datepicker(props: DatepickerProps) {
  return <DatepickerRoot {...props} />;
}

Datepicker.displayName = 'Datepicker';

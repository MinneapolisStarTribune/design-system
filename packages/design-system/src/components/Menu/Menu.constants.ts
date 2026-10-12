import { POSITIONS } from '@/types';

export const MENU_PLACEMENTS = POSITIONS.flatMap(
  (side) => [side, `${side}-start`, `${side}-end`] as const
);

export const MENU_ARROW_OFFSETS = ['start', 'center', 'end'] as const;

import { FontWeight, Size } from '@/types/globalTypes';

/**
 * UtilityBody supports a constrained subset of global font tokens
 */
export type UtilityBodyWeight = Extract<
  FontWeight,
  'regular' | 'italic' | 'medium' | 'semibold' | 'bold'
>;

export type UtilityBodySize = Size;

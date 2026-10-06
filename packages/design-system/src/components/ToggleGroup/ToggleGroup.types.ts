import type { ReactNode } from 'react';
import type { BaseProps } from '@/types/globalTypes';

export const TOGGLE_GROUP_COLORS = ['brand', 'neutral'] as const;
export type ToggleGroupColor = (typeof TOGGLE_GROUP_COLORS)[number];
export const TOGGLE_GROUP_VARIANTS = ['segmented'] as const;
export type ToggleGroupVariant = (typeof TOGGLE_GROUP_VARIANTS)[number];
export const TOGGLE_GROUP_TYPES = ['single', 'multiple'] as const;
export type ToggleGroupType = (typeof TOGGLE_GROUP_TYPES)[number];

interface ToggleGroupBaseProps extends BaseProps {
  /** `ToggleGroup.Item` children. */
  children: ReactNode;
  /**
   * Accessible name for the group. It isn't shown, so use `aria-labelledby` instead when a
   * visible heading already labels the group.
   */
  label?: string;
  /** Id of a visible element that labels the group. Takes precedence over `label`. */
  'aria-labelledby'?: string;
  /**
   * Shared input `name`, so the selection is submitted with a surrounding form.
   * @default a generated id
   */
  name?: string;
  /**
   * Fill of the selected items. Matches the `filled` Button of the same color.
   * @default 'brand'
   */
  color?: ToggleGroupColor;
  /**
   * Visual style. Only `segmented` exists today: items joined in one bordered container.
   * @default 'segmented'
   */
  variant?: ToggleGroupVariant;
  /** Stretch to the container width, splitting it evenly between items. */
  fullWidth?: boolean;
  /** Disables every item in the group. */
  disabled?: boolean;
}

export interface ToggleGroupSingleProps<T extends string = string> extends ToggleGroupBaseProps {
  /**
   * `single` (the default) keeps exactly one item selected and behaves as a radio group.
   * `multiple` lets any number of items be selected and behaves as a group of checkboxes.
   */
  type?: 'single';
  /** Value of the selected item. */
  value: T;
  onChange: (value: T) => void;
}

export interface ToggleGroupMultipleProps<T extends string = string> extends ToggleGroupBaseProps {
  type: 'multiple';
  /** Values of the selected items. */
  value: T[];
  onChange: (value: T[]) => void;
}

export type ToggleGroupProps<T extends string = string> =
  | ToggleGroupSingleProps<T>
  | ToggleGroupMultipleProps<T>;

export interface ToggleGroupItemProps extends BaseProps {
  /** Value reported to the group's `onChange`. Unique within the group. */
  value: string;
  /**
   * Item content: text, an icon from `@/icons`, or a mix, such as an icon plus a label or a label
   * plus secondary fine print. Icons take the item's text color. Text becomes the item's accessible
   * name; secondary content can use the `--toggle-group-item-secondary-text` color, which follows
   * the selected state.
   */
  children: ReactNode;
  /**
   * Accessible name. Required when the content is only an icon (e.g. "List view"); an item with a
   * single icon child and `aria-label` is laid out square.
   */
  'aria-label'?: string;
  /** Disables this item only. */
  disabled?: boolean;
}

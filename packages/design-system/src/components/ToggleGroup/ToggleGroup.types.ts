import type { ReactNode } from 'react';
import type { BaseProps } from '@/types/globalTypes';

export const TOGGLE_GROUP_TYPES = ['single', 'multiple'] as const;
export type ToggleGroupType = (typeof TOGGLE_GROUP_TYPES)[number];
export const TOGGLE_GROUP_SIZES = ['small', 'medium', 'large'] as const;
export type ToggleGroupSize = (typeof TOGGLE_GROUP_SIZES)[number];

interface ToggleGroupBaseProps extends BaseProps {
  /** `ToggleGroup.Item` children. */
  children: ReactNode;
  /**
   * Shared input `name`, so the selection is submitted with a surrounding form.
   * @default a generated id
   */
  name?: string;
  /**
   * Item height and padding, matching `Button` sizes: `small` 32px, `medium` 40px, `large` 52px.
   * @default 'medium'
   */
  size?: ToggleGroupSize;
  /** Stretch to the container width, splitting it evenly between items. */
  fullWidth?: boolean;
  /** Disables every item in the group. */
  disabled?: boolean;
}

/** Every group needs an accessible name: `label`, `aria-labelledby`, or both. */
type ToggleGroupLabelProps =
  | {
      /**
       * Accessible name for the group. It isn't shown, so use `aria-labelledby` instead when a
       * visible heading already labels the group.
       */
      label: string;
      /** Id of a visible element that labels the group. Takes precedence over `label`. */
      'aria-labelledby'?: string;
    }
  | {
      label?: string;
      'aria-labelledby': string;
    };

interface ToggleGroupSingleOwnProps<T extends string> extends ToggleGroupBaseProps {
  /**
   * `single` (the default) keeps exactly one item selected and behaves as a radio group.
   * `multiple` lets any number of items be selected and behaves as a group of checkboxes.
   */
  type?: 'single';
  /** Value of the selected item. */
  value: T;
  onChange: (value: T) => void;
}

interface ToggleGroupMultipleOwnProps<T extends string> extends ToggleGroupBaseProps {
  type: 'multiple';
  /** Values of the selected items. */
  value: T[];
  onChange: (value: T[]) => void;
}

export type ToggleGroupSingleProps<T extends string = string> = ToggleGroupSingleOwnProps<T> &
  ToggleGroupLabelProps;

export type ToggleGroupMultipleProps<T extends string = string> = ToggleGroupMultipleOwnProps<T> &
  ToggleGroupLabelProps;

export type ToggleGroupProps<T extends string = string> =
  | ToggleGroupSingleProps<T>
  | ToggleGroupMultipleProps<T>;

export interface ToggleGroupItemProps extends BaseProps {
  /** Value reported to the group's `onChange`. Unique within the group. */
  value: string;
  /**
   * Item content: text, an icon from `@/icons`, or a mix, such as an icon plus a label, or a label
   * plus `ToggleGroup.Detail`. Icons take the item's text color. Text becomes the item's accessible
   * name.
   */
  children: ReactNode;
  /**
   * Accessible name. Required when the content is only an icon (e.g. "List view").
   */
  'aria-label'?: string;
  /** Disables this item only. */
  disabled?: boolean;
}

export interface ToggleGroupDetailProps extends BaseProps {
  /** Secondary text shown beside an item's label, such as a result count. */
  children: ReactNode;
}

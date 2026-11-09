import type React from 'react';
import type { SelectOption, SelectProps } from '../Select/Select.types';

export const AUTOCOMPLETE_LOADING_VARIANTS = ['text', 'icon-text'] as const;
export type AutocompleteLoadingVariant = (typeof AUTOCOMPLETE_LOADING_VARIANTS)[number];
export const AUTOCOMPLETE_SIZES = [
  'small',
  'medium',
  'large',
] as const satisfies readonly NonNullable<SelectProps['size']>[];

export type AutocompleteOption = SelectOption;
export type AutocompleteOptionProps = React.HTMLAttributes<HTMLLIElement> & {
  key: React.Key;
};

interface AutocompleteBaseProps<T extends AutocompleteOption>
  extends Omit<SelectProps, 'options' | 'onChange' | 'showPlaceholder' | 'value'> {
  options: T[];
  /** Search text is independent of the selected value. */
  inputValue?: string;
  onInputChange?: (value: string) => void;
  /** Disable local filtering when options are already filtered by a server. */
  filterOptions?: boolean;
  loading?: boolean;
  /** Accessible loading announcement; skeletons provide the visible loading state. */
  loadingText?: string;
  /** Match loading rows to plain options or options with a leading icon/logo. */
  loadingVariant?: AutocompleteLoadingVariant;
  noOptionsText?: string;
  /** Spread the supplied props on the option's li to preserve interaction and accessibility. */
  renderOption?: (props: AutocompleteOptionProps, option: T) => React.ReactNode;
}

export type AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> =
  AutocompleteBaseProps<T> &
    (
      | { multiple?: false; value?: string; onChange?: (value: string | undefined) => void }
      | { multiple: true; value?: string[]; onChange?: (value: string[]) => void }
    );

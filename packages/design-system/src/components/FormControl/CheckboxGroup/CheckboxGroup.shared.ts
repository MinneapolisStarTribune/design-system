import type { CheckboxCategory } from './CheckboxGroup.types';

export type CheckboxCategoryState = 'checked' | 'unchecked' | 'indeterminate';

export function getCategoryState(
  category: CheckboxCategory,
  selectedValues: string[]
): CheckboxCategoryState {
  const categoryValues = category.options.map((option) => option.value);
  const selectedInCategory = categoryValues.filter((value) => selectedValues.includes(value));
  const selectedCount = selectedInCategory.length;

  if (selectedCount === 0) return 'unchecked';
  if (selectedCount === categoryValues.length) return 'checked';
  return 'indeterminate';
}

export function toggleOptionValue(
  currentValues: string[],
  optionValue: string,
  add: boolean
): string[] {
  if (add) {
    if (currentValues.includes(optionValue)) return currentValues;
    return [...currentValues, optionValue];
  }
  return currentValues.filter((value) => value !== optionValue);
}

export function toggleCategoryValues(
  currentValues: string[],
  category: CheckboxCategory
): string[] {
  const categoryValues = category.options.map((option) => option.value);
  const selectedInCategory = categoryValues.filter((value) => currentValues.includes(value));
  const allSelected = selectedInCategory.length === categoryValues.length;

  if (allSelected) {
    return currentValues.filter((value) => !categoryValues.includes(value));
  }

  const nextValues = new Set(currentValues);
  categoryValues.forEach((value) => nextValues.add(value));
  return [...nextValues];
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { CheckIcon, ChevronDownIcon } from '@/icons';
import styles from './MultiSelect.module.scss';
import type { MultiSelectOption, MultiSelectProps } from '../MultiSelect.types';

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id: idProp,
  options,
  value,
  onChange,
  placeholderText = 'Select options',
  size = 'medium',
  rounded = false,
  disabled = false,
  error,
  success,
  className,
  dataTestId,
  'aria-label': ariaLabelProp,
  'aria-labelledby': ariaLabelledByProp,
  'aria-describedby': ariaDescribedByProp,
}) => {
  const formGroup = useFormGroupContext();
  const generatedId = React.useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string[]>(value ?? []);

  const safeOptions = useMemo(() => (Array.isArray(options) ? options : []), [options]);
  const isControlled = value !== undefined && typeof onChange === 'function';

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedValues = useMemo(
    () => (isControlled ? (value ?? []) : internalValue),
    [isControlled, value, internalValue]
  );
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const hasError = error ?? formGroup?.hasError ?? false;
  const hasSuccess = (success ?? formGroup?.hasSuccess ?? false) && !hasError;

  const inputId = idProp ?? formGroup?.inputId ?? `multi-select-${generatedId}`;
  const listboxId = `${inputId}-listbox`;

  const ariaLabelledBy = ariaLabelledByProp ?? formGroup?.labelId;

  const describedByFromGroup = formGroup
    ? [formGroup.descriptionId, formGroup.captionId].filter(Boolean).join(' ') || undefined
    : undefined;
  const ariaDescribedBy = ariaDescribedByProp ?? describedByFromGroup;

  const selectedLabels = safeOptions
    .filter((option) => selectedSet.has(option.value))
    .map((option) => option.label);

  const isFilled = selectedLabels.length > 0;
  const displayText = isFilled ? selectedLabels.join(', ') : placeholderText;

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const toggleOption = (option: MultiSelectOption) => {
    if (disabled || option.disabled) return;

    const nextValues = selectedSet.has(option.value)
      ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
      : [...selectedValues, option.value];

    if (!isControlled) {
      setInternalValue(nextValues);
    }

    onChange?.(nextValues);
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    option: MultiSelectOption
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOption(option);
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const sizeClassMap: Record<NonNullable<MultiSelectProps['size']>, string> = {
    small: styles['size-small'],
    medium: styles['size-medium'],
    large: styles['size-large'],
  };

  const containerClasses = classNames(
    styles['multi-select-container'],
    sizeClassMap[size],
    {
      [styles['is-rounded']]: rounded,
      [styles['is-disabled']]: disabled,
      [styles['is-error']]: hasError,
      [styles['is-success']]: hasSuccess,
      [styles['is-open']]: isOpen,
    },
    className
  );

  return (
    <div className={containerClasses} ref={rootRef} data-testid={dataTestId}>
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-invalid={hasError || undefined}
        aria-label={!ariaLabelledBy ? (ariaLabelProp ?? placeholderText) : undefined}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={toggleOpen}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        className={classNames(
          styles['multi-select-trigger'],
          {
            [styles['multi-select-placeholder']]: !isFilled,
          },
          {
            'typography-utility-text-regular-small': size === 'small',
            'typography-utility-text-regular-medium': size === 'medium',
            'typography-utility-text-regular-large': size === 'large',
          }
        )}
      >
        <span className={styles['multi-select-value']} title={displayText}>
          {displayText}
        </span>

        <span className={styles['multi-select-icon']} aria-hidden>
          <ChevronDownIcon
            size={size}
            color={disabled ? 'state-disabled-on-light' : 'on-light-primary'}
          />
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={styles['multi-select-dropdown']}
        >
          {safeOptions.map((option, index) => {
            const isSelected = selectedSet.has(option.value);

            return (
              <li
                id={`${inputId}-option-${index}`}
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                tabIndex={option.disabled ? -1 : 0}
                className={classNames(styles['multi-select-option'], {
                  [styles['multi-select-option-selected']]: isSelected,
                  [styles['multi-select-option-disabled']]: option.disabled,
                })}
                onClick={() => toggleOption(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
              >
                <span className={styles['multi-select-checkmark']} aria-hidden>
                  {isSelected ? (
                    <CheckIcon
                      size="small"
                      className={styles['multi-select-check-icon']}
                      aria-hidden
                    />
                  ) : null}
                </span>
                <span
                  className={classNames(styles['multi-select-option-label'], {
                    [styles['multi-select-option-label-selected']]: isSelected,
                  })}
                >
                  {option.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

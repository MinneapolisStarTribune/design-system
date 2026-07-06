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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [internalValue, setInternalValue] = useState<string[]>(value ?? []);

  const safeOptions = useMemo(() => (Array.isArray(options) ? options : []), [options]);
  const isControlled = value !== undefined && typeof onChange === 'function';

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    optionRefs.current = [];
  }, [safeOptions]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    const target = optionRefs.current[activeIndex];
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

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

  const getPreferredOpenIndex = () => {
    const selectedEnabledIndex = getFirstSelectedEnabledIndex();
    return selectedEnabledIndex >= 0 ? selectedEnabledIndex : getFirstEnabledIndex();
  };

  const toggleOpen = () => {
    if (disabled) return;

    if (isOpen) {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setIsOpen(true);
    setActiveIndex(getPreferredOpenIndex());
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

  const getNextEnabledIndex = (currentIndex: number, step: 1 | -1) => {
    let nextIndex = currentIndex;

    for (let i = 0; i < safeOptions.length; i += 1) {
      nextIndex += step;

      if (nextIndex < 0 || nextIndex >= safeOptions.length) {
        return currentIndex;
      }

      if (!safeOptions[nextIndex]?.disabled) {
        return nextIndex;
      }
    }

    return currentIndex;
  };

  const getFirstEnabledIndex = () => safeOptions.findIndex((option) => !option.disabled);

  const getFirstSelectedEnabledIndex = () =>
    safeOptions.findIndex((option) => selectedSet.has(option.value) && !option.disabled);

  const getLastEnabledIndex = () => {
    for (let i = safeOptions.length - 1; i >= 0; i -= 1) {
      if (!safeOptions[i]?.disabled) {
        return i;
      }
    }

    return -1;
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(getPreferredOpenIndex());
        return;
      }

      setActiveIndex((prev) => getNextEnabledIndex(prev, 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(getLastEnabledIndex());
        return;
      }

      setActiveIndex((prev) => getNextEnabledIndex(prev, -1));
      return;
    }

    if ((e.key === 'Enter' || e.key === ' ') && isOpen) {
      e.preventDefault();
      const activeOption = activeIndex >= 0 ? safeOptions[activeIndex] : undefined;
      if (activeOption) {
        toggleOption(activeOption);
      }
      return;
    }

    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const sizeClassMap: Record<NonNullable<MultiSelectProps['size']>, string> = {
    small: styles['size-small'],
    medium: styles['size-medium'],
    large: styles['size-large'],
  };

  const triggerTypographyClass = classNames({
    'typography-utility-text-regular-small': size === 'small',
    'typography-utility-text-regular-medium': size === 'medium',
    'typography-utility-text-regular-large': size === 'large',
  });

  const optionTypographyClass = classNames({
    'typography-utility-text-regular-small': size === 'small',
    'typography-utility-text-regular-medium': size === 'medium',
    'typography-utility-text-regular-large': size === 'large',
  });

  const placeholderTypographyClass = classNames({
    'typography-utility-text-italic-small': size === 'small',
    'typography-utility-text-italic-medium': size === 'medium',
    'typography-utility-text-italic-large': size === 'large',
  });

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
        id={inputId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
        }
        aria-invalid={hasError || undefined}
        aria-label={!ariaLabelledBy ? (ariaLabelProp ?? placeholderText) : undefined}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={toggleOpen}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        disabled={disabled}
        className={classNames(styles['multi-select-trigger'], triggerTypographyClass)}
      >
        <span
          className={classNames(
            styles['multi-select-value'],
            {
              [styles['multi-select-placeholder']]: !isFilled,
            },
            !isFilled && placeholderTypographyClass
          )}
          title={displayText}
        >
          {displayText}
        </span>

        <span
          className={classNames(styles['multi-select-icon'], {
            [styles['multi-select-icon-open']]: isOpen,
          })}
          aria-hidden
        >
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
            const isActive = index === activeIndex;

            return (
              <li
                id={`${inputId}-option-${index}`}
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                tabIndex={-1}
                className={classNames(styles['multi-select-option'], {
                  [styles['multi-select-option-selected']]: isSelected,
                  [styles['multi-select-option-active']]: isActive,
                  [styles['multi-select-option-disabled']]: option.disabled,
                })}
                onClick={() => toggleOption(option)}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setActiveIndex(index);
                  }
                }}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
              >
                <span className={styles['multi-select-checkmark']} aria-hidden>
                  {isSelected ? (
                    <CheckIcon
                      size="checkbox-default"
                      className={styles['multi-select-check-icon']}
                      aria-hidden
                    />
                  ) : null}
                </span>
                <span
                  className={classNames(
                    styles['multi-select-option-label'],
                    optionTypographyClass,
                    {
                      [styles['multi-select-option-label-selected']]: isSelected,
                    }
                  )}
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

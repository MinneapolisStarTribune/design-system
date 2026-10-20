'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { FloatingPortal, useDismiss, useInteractions, useMergeRefs } from '@floating-ui/react';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { useAnchoredFloating } from '@/components/Popover/useAnchoredFloating';
import styles from './Select.module.scss';
import type { SelectOption, SelectProps } from '../Select.types';
import { ChevronDownIcon } from '@/icons';

const DROPDOWN_GAP = 8;

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholderText = 'Select an option',
  showPlaceholder = true,
  size = 'medium',
  rounded = false,
  isDisabled = false,
  isError,
  className,
  id: idProp,
  'aria-labelledby': ariaLabelledByProp,
  'aria-describedby': ariaDescribedByProp,
  dataTestId,
}) => {
  const safeOptions = React.useMemo(() => (Array.isArray(options) ? options : []), [options]);

  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (!nextOpen) setActiveIndex(-1);
  };

  // Portal the listbox so overflow on an ancestor, such as a scrollable table, cannot clip it.
  const {
    refs: { setReference, setFloating },
    elements,
    context,
    floatingStyles,
  } = useAnchoredFloating<HTMLDivElement>({
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement: 'bottom-start',
    gap: DROPDOWN_GAP,
    matchAnchorWidth: true,
  });
  // Closes on a press outside both the combobox and the portaled listbox, and on Escape.
  const { getReferenceProps, getFloatingProps } = useInteractions([useDismiss(context)]);
  const mergedRootRef = useMergeRefs([rootRef, setReference]);

  const formGroup = useFormGroupContext();

  const hasError = isError ?? formGroup?.hasError ?? false;

  const inputId = idProp ?? formGroup?.inputId;
  const ariaLabelledBy = ariaLabelledByProp ?? formGroup?.labelId;

  const describedBy = formGroup
    ? [formGroup.descriptionId, formGroup.captionId].filter(Boolean).join(' ') || undefined
    : undefined;

  const ariaDescribedBy = ariaDescribedByProp ?? describedBy;

  const selectedOption = value ? safeOptions.find((o) => o.value === value) : undefined;
  const selectedIndex = safeOptions.findIndex((o) => o.value === value);
  const firstOptionIndex = safeOptions.length > 0 ? 0 : -1;
  const initialActiveIndex = selectedIndex >= 0 ? selectedIndex : firstOptionIndex;

  const isFilled = !!selectedOption;
  const displayLabel = isFilled ? selectedOption?.label : placeholderText;

  const listboxId = `${inputId}-listbox`;

  const triggerTypographyClass = classNames({
    'typography-utility-text-regular-small': size === 'small',
    'typography-utility-text-regular-medium': size === 'medium',
    'typography-utility-text-regular-large': size === 'large',
  });

  const placeholderTypographyClass = classNames({
    'typography-utility-text-italic-small': size === 'small',
    'typography-utility-text-italic-medium': size === 'medium',
    'typography-utility-text-italic-large': size === 'large',
  });

  // The portal mounts the listbox after the open render, so wait for its element.
  useEffect(() => {
    if (isOpen && elements.floating && activeIndex >= 0) {
      const el = optionRefs.current[activeIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen, elements.floating]);

  useEffect(() => {
    optionRefs.current = [];
  }, [safeOptions]);

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled || elements.floating?.contains(e.target as Node)) return;

    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setActiveIndex(initialActiveIndex);
    }
  };

  const handleSelect = (option: SelectOption | undefined) => {
    if (!option || option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(initialActiveIndex);
        } else {
          setActiveIndex((prev) => (prev < safeOptions.length - 1 ? prev + 1 : prev));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(initialActiveIndex);
        } else {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : firstOptionIndex));
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(initialActiveIndex);
        } else if (activeIndex >= 0) {
          handleSelect(safeOptions[activeIndex]);
        }
        break;

      // Follows the APG select-only combobox: commit the active option, close, and let focus move on.
      case 'Tab':
        if (isOpen) handleSelect(safeOptions[activeIndex]);
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Options are not focusable, so a click on one blurs with a null relatedTarget and must not close the list.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const containerClasses = classNames(
    styles.selectContainer,
    styles[`size${size[0].toUpperCase()}${size.slice(1)}`],
    {
      [styles.isRounded]: rounded,
      [styles.isDisabled]: isDisabled,
      [styles.isError]: hasError,
      [styles.isOpen]: isOpen,
    },
    className
  );

  return (
    <div
      {...getReferenceProps({
        onClick: handleToggle,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
      })}
      ref={mergedRootRef}
      id={inputId}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-labelledby={ariaLabelledBy}
      aria-label={!ariaLabelledBy ? placeholderText : undefined}
      aria-controls={isOpen ? listboxId : undefined}
      aria-describedby={ariaDescribedBy}
      aria-activedescendant={activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined}
      aria-invalid={hasError || undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      className={containerClasses}
      data-testid={dataTestId}
    >
      {/* Not a button: a second focusable control makes screen readers announce the field twice. */}
      <div className={classNames(styles.selectTrigger, triggerTypographyClass)}>
        <span
          className={classNames(
            styles.selectValue,
            {
              [styles.selectPlaceholder]: !isFilled && showPlaceholder,
            },
            !isFilled && showPlaceholder && placeholderTypographyClass
          )}
        >
          {displayLabel}
        </span>

        <span
          className={classNames(styles.selectIcon, {
            [styles.selectIconOpen]: isOpen,
          })}
          aria-hidden
        >
          <ChevronDownIcon
            size={size}
            color={isDisabled ? 'state-disabled-on-light' : 'on-light-primary'}
          />
        </span>
      </div>

      {isOpen && (
        <FloatingPortal>
          <ul
            {...getFloatingProps({
              // Keep focus on the combobox, which is outside the portaled listbox in the DOM.
              onMouseDown: (e) => e.preventDefault(),
            })}
            ref={setFloating}
            id={listboxId}
            role="listbox"
            style={floatingStyles}
            className={classNames(styles.selectDropdown, 'typography-utility-text-regular-medium')}
          >
            {safeOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li
                  key={option.value}
                  id={`${inputId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  className={classNames(styles.selectOption, {
                    [styles.selectOptionSelected]: isSelected,
                    [styles.selectOptionDisabled]: option.disabled,
                    [styles.selectOptionActive]: isActive,
                  })}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </FloatingPortal>
      )}
    </div>
  );
};

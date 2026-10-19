'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size as floatingSize,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import styles from './Select.module.scss';
import type { SelectOption, SelectProps } from '../Select.types';
import { ChevronDownIcon } from '@/icons';

const DROPDOWN_GAP = 8;
const OVERFLOW_OPTIONS = { padding: DROPDOWN_GAP, altBoundary: true };

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
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const {
    refs: { setReference, setFloating },
    elements,
    floatingStyles,
    isPositioned,
  } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(DROPDOWN_GAP),
      flip(OVERFLOW_OPTIONS),
      shift(OVERFLOW_OPTIONS),
      floatingSize({
        ...OVERFLOW_OPTIONS,
        apply({ availableHeight, availableWidth, rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxWidth: `${Math.max(0, availableWidth)}px`,
          });
          elements.floating.style.setProperty(
            '--select-available-height',
            `${Math.max(0, availableHeight)}px`
          );
        },
      }),
    ],
  });
  const referenceRef = useMergeRefs([rootRef, setReference]);
  const floatingRef = useMergeRefs([listboxRef, setFloating]);
  // Preserve regional theme inheritance and keep native/custom dialogs interactive.
  const portalRoot = elements.domReference?.closest<HTMLElement>(
    'dialog, [role="dialog"], [role="alertdialog"], [data-theme]'
  );

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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (
        !rootRef.current.contains(event.target as Node) &&
        !listboxRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isPositioned || activeIndex < 0) return;
    const listbox = listboxRef.current;
    const option = optionRefs.current[activeIndex];
    if (!listbox || !option) return;

    // scrollIntoView also scrolls the table/page. Reveal options within this list only.
    const listTop = listbox.getBoundingClientRect().top + listbox.clientTop;
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listTop) {
      listbox.scrollTop += optionRect.top - listTop;
    } else if (optionRect.bottom > listTop + listbox.clientHeight) {
      listbox.scrollTop += optionRect.bottom - listTop - listbox.clientHeight;
    }
  }, [activeIndex, isOpen, isPositioned]);

  useEffect(() => {
    optionRefs.current = [];
  }, [safeOptions]);

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled || listboxRef.current?.contains(e.target as Node)) return;

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

      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
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
      ref={referenceRef}
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
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
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
        <FloatingPortal
          root={portalRoot?.tagName === 'HTML' ? undefined : (portalRoot ?? undefined)}
        >
          <ul
            ref={floatingRef}
            id={listboxId}
            role="listbox"
            style={{ ...floatingStyles, visibility: isPositioned ? undefined : 'hidden' }}
            onMouseDown={(event) => event.preventDefault()}
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

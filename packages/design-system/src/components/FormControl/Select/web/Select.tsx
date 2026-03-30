import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import styles from './Select.module.scss';
import { SelectProps, SelectOption } from './Select.types';
import { ChevronDownIcon } from '@/icons';

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

  const isFilled = !!selectedOption;
  const displayLabel = isFilled ? selectedOption?.label : placeholderText;

  const listboxId = `${inputId}-listbox`;

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex >= 0) {
      const el = optionRefs.current[activeIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    optionRefs.current = [];
  }, [safeOptions]);

  const handleToggle = () => {
    if (isDisabled) return;

    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
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
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setActiveIndex((prev) => (prev < safeOptions.length - 1 ? prev + 1 : prev));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (activeIndex >= 0) {
          handleSelect(safeOptions[activeIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
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
      [styles.isFilled]: isFilled,
    },
    className
  );

  return (
    <div
      ref={rootRef}
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
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={containerClasses}
      data-testid={dataTestId}
    >
      <button
        type="button"
        aria-label={placeholderText}
        className={classNames(styles.selectTrigger, triggerTypographyClass)}
        onClick={handleToggle}
        disabled={isDisabled}
      >
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

        <span className={styles.selectIcon} aria-hidden>
          <ChevronDownIcon
            size={size}
            color={isDisabled ? 'state-disabled-on-light' : 'on-light-primary'}
          />
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className={classNames(styles.selectDropdown, optionTypographyClass)}
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
      )}
    </div>
  );
};

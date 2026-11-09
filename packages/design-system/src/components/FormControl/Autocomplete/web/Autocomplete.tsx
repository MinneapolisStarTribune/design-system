'use client';

import { useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
import { FloatingPortal, useDismiss, useInteractions, useMergeRefs } from '@floating-ui/react';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { getScopedPortalRoot } from '@/components/FloatingSurface/getScopedPortalRoot';
import { useAnchoredFloating } from '@/components/FloatingSurface/useAnchoredFloating';
import { CheckIcon, ChevronDownIcon } from '@/icons';
import selectStyles from '../../Select/web/Select.module.scss';
import styles from './Autocomplete.module.scss';
import { Skeleton } from '@/components/Skeleton/web/Skeleton';
import multiStyles from '../../MultiSelect/web/MultiSelect.module.scss';
import type {
  AutocompleteOption,
  AutocompleteOptionProps,
  AutocompleteProps,
} from '../Autocomplete.types';

export function Autocomplete<T extends AutocompleteOption>(selection: AutocompleteProps<T>) {
  const {
    options,
    value,
    multiple,
    inputValue,
    onInputChange,
    filterOptions = true,
    loading = false,
    loadingText = 'Loading…',
    loadingVariant = 'text',
    noOptionsText = 'No options found',
    renderOption,
    placeholderText = 'Select an option',
    size = 'medium',
    rounded = false,
    isDisabled = false,
    isError,
    id,
    className,
    dataTestId,
    icon,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
  } = selection;
  const generatedId = useId();
  const formGroup = useFormGroupContext();
  const inputId = id ?? formGroup?.inputId ?? generatedId;
  const listId = `${inputId}-listbox`;
  const labelId = labelledBy ?? formGroup?.labelId;
  const descriptionId =
    describedBy ??
    ([formGroup?.descriptionId, formGroup?.captionId].filter(Boolean).join(' ') || undefined);
  const hasError = isError ?? formGroup?.hasError;
  const selectedValues = Array.isArray(value) ? value : value === undefined ? [] : [value];
  const isSelected = (option: T) => selectedValues.includes(option.value);
  const selectedLabel = options
    .filter(isSelected)
    .map((option) => option.label)
    .join(', ');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [activeValue, setActiveValue] = useState<string>();
  const text =
    multiple && !editing ? selectedLabel : (inputValue ?? (editing ? query : selectedLabel));
  const visible =
    filterOptions && editing
      ? options.filter((option) =>
          option.label.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        )
      : options;
  const activeIndex = visible.findIndex(
    (option) => option.value === activeValue && !option.disabled
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const close = () => {
    setOpen(false);
    setActiveValue(undefined);
    if (multiple) {
      setEditing(false);
      setQuery('');
      onInputChange?.('');
    }
  };
  const openList = () => {
    if (multiple && !open) {
      setEditing(true);
      setQuery('');
      onInputChange?.('');
    }
    setOpen(true);
  };
  const {
    refs: { setReference, setFloating },
    elements,
    context,
    floatingStyles,
    isPositioned,
  } = useAnchoredFloating<HTMLDivElement>({
    open: open && !isDisabled,
    onOpenChange: (next) => {
      if (next) openList();
      else close();
    },
    placement: 'bottom-start',
    gap: 8,
    matchAnchorWidth: true,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([useDismiss(context)]);
  const mergedListRef = useMergeRefs([listRef, setFloating]);

  useEffect(() => {
    const list = listRef.current;
    const option = list?.querySelectorAll('[role="option"]')[activeIndex];
    if (!open || !isPositioned || !list || !option) return;
    const top = list.getBoundingClientRect().top + list.clientTop;
    const rect = option.getBoundingClientRect();
    if (rect.top < top) list.scrollTop += rect.top - top;
    else if (rect.bottom > top + list.clientHeight)
      list.scrollTop += rect.bottom - top - list.clientHeight;
  }, [activeIndex, open, isPositioned]);

  const choose = (option: T) => {
    if (option.disabled) return;
    if (selection.multiple) {
      selection.onChange?.(
        isSelected(option)
          ? selectedValues.filter((item) => item !== option.value)
          : [...selectedValues, option.value]
      );
      return;
    }
    selection.onChange?.(option.value);
    onInputChange?.(option.label);
    setEditing(false);
    close();
  };
  const navigate = (direction: number) => {
    const navigationOptions = multiple && !open ? options : visible;
    const start = open ? activeIndex : -1;
    let index = start < 0 ? (direction > 0 ? 0 : navigationOptions.length - 1) : start + direction;
    while (index >= 0 && index < navigationOptions.length) {
      if (!navigationOptions[index].disabled) {
        setActiveValue(navigationOptions[index].value);
        break;
      }
      index += direction;
    }
    openList();
  };
  return (
    <div
      {...getReferenceProps()}
      ref={setReference}
      className={classNames(
        selectStyles.selectContainer,
        selectStyles[`size${size[0].toUpperCase()}${size.slice(1)}`],
        {
          [selectStyles.isRounded]: rounded,
          [selectStyles.isDisabled]: isDisabled,
          [selectStyles.isError]: hasError,
          [styles.error]: hasError,
          [selectStyles.isOpen]: open && !isDisabled,
        },
        className
      )}
      data-testid={dataTestId}
    >
      <div className={selectStyles.selectTrigger}>
        {icon && (
          <span className={selectStyles.selectStartIcon} aria-hidden>
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          autoComplete="off"
          className={classNames(styles.input, `typography-utility-text-regular-${size}`)}
          value={text}
          placeholder={placeholderText}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-label={labelId ? undefined : placeholderText}
          aria-describedby={descriptionId}
          aria-invalid={hasError || undefined}
          aria-autocomplete="list"
          aria-expanded={open && !isDisabled}
          aria-controls={open && !isDisabled ? listId : undefined}
          aria-activedescendant={
            open && !isDisabled && activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
          }
          onClick={openList}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setEditing(true);
            setOpen(true);
            setActiveValue(undefined);
            onInputChange?.(next);
            if (!next && !selection.multiple) selection.onChange?.(undefined);
          }}
          onBlur={() => {
            close();
            setEditing(false);
            if (!multiple) onInputChange?.(selectedLabel);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              navigate(event.key === 'ArrowDown' ? 1 : -1);
            } else if (event.key === 'Enter' && open && activeIndex >= 0) {
              event.preventDefault();
              choose(visible[activeIndex]);
            } else if (event.key === 'Escape') {
              close();
              setEditing(false);
              if (!multiple) onInputChange?.(selectedLabel);
            } else if (event.key === 'Tab') close();
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={isDisabled}
          aria-label={open ? 'Close options' : 'Open options'}
          className={styles.toggle}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            inputRef.current?.focus();
            if (open) close();
            else openList();
            setActiveValue(undefined);
          }}
        >
          <span
            className={classNames(selectStyles.selectIcon, { [selectStyles.selectIconOpen]: open })}
            aria-hidden
          >
            <ChevronDownIcon
              size={size}
              color={isDisabled ? 'state-disabled-on-light' : 'on-light-primary'}
            />
          </span>
        </button>
      </div>
      {open && !isDisabled && (
        <FloatingPortal root={getScopedPortalRoot(elements.domReference)}>
          <div
            ref={mergedListRef}
            style={{ ...floatingStyles, visibility: isPositioned ? undefined : 'hidden' }}
            className={classNames(
              selectStyles.selectDropdown,
              'typography-utility-text-regular-medium'
            )}
            {...getFloatingProps({ onMouseDown: (event) => event.preventDefault() })}
          >
            <ul
              id={listId}
              role="listbox"
              aria-label={labelId ? undefined : placeholderText}
              aria-labelledby={labelId}
              aria-busy={loading}
              aria-multiselectable={multiple || undefined}
              className={styles.list}
            >
              {visible.map((option, index) => {
                const props: AutocompleteOptionProps = {
                  key: option.value,
                  id: `${inputId}-option-${index}`,
                  role: 'option',
                  'aria-selected': isSelected(option),
                  'aria-disabled': option.disabled || undefined,
                  className: classNames(selectStyles.selectOption, styles.option, {
                    [styles.checkboxOption]: multiple,
                    [selectStyles.selectOptionSelected]: isSelected(option),
                    [multiStyles['multi-select-option-selected']]: multiple && isSelected(option),
                    [multiStyles['multi-select-option-active']]: multiple && index === activeIndex,
                    [selectStyles.selectOptionDisabled]: option.disabled,
                    [selectStyles.selectOptionActive]: index === activeIndex,
                  }),
                  onClick: () => choose(option),
                  onMouseEnter: () => setActiveValue(option.disabled ? undefined : option.value),
                };
                if (renderOption) return renderOption(props, option);
                const { key, ...rest } = props;
                return (
                  <li key={key} {...rest}>
                    {multiple && (
                      <span className={multiStyles['multi-select-checkmark']} aria-hidden>
                        {isSelected(option) && (
                          <CheckIcon
                            size="checkbox-default"
                            className={multiStyles['multi-select-check-icon']}
                          />
                        )}
                      </span>
                    )}
                    {option.label}
                  </li>
                );
              })}
            </ul>
            {loading && (
              <>
                <div aria-hidden="true">
                  {[80, 58, 90, 75, 80].map((width, index) => (
                    <div key={index} className={styles.skeletonRow}>
                      {loadingVariant === 'icon-text' && (
                        <Skeleton variant="circle" width={32} animate={false} />
                      )}
                      <div className={styles.skeletonText}>
                        <Skeleton
                          width={`${width}%`}
                          height={loadingVariant === 'icon-text' ? 32 : 20}
                          animate={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div role="status" className={styles.loadingAnnouncement}>
                  {loadingText}
                </div>
              </>
            )}
            {!loading && visible.length === 0 && (
              <div role="status" className={styles.status}>
                {noOptionsText}
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

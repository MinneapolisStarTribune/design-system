'use client';

import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './ToggleGroup.module.scss';
import type { ToggleGroupItemProps } from './ToggleGroup.types';
import { useToggleGroupContext } from './ToggleGroupContext';
import { createDesignSystemError } from '@/utils/errorPrefix';

/**
 * One option in a `ToggleGroup.Root`. Renders a native radio (`single`) or checkbox (`multiple`)
 * under a styled label, so keyboard, form and screen reader behavior come from the browser.
 */
export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  children,
  disabled: disabledProp = false,
  'aria-label': ariaLabel,
  className,
  style,
  dataTestId,
}) => {
  const group = useToggleGroupContext();
  const contentRef = useRef<HTMLSpanElement>(null);
  const selected = group.isSelected(value);
  const disabled = group.disabled || disabledProp;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (ariaLabel || contentRef.current?.textContent?.trim()) return;

    console.warn(
      createDesignSystemError(
        'ToggleGroup',
        `Item "${value}" has no text. Add an \`aria-label\` so icon-only items have an accessible name.`
      )
    );
  }, [ariaLabel, value]);

  return (
    <label
      className={classNames(
        styles.item,
        { [styles.selected]: selected, [styles.disabled]: disabled },
        className
      )}
      style={style}
      data-testid={dataTestId ?? `${group.dataTestId}-item-${value}`}
    >
      <input
        type={group.type === 'multiple' ? 'checkbox' : 'radio'}
        name={group.name}
        value={value}
        checked={selected}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => group.onItemChange(value, event.target.checked)}
        className={styles.input}
      />
      <span
        ref={contentRef}
        className={classNames(styles.content, 'typography-utility-text-medium-medium')}
      >
        {children}
      </span>
    </label>
  );
};

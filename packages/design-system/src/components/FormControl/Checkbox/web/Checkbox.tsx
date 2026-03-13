import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { Icon } from '@/components/Icon/Icon';
import {
  CheckIcon,
  CheckboxInactiveIcon,
  MinusIcon,
} from '@/icons';
import { useId } from 'react';
import styles from './Checkbox.module.scss';

const CHECKBOX_ICONS = {
  check: CheckIcon,
  minus: MinusIcon,
  'checkbox-inactive': CheckboxInactiveIcon,
} as const;

export const CHECKBOX_VARIANTS = ['neutral', 'brand'] as const;
export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];

export const CHECKBOX_SIZES = ['default', 'small'] as const;
export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

export interface CheckboxProps extends BaseProps {
  /** Required label text for the checkbox */
  label: string;
  /** Controlled checked state */
  checked: boolean;
  /**
   * Indeterminate state - a visual state indicating mixed selection.
   * Must be set programmatically; user interaction transitions to checked or unchecked.
   */
  indeterminate?: boolean;
  /** Color variant. Neutral is default; brand is for specific uses within a brand. */
  variant?: CheckboxVariant;
  /** Optional caption text below the label */
  caption?: string;
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Disabled state */
  disabled?: boolean;
  /** Error state - shows error styling and communicates to assistive technologies */
  error?: boolean;
  /** When true, checkbox can receive focus. When false, cannot be focused (e.g. tabIndex=-1). */
  focus?: boolean;
  /** Callback when checked state changes */
  onChange: (checked: boolean) => void;
}

/**
 * Checkbox component for selecting or deselecting an option.
 * Supports unchecked, checked, and indeterminate states with neutral and brand variants.
 * Indeterminate must be set programmatically; clicking transitions to checked or unchecked.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  indeterminate = false,
  variant = 'neutral',
  caption,
  size = 'default',
  disabled = false,
  error = false,
  focus = true,
  onChange,
  className,
  dataTestId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  // Indeterminate is a DOM property, not an HTML attribute - must be set programmatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!focus) {
      // Defer blur so click's change event can fire first (checkbox still toggles)
      setTimeout(() => e.target.blur(), 0);
    }
  };

  const iconKey = indeterminate ? 'minus' : checked ? 'check' : 'checkbox-inactive';
  const IconComponent = CHECKBOX_ICONS[iconKey];

  const rootClasses = classNames(
    styles.root,
    styles[variant],
    styles[`size-${size}`],
    {
      [styles.checked]: checked && !indeterminate,
      [styles.indeterminate]: indeterminate,
      [styles.disabled]: disabled,
      [styles.error]: error,
    },
    className
  );

  return (
    <label className={rootClasses} htmlFor={id} data-testid={dataTestId}>
      <span className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          tabIndex={focus ? undefined : -1}
          onFocus={handleFocus}
          onChange={handleChange}
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={caption ? `${id}-caption` : undefined}
          className={styles.input}
        />
        <span className={styles.visualBox} aria-hidden="true">
          <Icon
            component={IconComponent}
            size={size === 'small' ? 'small' : 'medium'}
            className={styles.icon}
            aria-hidden
          />
        </span>
      </span>
      <span className={styles.content}>
        <span
          className={classNames(
            styles.label,
            size === 'default'
              ? 'typography-utility-label-regular-medium'
              : 'typography-utility-label-regular-small'
          )}
        >
          {label}
        </span>
        {caption && (
          <span
            id={`${id}-caption`}
            className={classNames(styles.caption, 'typography-utility-text-regular-x-small')}
          >
            {caption}
          </span>
        )}
      </span>
    </label>
  );
};

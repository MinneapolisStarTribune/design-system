'use client';

import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Icon } from '@/components/Icon/Icon';
import type { IconComponent as IconComponentType } from '@/components/Icon/Icon.types';
import { UtilityLabel } from '@/components/Typography/Utility';
import { CheckIcon, CheckboxInactiveIcon, MinusIcon } from '@/icons';
import { useId } from 'react';
import styles from './Checkbox.module.scss';
import type { CheckboxProps } from '../Checkbox.types';

const CHECKBOX_ICONS = {
  check: CheckIcon,
  minus: MinusIcon,
  'checkbox-inactive': CheckboxInactiveIcon,
} as const;

export type { CheckboxProps, CheckboxVariant, CheckboxSize } from '../Checkbox.types';
export { CHECKBOX_SIZES, CHECKBOX_VARIANTS } from '../Checkbox.types';

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
  analytics: analyticsOverride,
  className,
  dataTestId,
}) => {
  const { track } = useAnalytics();
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  // Indeterminate is a DOM property, not an HTML attribute - must be set programmatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    track({
      event: 'checkbox_change',
      component: 'Checkbox',
      label,
      checked: newChecked,
      variant,
      ...analyticsOverride,
    });
    onChange(newChecked);
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
            component={IconComponent as IconComponentType}
            size={size === 'small' ? 'checkbox-small' : 'checkbox-default'}
            className={styles.icon}
            style={{ color: 'var(--checkbox-icon-color)' }}
            aria-hidden
          />
        </span>
      </span>
      <span className={styles.content}>
        <UtilityLabel
          size={size === 'default' ? 'large' : 'medium'}
          weight="regular"
          className={styles.label}
        >
          {label}
        </UtilityLabel>
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

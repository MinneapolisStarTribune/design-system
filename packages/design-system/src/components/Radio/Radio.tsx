'use client';

import React from 'react';
import classNames from 'classnames';
import { useId } from 'react';
import { BaseProps } from '@/types/globalTypes';
import styles from './radio.module.scss';

export const RADIO_COLORS = ['neutral', 'brand'] as const;
export type RadioColor = (typeof RADIO_COLORS)[number];

export interface RadioProps extends BaseProps {
  /** Required title text for the radio */
  title: string;
  /** Optional description text below the title */
  description?: string;
  /** Controlled checked state */
  checked: boolean;
  /** Color variant. Neutral is default. */
  color?: RadioColor;
  /** Disabled state */
  disabled?: boolean;
  /** Error state - shows error styling and communicates to assistive technologies */
  error?: boolean;
  /** Callback when checked state changes */
  onChange: (checked: boolean) => void;
}

/**
 * Radio component for selecting a single option in a set.
 * This component is controlled and does not own form state.
 */
export const Radio: React.FC<RadioProps> = ({
  title,
  description,
  checked,
  color = 'neutral',
  disabled = false,
  error = false,
  onChange,
  className,
  dataTestId,
}) => {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const rootClasses = classNames(
    styles.root,
    styles[color],
    {
      [styles.checked]: checked,
      [styles.disabled]: disabled,
      [styles.error]: error,
    },
    className
  );

  return (
    <label className={rootClasses} htmlFor={id} data-testid={dataTestId}>
      <span className={styles.titleRow}>
        <span className={styles.inputWrapper}>
          <input
            type="radio"
            id={id}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={description ? `${id}-description` : undefined}
            className={styles.input}
          />
          <span className={styles.visualDot} aria-hidden="true" />
        </span>
        <span className={classNames(styles.title, 'typography-utility-text-regular-medium')}>
          {title}
        </span>
      </span>
      {description ? (
        <span
          id={`${id}-description`}
          className={classNames(styles.description, 'typography-utility-text-regular-x-small')}
        >
          {description}
        </span>
      ) : null}
    </label>
  );
};

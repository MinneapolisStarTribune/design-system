'use client';

import React from 'react';
import classNames from 'classnames';
import { useId } from 'react';
import { BaseProps } from '@/types/globalTypes';
import styles from './Radio.module.scss';

export const RADIO_COLORS = ['neutral', 'brand'] as const;
export type RadioColor = (typeof RADIO_COLORS)[number];

export interface RadioProps extends BaseProps {
  title: string;
  description?: string;
  checked: boolean;
  color?: RadioColor;
  disabled?: boolean;
  error?: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Radio component for selecting a single option in a set.
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
      <span className={styles.content}>
        <span className={styles.visualDot} aria-hidden="true" />
        <span className={classNames(styles.title, 'typography-utility-text-regular-medium')}>
          {title}
        </span>
        {description ? (
          <span
            id={`${id}-description`}
            className={classNames(styles.description, 'typography-utility-text-regular-x-small')}
          >
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
};

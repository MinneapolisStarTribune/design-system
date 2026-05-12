'use client';

import React, { useRef } from 'react';
import classNames from 'classnames';
import { TextInput } from '@/components/FormControl/TextInput/web/TextInput';
import type { NumberInputProps } from '../NumberInput.types';
import styles from './NumberInput.module.scss';
import { ChevronDownIcon, ChevronUpIcon } from '@/icons';

export type { NumberInputProps } from '../NumberInput.types';

export const NumberInput: React.FC<NumberInputProps> = ({
  placeholderText,
  className,
  size = 'medium',
  isDisabled = false,
  ...props
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const stepInput = (direction: 'up' | 'down') => {
    const input = rootRef.current?.querySelector('input[type="number"]');
    if (!(input instanceof HTMLInputElement) || input.disabled || input.readOnly) {
      return;
    }

    if (direction === 'up') {
      input.stepUp();
    } else {
      input.stepDown();
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <TextInput
        {...props}
        size={size}
        type="number"
        inputMode="numeric"
        isDisabled={isDisabled}
        placeholderText={placeholderText != null ? String(placeholderText) : undefined}
        className={classNames(styles['number-input'], styles[`number-input-${size}`], className)}
      />
      <div className={classNames(styles.controls, styles[`size-${size}`])} aria-hidden>
        <button
          type="button"
          className={classNames(styles['control-button'], styles['control-button-up'])}
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => stepInput('up')}
        >
          <span className={styles.chevron}>
            <ChevronUpIcon
              size="x-small"
              color={isDisabled ? 'state-disabled-on-light' : 'on-light-secondary'}
            />
          </span>
        </button>
        <button
          type="button"
          className={classNames(styles['control-button'], styles['control-button-down'])}
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => stepInput('down')}
        >
          <span className={styles.chevron}>
            <ChevronDownIcon
              size="x-small"
              color={isDisabled ? 'state-disabled-on-light' : 'on-light-secondary'}
            />
          </span>
        </button>
      </div>
    </div>
  );
};

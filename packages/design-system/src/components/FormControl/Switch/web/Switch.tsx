'use client';

import React, { useId } from 'react';
import classNames from 'classnames';
import { UtilityLabel } from '@/components/Typography/Utility';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import styles from './Switch.module.scss';
import type { BaseSwitchProps } from '../Switch.types';
import { CheckIcon } from '@/icons';
import { AccessibilityProps } from '@/types';

export type { SwitchColor, SwitchSize } from '../Switch.types';
export { SWITCH_COLORS, SWITCH_SIZES } from '../Switch.types';

export interface SwitchProps extends BaseSwitchProps, AccessibilityProps {
  /** Override computed aria-labelledby. */
  'aria-labelledby'?: string;
}

const LABEL_SIZE_BY_SWITCH_SIZE = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

const CHECK_ICON_SIZE_BY_SWITCH_SIZE = {
  small: 'x-small',
  medium: 'small',
  large: 'medium',
} as const;

export const Switch: React.FC<SwitchProps> = ({
  selected,
  onChange,
  label,
  labelPosition = 'start',
  caption,
  color = 'neutral',
  size = 'medium',
  isDisabled = false,
  className,
  dataTestId,
  id: idProp,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledByProp,
  'aria-describedby': ariaDescribedByProp,
}) => {
  const generatedId = useId();
  const formGroupContext = useFormGroupContext();

  const inputId = idProp ?? formGroupContext?.inputId ?? generatedId;
  const localLabelId = label ? `${inputId}-label` : undefined;
  const localCaptionId = caption ? `${inputId}-caption` : undefined;

  const ariaLabelledBy = ariaLabelledByProp ?? localLabelId ?? formGroupContext?.labelId;

  const contextDescribedBy = formGroupContext
    ? [formGroupContext.descriptionId, formGroupContext.captionId].filter(Boolean).join(' ') ||
      undefined
    : undefined;

  const composedDescribedBy =
    [localCaptionId, contextDescribedBy].filter(Boolean).join(' ') || undefined;

  const ariaDescribedBy = ariaDescribedByProp ?? composedDescribedBy;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label
      className={classNames(
        styles.root,
        styles[color],
        styles[`size-${size}`],
        {
          [styles.selected]: selected,
          [styles.disabled]: isDisabled,
        },
        className
      )}
      htmlFor={inputId}
      data-testid={dataTestId}
    >
      <span className={styles.control}>
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          name={name}
          checked={selected}
          disabled={isDisabled}
          onChange={handleChange}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={styles.input}
        />
        <span className={styles.track} aria-hidden="true">
          {selected && (
            <CheckIcon
              size={CHECK_ICON_SIZE_BY_SWITCH_SIZE[size]}
              color="on-dark-primary"
              className={styles['check-icon']}
              data-testid={dataTestId ? `${dataTestId}-check-icon` : undefined}
              aria-hidden
            />
          )}
          <span className={styles.thumb} />
        </span>
      </span>

      {(label || caption) && (
        <span
          className={classNames(styles.content, {
            [styles['label-start']]: labelPosition === 'start',
            [styles['label-end']]: labelPosition === 'end',
          })}
        >
          {label && (
            <UtilityLabel
              as="span"
              id={localLabelId}
              size={LABEL_SIZE_BY_SWITCH_SIZE[size]}
              weight="regular"
              className={styles.label}
            >
              {label}
            </UtilityLabel>
          )}
          {caption && (
            <span
              id={localCaptionId}
              className={classNames(styles.caption, 'typography-utility-text-regular-x-small')}
            >
              {caption}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

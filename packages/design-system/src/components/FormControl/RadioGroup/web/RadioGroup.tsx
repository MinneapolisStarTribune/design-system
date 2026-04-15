'use client';

import React from 'react';
import classNames from 'classnames';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { Radio, type RadioColor } from '@/components/Radio/Radio';
import { BaseProps } from '@/types/globalTypes';
import styles from './RadioGroup.module.scss';

export interface RadioOption {
  value: string;
  title: string;
  description?: string;
}

export interface RadioGroupProps extends BaseProps {
  name: string;
  value: string | null | undefined;
  options: RadioOption[];
  color?: RadioColor;
  disabled?: boolean;
  error?: boolean;
  onChange: (value: string) => void;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  options,
  color = 'neutral',
  disabled = false,
  error = false,
  onChange,
  className,
  dataTestId,
  'aria-labelledby': ariaLabelledByProp,
  'aria-describedby': ariaDescribedByProp,
}) => {
  const formGroupContext = useFormGroupContext();
  const hasError = error || formGroupContext?.hasError === true;

  const ariaLabelledBy = ariaLabelledByProp ?? formGroupContext?.labelId;
  const describedByFromContext =
    [formGroupContext?.descriptionId, formGroupContext?.captionId].filter(Boolean).join(' ') || undefined;
  const ariaDescribedBy = ariaDescribedByProp ?? describedByFromContext;

  return (
    <div
      role="radiogroup"
      className={classNames(styles.root, className)}
      data-testid={dataTestId}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={hasError ? true : undefined}
    >
      {options.map((option, index) => (
        <Radio
          key={option.value}
          id={index === 0 ? formGroupContext?.inputId : undefined}
          name={name}
          label={option.title}
          description={option.description}
          checked={value === option.value}
          color={color}
          disabled={disabled}
          error={hasError}
          onChange={(checked) => {
            if (checked && value !== option.value) {
              onChange(option.value);
            }
          }}
          dataTestId={`${dataTestId ?? 'radio-group'}-option-${option.value}`}
        />
      ))}
    </div>
  );
};

import React from 'react';
import classNames from 'classnames';
import { FormControlProps } from '../FormControl';
import { AccessibilityProps, Size } from '../../../types/globalTypes';
import { Icon } from '../../Icon/Icon';
import { IconName } from '../../Icon/iconNames';
import { useFormGroupContext } from '../../FormGroup/FormGroupContext';

export type TextInputSize = Extract<Size, 'small' | 'medium' | 'large'>;

export interface TextInputProps
  extends FormControlProps,
    AccessibilityProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'disabled' | 'className' | 'aria-label' | 'aria-describedby' | 'aria-hidden'
    > {
  size?: TextInputSize;
  placeholderText?: string;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  rounded?: boolean;
  isDisabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  size = 'medium',
  placeholderText,
  icon,
  iconPosition = 'end',
  rounded = false,
  isDisabled = false,
  className,
  dataTestId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedByProp,
  'aria-labelledby': ariaLabelledByProp,
  value,
  onChange,
  ...props
}) => {
  const formGroupContext = useFormGroupContext();

  // Use context values if available, otherwise use props
  const ariaLabelledBy = ariaLabelledByProp ?? formGroupContext?.labelId;
  const describedBy = formGroupContext
    ? [formGroupContext.descriptionId, formGroupContext.captionId].filter(Boolean).join(' ') ||
      undefined
    : undefined;
  const ariaDescribedBy = ariaDescribedByProp ?? describedBy;
  // Icon is always decorative (aria-hidden) when using the simple icon prop
  // By not passing a color prop, Icon component will use 'currentColor' which inherits the input's text color
  const iconElement = icon ? <Icon name={icon} size={size} aria-hidden={true} /> : null;

  // Use conditional variables for icon positioning (similar to Button's leftSection/rightSection pattern)
  const leftIcon = icon && iconPosition === 'start' ? iconElement : undefined;
  const rightIcon = icon && iconPosition === 'end' ? iconElement : undefined;

  const inputClasses = classNames(
    'text-input',
    `text-input-${size}`,
    {
      disabled: isDisabled,
      rounded: rounded,
      size,
    },
    className
  );

  const wrapperClasses = classNames('text-input-wrapper', {
    disabled: isDisabled,
  });

  return (
    <div className={wrapperClasses}>
      {leftIcon && (
        <span className={classNames('text-input-icon', 'text-input-icon-start')}>{leftIcon}</span>
      )}
      <input
        type="text"
        className={inputClasses}
        placeholder={placeholderText}
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        data-testid={dataTestId}
        {...props}
      />
      {rightIcon && (
        <span className={classNames('text-input-icon', 'text-input-icon-end')}>{rightIcon}</span>
      )}
    </div>
  );
};

// NOTE - THIS IS A STUBBED OUT COMPONENT ONLY.
// PLEASE SEE https://minneapolisstartribune.atlassian.net/browse/SUS-8 FOR MORE INFORMATION.
// I'VE INCLUDED A BUNCH OF ACCESSIBILITY ATTRIBUTES FOR REFERENCE, BUT YOU SHOULD
// ABSOLUTELY CHECK MY WORK FOR ACCURACY.
import React from 'react';
import classNames from 'classnames';
import { FormControlProps } from '@/components/FormControl/FormControl';
import { AccessibilityProps, Size } from '@/types/globalTypes';
import { Icon } from '@/components/Icon/Icon';
import { IconName } from '@/components/Icon/iconNames';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';

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
  id: idProp,
  value,
  onChange,
  ...props
}) => {
  const formGroupContext = useFormGroupContext();

  // Accessibility: Connect form control to label, description, and caption via ARIA attributes
  // aria-labelledby: References the label ID (required for accessible form controls)
  // aria-describedby: References description and caption IDs (space-separated if both present)
  // Both attributes are automatically wired when used within FormGroup context
  // id: Used for htmlFor association (enables click-to-focus behavior)
  const ariaLabelledBy = ariaLabelledByProp ?? formGroupContext?.labelId;
  // Use context inputId if no explicit id is provided (enables htmlFor association)
  const inputId = idProp ?? formGroupContext?.inputId;

  // Combine description and caption IDs for aria-describedby (space-separated format)
  // aria-describedby can reference multiple elements by providing space-separated IDs.
  // Both description and caption provide additional information about the input, so
  // screen readers should announce both when the input is focused.
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
        id={inputId}
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

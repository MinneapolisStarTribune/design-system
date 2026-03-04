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
  leftIcon?: IconName;
  rightIcon?: IconName;
  rounded?: boolean;
  isDisabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  size = 'medium',
  placeholderText,
  icon,
  iconPosition = 'end',
  leftIcon: leftIconProp,
  rightIcon: rightIconProp,
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

  // Icon is always decorative (aria-hidden) when using the simple icon props.
  // Support both explicit left/right icons and the legacy single `icon` + `iconPosition` API.
  const leftIconName = leftIconProp ?? (icon && iconPosition === 'start' ? icon : undefined);
  const rightIconName = rightIconProp ?? (icon && iconPosition === 'end' ? icon : undefined);

  const leftIconNode = leftIconName ? (
    <Icon name={leftIconName} size={size} aria-hidden={true} />
  ) : null;
  const rightIconNode = rightIconName ? (
    <Icon name={rightIconName} size={size} aria-hidden={true} />
  ) : null;

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
    <div
      className={wrapperClasses}
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {leftIconNode && (
        <span
          className={classNames('text-input-icon', 'text-input-icon-start')}
          style={{
            display: 'inline-flex',
            flexShrink: 0,
            marginRight: 'var(--spacing-6)',
            marginLeft: 'var(--spacing-16)',
          }}
        >
          {leftIconNode}
        </span>
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
        style={{
          flex: 1,
          minWidth: 0,
          marginTop: 'var(--spacing-8)',
          marginBottom: 'var(--spacing-8)',
        }}
        {...props}
      />
      {rightIconNode && (
        <span
          className={classNames('text-input-icon', 'text-input-icon-end')}
          style={{ 
            display: 'inline-flex', 
            flexShrink: 0,
            marginLeft: 'var(--spacing-12)',
            marginRight: 'var(--spacing-8)',
          }}
        >
          {rightIconNode}
        </span>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { TextInput } from '@/components/FormControl/TextInput/web/TextInput';
import { CheckIcon, HideEyeIcon, ShowEyeIcon } from '@/icons';
import type { IconSize } from '@/components/Icon/Icon.types';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import type { PasswordInputProps } from '../PasswordInput.types';
import type { TextInputSize } from '../../TextInput/TextInput.types';
import styles from './PasswordInput.module.scss';

export type { PasswordInputProps } from '../PasswordInput.types';

const TOGGLE_ICON_SIZE: Record<TextInputSize, IconSize> = {
  small: 'x-small',
  medium: 'small',
  large: 'small',
};

const VALIDATION_ICON_SIZE: Record<TextInputSize, IconSize> = {
  small: 'x-small',
  medium: 'small',
  large: 'small',
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  defaultPasswordVisible = false,
  passwordVisible,
  onPasswordVisibleChange,
  autoComplete,
  className,
  size = 'medium',
  rounded = false,
  isDisabled = false,
  isError = false,
  isSuccess = false,
  onCopy,
  onCut,
  ...props
}) => {
  const formGroupContext = useFormGroupContext();
  const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultPasswordVisible);
  const [announcement, setAnnouncement] = useState('');

  const hasError = isError ?? formGroupContext?.hasError ?? false;
  const hasSuccess = isSuccess ?? formGroupContext?.hasSuccess ?? false;
  const showSuccessIcon = hasSuccess && !hasError;

  const isVisible = passwordVisible ?? uncontrolledVisible;
  const toggleIconSize = TOGGLE_ICON_SIZE[size];
  const validationIconSize = VALIDATION_ICON_SIZE[size];
  const iconStyle = { color: 'currentColor' } as const;

  const setVisible = (nextVisible: boolean) => {
    if (passwordVisible === undefined) {
      setUncontrolledVisible(nextVisible);
    }
    onPasswordVisibleChange?.(nextVisible);
    setAnnouncement(nextVisible ? 'Password shown' : 'Password hidden');
  };

  const handleToggle = () => {
    setVisible(!isVisible);
  };

  const handleCopy = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!isVisible) {
      event.preventDefault();
    }
    onCopy?.(event);
  };

  const handleCut = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!isVisible) {
      event.preventDefault();
    }
    onCut?.(event);
  };

  return (
    <div className={styles.root}>
      <TextInput
        {...props}
        size={size}
        rounded={rounded}
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        isDisabled={isDisabled}
        isError={isError}
        isSuccess={isSuccess}
        showSuccessIcon={false}
        className={classNames(
          styles['password-input'],
          styles[`password-input-${size}`],
          rounded && styles['password-input-rounded'],
          showSuccessIcon && styles['has-success-icon'],
          className
        )}
        onCopy={handleCopy}
        onCut={handleCut}
      />
      <div
        className={classNames(
          styles.trailing,
          styles[`trailing-${size}`],
          rounded && styles[`trailing-rounded-${size}`]
        )}
      >
        {showSuccessIcon && (
          <span
            className={classNames(styles['validation-icon'], styles['validation-icon-success'])}
          >
            <CheckIcon size={validationIconSize} style={iconStyle} aria-hidden />
          </span>
        )}
        <button
          type="button"
          className={classNames(styles.toggle, styles[`toggle-${size}`])}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          disabled={isDisabled}
          onClick={handleToggle}
        >
          {isVisible ? (
            <ShowEyeIcon size={toggleIconSize} style={iconStyle} aria-hidden />
          ) : (
            <HideEyeIcon size={toggleIconSize} style={iconStyle} aria-hidden />
          )}
        </button>
      </div>
      <span className={styles['sr-only']} aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
};

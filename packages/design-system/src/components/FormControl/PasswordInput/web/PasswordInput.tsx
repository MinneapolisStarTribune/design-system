'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { TextInput } from '@/components/FormControl/TextInput/web/TextInput';
import { HideEyeIcon, ShowEyeIcon } from '@/icons';
import type { IconSize } from '@/components/Icon/Icon.types';
import type { PasswordInputProps } from '../PasswordInput.types';
import type { TextInputSize } from '../../TextInput/TextInput.types';
import styles from './PasswordInput.module.scss';

export type { PasswordInputProps } from '../PasswordInput.types';

const TOGGLE_ICON_SIZE: Record<TextInputSize, IconSize> = {
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
  isDisabled = false,
  onCopy,
  onCut,
  ...props
}) => {
  const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultPasswordVisible);
  const [announcement, setAnnouncement] = useState('');

  const isVisible = passwordVisible ?? uncontrolledVisible;
  const iconSize = TOGGLE_ICON_SIZE[size];

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
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        isDisabled={isDisabled}
        className={classNames(
          styles['password-input'],
          styles[`password-input-${size}`],
          className
        )}
        onCopy={handleCopy}
        onCut={handleCut}
      />
      <button
        type="button"
        className={classNames(styles.toggle, styles[`toggle-${size}`])}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
        disabled={isDisabled}
        onClick={handleToggle}
      >
        {isVisible ? (
          <ShowEyeIcon
            size={iconSize}
            color={isDisabled ? 'state-disabled-on-light' : 'on-light-tertiary'}
            aria-hidden
          />
        ) : (
          <HideEyeIcon
            size={iconSize}
            color={isDisabled ? 'state-disabled-on-light' : 'on-light-tertiary'}
            aria-hidden
          />
        )}
      </button>
      <span className={styles['sr-only']} aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
};

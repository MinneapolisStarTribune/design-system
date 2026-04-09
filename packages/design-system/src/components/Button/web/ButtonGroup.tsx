'use client';

import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import styles from './ButtonGroup.module.scss';

export interface ButtonGroupProps extends BaseProps {
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  style,
  dataTestId,
}) => (
  <div
    className={classNames(styles['button-group'], 'button-group', className)}
    style={style}
    data-testid={dataTestId}
  >
    {children}
  </div>
);

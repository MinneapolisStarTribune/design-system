import React from 'react';
import classNames from 'classnames';
import { BaseProps, AccessibilityProps } from '@/types/globalTypes';
import { UtilityBodySize, UtilityBodyWeight } from './types';

export interface UtilityBodyProps extends BaseProps, AccessibilityProps {
  size?: UtilityBodySize;
  weight?: UtilityBodyWeight;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const UtilityBody: React.FC<UtilityBodyProps> = ({
  size = 'medium',
  weight = 'regular',
  className,
  children,
  dataTestId,
  style,
  ...props
}) => {
  const typographyClassName = `typography-utility-text-${weight}-${size}`;

  return (
    <p
      className={classNames(typographyClassName, className)}
      data-testid={dataTestId}
      style={style}
      {...props}
    >
      {children}
    </p>
  );
};

UtilityBody.displayName = 'UtilityBody';

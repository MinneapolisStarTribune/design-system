import React from 'react';
import classNames from 'classnames';
import { BaseProps, AccessibilityProps } from '@/types/globalTypes';
import { UtilityBodySize, UtilityBodyWeight } from './types';

export interface UtilityBodyProps extends BaseProps, AccessibilityProps {
  size?: UtilityBodySize;
  weight?: UtilityBodyWeight;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

export const UtilityBody: React.FC<UtilityBodyProps> = ({
  size = 'medium',
  weight = 'regular',
  as: Component = 'p',
  className,
  children,
  dataTestId,
  ...props
}) => {
  const typographyClassName = `typography-utility-text-${weight}-${size}`;

  return (
    <Component
      className={classNames(typographyClassName, className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

UtilityBody.displayName = 'UtilityBody';

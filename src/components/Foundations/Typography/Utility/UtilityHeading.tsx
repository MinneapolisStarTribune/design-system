import React from 'react';
import classNames from 'classnames';
import { BaseProps, AccessibilityProps } from '@/types/globalTypes';

export type UtilityHeadingImportance = 1 | 2 | 3 | 4 | 5 | 6;

export interface UtilityHeadingProps extends BaseProps, AccessibilityProps {
  importance: UtilityHeadingImportance;
  children: React.ReactNode;
}

export const UtilityHeading: React.FC<UtilityHeadingProps> = ({
  importance,
  children,
  className,
  dataTestId,
  ...props
}) => {
  const Tag = `h${importance}` as keyof React.JSX.IntrinsicElements;

  const typographyClassName = `typography-utility-section-h${importance}`;

  return (
    <Tag className={classNames(typographyClassName, className)} data-testid={dataTestId} {...props}>
      {children}
    </Tag>
  );
};

UtilityHeading.displayName = 'UtilityHeading';

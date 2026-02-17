import React from 'react';
import classNames from 'classnames';
import { BaseProps, AccessibilityProps } from '@/types/globalTypes';

export type SectionHeadingImportance = 1 | 2 | 3 | 4 | 5 | 6;

export interface SectionHeadingProps extends BaseProps, AccessibilityProps {
  importance: SectionHeadingImportance;
  children: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
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

SectionHeading.displayName = 'SectionHeading';

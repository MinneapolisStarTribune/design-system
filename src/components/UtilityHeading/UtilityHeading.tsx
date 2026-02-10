import React from 'react';
import { BaseProps } from '../../types/globalTypes';

export interface UtilityHeadingProps extends BaseProps {
  importance: number;
  children: React.ReactNode;
  headingType: string;
}

export const UtilityHeading: React.FC<UtilityHeadingProps> = ({
  importance,
  headingType,
  children,
  dataTestId,
}: UtilityHeadingProps) => {
  // Generate heading class name based on props
  // Pattern: typography-{headingType}-label-{weight}-{size}[-caps]
  const typographyClassName = `typography-utility-${headingType}-h${importance}`;

  return (
    <span className={typographyClassName} data-testid={dataTestId}>
      {children}
    </span>
  );

};
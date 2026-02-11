import React from 'react';
import { BaseProps } from '../../types/globalTypes';

export interface UtilityHeadingProps extends BaseProps {
  importance: number;
  children: React.ReactNode;
  //This would be either 'section' or 'page', but one issue is page is used for both Varsity and Strib
  //To expand on that, a heading with importance 1 is title the same thing for both Varisty and Strib: utility-page-h1
  headingType: string;
}

export const UtilityHeading: React.FC<UtilityHeadingProps> = ({
  importance,
  headingType,
  children,
  dataTestId,
}) => {
  // Generate heading class name based on props
  // Pattern: typography-{headingType}-label-{weight}-{size}[-caps]
  const typographyClassName = `typography-utility-${headingType}-h${importance}`;

  return (
    <span className={typographyClassName} data-testid={dataTestId}>
      {children}
    </span>
  );
};
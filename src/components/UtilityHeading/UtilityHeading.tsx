import React from 'react';
import { BaseProps } from '../../types/globalTypes';

export interface UtilityHeadingProps extends BaseProps {
  importance: number;
  children: React.ReactNode;
  //This would be either 'section' or 'page', but one issue is page is used for both Varsity and Strib
  //To expand on that, a heading with importance 1 is titled the same thing for both Varisty and Strib: utility-page-h1
  //also, do we even want to deal with this as a prop? How else would we handle it otherwise?
  headingType: string;
}

export const UtilityHeading: React.FC<UtilityHeadingProps> = ({
  importance,
  headingType,
  children,
  dataTestId,
}) => {
  //Generate heading class name based on props
  const typographyClassName = `typography-utility-${headingType}-h${importance}`;

  return (
    // I wasn't sure what tag to use here. Should we be doing h1's, h2's, etc., instead? Something else?
    <span className={typographyClassName} data-testid={dataTestId}>
      {children}
    </span>
  );
};
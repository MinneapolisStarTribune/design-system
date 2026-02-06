import React from 'react';
import { BaseProps } from '../../types/globalTypes';

export interface UtilityHeadingProps extends BaseProps {
  importance: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const UtilityHeading = ({
  importance,
  children,
  className,
  dataTestId,
}: UtilityHeadingProps): React.JSX.Element => {
  const headingProps = {
    className,
    'data-testid': dataTestId,
  };

  switch (importance) {
    case 1:
      return <h1 {...headingProps}>{children}</h1>;
    case 2:
      return <h2 {...headingProps}>{children}</h2>;
    case 3:
      return <h3 {...headingProps}>{children}</h3>;
    case 4:
      return <h4 {...headingProps}>{children}</h4>;
    case 5:
      return <h5 {...headingProps}>{children}</h5>;
    case 6:
      return <h6 {...headingProps}>{children}</h6>;
    default:
      return <h1 {...headingProps}>{children}</h1>;
  }
};
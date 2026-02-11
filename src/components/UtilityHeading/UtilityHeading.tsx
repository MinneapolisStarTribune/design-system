import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '../../types/globalTypes';

export interface UtilityHeadingProps extends BaseProps {
  importance: number;
  children: React.ReactNode;
  // 'section' or 'page'
  headingType: string;
  className?: string;
}

export const UtilityHeading: React.FC<UtilityHeadingProps> = ({
  importance,
  headingType,
  children,
  dataTestId,
  className,
}) => {
  //Generate heading class name based on props
  const typographyClassName = `typography-utility-${headingType}-h${importance}`;
  const combinedClassNames = classNames(typographyClassName, className);
  const HeadingTag = `h${importance}`;

  return React.createElement(
    HeadingTag,
    {
      className: combinedClassNames,
      'data-testid': dataTestId,
    },
    children
  );
};

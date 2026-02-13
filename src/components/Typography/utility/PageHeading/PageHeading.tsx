import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '../../../../types/globalTypes';

export interface PageHeadingProps extends BaseProps {
  importance: number;
  children: React.ReactNode;
  className?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({
  importance,
  children,
  dataTestId,
  className,
}) => {
  //Generate heading class name based on props
  const typographyClassName = `typography-utility-page-h${importance}`;
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

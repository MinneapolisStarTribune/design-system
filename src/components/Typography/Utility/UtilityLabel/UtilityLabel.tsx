import React from 'react';
import classNames from 'classnames';
import { AccessibilityProps, BaseProps } from '@/types/globalTypes';

export type UtilityLabelSize = 'small' | 'medium' | 'large';
export type UtilityLabelWeight = 'regular' | 'bold' | 'semibold';

export interface UtilityLabelProps extends BaseProps, AccessibilityProps {
  size: UtilityLabelSize;
  weight?: UtilityLabelWeight;
  capitalize?: boolean;
  children: React.ReactNode;
}

export const UtilityLabel: React.FC<UtilityLabelProps> = ({
  size,
  weight = 'regular',
  capitalize = false,
  children,
  className,
  dataTestId,
  ...rest
}) => {
  // Generate typography class name based on props
  // Pattern: typography-utility-label-{weight}-{size}[-caps]
  const weightSegment = weight === 'regular' ? '' : `${weight}-`;
  const typographyClassName = `typography-utility-label-${weightSegment}${size}${capitalize ? '-caps' : ''}`;

  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <span className={combinedClassNames} data-testid={dataTestId} {...rest}>
      {children}
    </span>
  );
};

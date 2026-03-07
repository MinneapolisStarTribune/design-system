import { AccessibilityProps, BaseProps, FontWeight, Size } from '@/types/globalTypes';
import classNames from 'classnames';
import { FC } from 'react';

export interface EditorialSponsoredTextProps extends BaseProps, AccessibilityProps {
  size: Size;
  weight?: Extract<FontWeight, 'regular' | 'bold'>;
  children: React.ReactNode;
}

export const EditorialSponsoredText: FC<EditorialSponsoredTextProps> = (props) => {
  const {
    size,
    weight = 'regular',
    children,
    className,
    dataTestId = 'editorial-text-sponsored',
    ...restProps
  } = props;
  const typographyClassName = `typography-editorial-text-sponsored-${weight}-${size}`;
  const combinedClassName = classNames(typographyClassName, className);

  return (
    <p className={combinedClassName} data-testid={dataTestId} {...restProps}>
      {children}
    </p>
  );
};

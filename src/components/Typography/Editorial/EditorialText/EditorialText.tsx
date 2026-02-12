import type { AccessibilityProps, BaseProps, FontWeight, Size } from '@/types/globalTypes';
import classNames from 'classnames';

export interface EditorialTextProps extends BaseProps, AccessibilityProps {
  size: Size;
  weight?: Extract<FontWeight, 'regular' | 'bold'>;
  children: React.ReactNode;
}

export const EditorialText: React.FC<EditorialTextProps> = (props) => {
  const {
    size,
    weight = 'regular',
    children,
    className,
    dataTestId = 'editorial-text',
    ...restProps
  } = props;
  const baseClass = `typography-editorial-text-${weight}-${size}`;

  const responsiveClasses = [`${baseClass}-desktop`, `${baseClass}-tablet`, `${baseClass}-mobile`];

  const combinedClassName = classNames(baseClass, ...responsiveClasses, className);

  return (
    <p className={combinedClassName} data-testid={dataTestId} {...restProps}>
      {children}
    </p>
  );
};

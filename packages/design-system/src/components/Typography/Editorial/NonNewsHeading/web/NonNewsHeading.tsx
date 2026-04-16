import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type { NonNewsHeadingProps } from '../NonNewsHeading.types';
import { resolveTextColorStyle } from '@/types';

const getHeadingConfig = (importance: NonNewsHeadingProps['importance']) => {
  const configs: Record<
    NonNewsHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-editorial-non-news-h1' },
    2: { element: 'h2', className: 'typography-editorial-non-news-h2' },
    3: { element: 'h3', className: 'typography-editorial-non-news-h3' },
    4: { element: 'h4', className: 'typography-editorial-non-news-h4' },
    5: { element: 'h5', className: 'typography-editorial-non-news-h5' },
    6: { element: 'h6', className: 'typography-editorial-non-news-h6' },
  };

  return configs[importance];
};

export const NonNewsHeading: React.FC<NonNewsHeadingProps> = ({
  importance,
  children,
  className,
  color,
  style,
  ...props
}) => {
  useBrandValidation('NonNewsHeading');
  const { element: HeadingElement, className: typographyClass } = getHeadingConfig(importance);
  const combinedClassName = classNames(typographyClass, className);

  return (
    <HeadingElement
      className={combinedClassName || undefined}
      style={resolveTextColorStyle(color, style)}
      {...props}
    >
      {children}
    </HeadingElement>
  );
};

NonNewsHeading.displayName = 'NonNewsHeading';

export type { NonNewsHeadingImportance, NonNewsHeadingProps } from '../NonNewsHeading.types';

import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type { OpinionHeadingProps } from '../OpinionHeading.types';
import { resolveTextColorStyle } from '@/types';

const getHeadingConfig = (importance: OpinionHeadingProps['importance']) => {
  const configs: Record<
    OpinionHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-editorial-opinion-h1' },
    2: { element: 'h2', className: 'typography-editorial-opinion-h2' },
    3: { element: 'h3', className: 'typography-editorial-opinion-h3' },
    4: { element: 'h4', className: 'typography-editorial-opinion-h4' },
    5: { element: 'h5', className: 'typography-editorial-opinion-h5' },
    6: { element: 'h6', className: 'typography-editorial-opinion-h6' },
  };

  return configs[importance];
};

export const OpinionHeading: React.FC<OpinionHeadingProps> = ({
  importance,
  children,
  className,
  color,
  style,
  ...props
}) => {
  useBrandValidation('OpinionHeading');
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

OpinionHeading.displayName = 'OpinionHeading';

export type { OpinionHeadingImportance, OpinionHeadingProps } from '../OpinionHeading.types';

import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type { SponsoredHeadingProps } from '../SponsoredHeading.types';
import { resolveTextColorStyle } from '@/types';

const getHeadingConfig = (importance: SponsoredHeadingProps['importance']) => {
  const configs: Record<
    SponsoredHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-sponsored-h1' },
    2: { element: 'h2', className: 'typography-sponsored-h2' },
    3: { element: 'h3', className: 'typography-sponsored-h3' },
    4: { element: 'h4', className: 'typography-sponsored-h4' },
    5: { element: 'h5', className: 'typography-sponsored-h5' },
    6: { element: 'h6', className: 'typography-sponsored-h6' },
  };

  return configs[importance];
};

export const SponsoredHeading: React.FC<SponsoredHeadingProps> = ({
  importance,
  children,
  className,
  color,
  style,
  ...props
}) => {
  useBrandValidation('SponsoredHeading');
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

SponsoredHeading.displayName = 'SponsoredHeading';

export type { SponsoredHeadingImportance, SponsoredHeadingProps } from '../SponsoredHeading.types';

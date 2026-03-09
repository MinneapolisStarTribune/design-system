import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type { EnterpriseHeadingProps } from '../EnterpriseHeading.types';

const getHeadingConfig = (importance: EnterpriseHeadingProps['importance']) => {
  const configs: Record<
    EnterpriseHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-editorial-enterprise-h1' },
    2: { element: 'h2', className: 'typography-editorial-enterprise-h2' },
    3: { element: 'h3', className: 'typography-editorial-enterprise-h3' },
    4: { element: 'h4', className: 'typography-editorial-enterprise-h4' },
    5: { element: 'h5', className: 'typography-editorial-enterprise-h5' },
    6: { element: 'h6', className: 'typography-editorial-enterprise-h6' },
  };

  return configs[importance];
};

export const EnterpriseHeading: React.FC<EnterpriseHeadingProps> = ({
  importance,
  children,
  className,
  ...props
}) => {
  useBrandValidation('EnterpriseHeading');
  const { element: HeadingElement, className: typographyClass } = getHeadingConfig(importance);
  const combinedClassName = classNames(typographyClass, className);

  return (
    <HeadingElement className={combinedClassName || undefined} {...props}>
      {children}
    </HeadingElement>
  );
};

EnterpriseHeading.displayName = 'EnterpriseHeading';

export type {
  EnterpriseHeadingImportance,
  EnterpriseHeadingProps,
} from '../EnterpriseHeading.types';

import classNames from 'classnames';
import type { SectionHeadingProps } from '../SectionHeading.types';

const getHeadingConfig = (importance: SectionHeadingProps['importance']) => {
  const configs: Record<
    SectionHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-utility-section-h1' },
    2: { element: 'h2', className: 'typography-utility-section-h2' },
    3: { element: 'h3', className: 'typography-utility-section-h3' },
    4: { element: 'h4', className: 'typography-utility-section-h4' },
    5: { element: 'h5', className: 'typography-utility-section-h5' },
    6: { element: 'h6', className: 'typography-utility-section-h6' },
  };

  return configs[importance];
};

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  importance,
  children,
  className,
  dataTestId,
  ...props
}) => {
  const { element: HeadingElement, className: typographyClassName } = getHeadingConfig(importance);

  return (
    <HeadingElement
      className={classNames(typographyClassName, className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </HeadingElement>
  );
};

SectionHeading.displayName = 'SectionHeading';

export type { SectionHeadingImportance, SectionHeadingProps } from '../SectionHeading.types';

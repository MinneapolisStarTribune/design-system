import type { AccessibilityProps, BaseProps, FontWeight } from '@/types/globalTypes';
import classNames from 'classnames';

export interface ArticleBodySponsoredTextProps extends BaseProps, AccessibilityProps {
  weight?: Extract<FontWeight, 'regular' | 'italic' | 'semibold' | 'semibold-italic'>;
  children: React.ReactNode;
}

export const ArticleBodySponsoredText: React.FC<ArticleBodySponsoredTextProps> = (props) => {
  const {
    weight = 'regular',
    children,
    className,
    dataTestId = 'article-body-text-sponsored',
    ...restProps
  } = props;
  const typographyClassName = `typography-article-body-sponsored-${weight}`;
  const combinedClassName = classNames(typographyClassName, className);

  return (
    <p className={combinedClassName} data-testid={dataTestId} {...restProps}>
      {children}
    </p>
  );
};

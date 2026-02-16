import { AccessibilityProps, BaseProps, FontWeight } from '@/types/globalTypes';
import classNames from 'classnames';

export interface ArticleBodyTextProps extends BaseProps, AccessibilityProps {
  weight?: Extract<FontWeight, 'regular' | 'italic' | 'bold' | 'bold-italic' | 'dropcap'>;
  children: React.ReactNode;
}

export const ArticleBodyText: React.FC<ArticleBodyTextProps> = (props) => {
  const {
    weight = 'regular',
    children,
    dataTestId = 'article-body-text',
    className,
    ...rest
  } = props;

  const typographyClassName = `typography-article-body-${weight}`;
  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <p className={combinedClassNames} data-testid={dataTestId} {...rest}>
      {children}
    </p>
  );
};

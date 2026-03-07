import { renderWithProvider } from '@/test-utils/render';
import { ArticleBodyText } from './ArticleBodyText';

describe('ArticleBodyText', () => {
  it('uses regular weight by default', () => {
    const { getByTestId } = renderWithProvider(
      <ArticleBodyText>Article body text</ArticleBodyText>
    );

    const element = getByTestId('article-body-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-article-body-regular');
    expect(element).toHaveTextContent('Article body text');
  });

  it('applies the correct typography class for each weight', () => {
    const weights = ['regular', 'italic', 'bold', 'bold-italic', 'dropcap'] as const;
    weights.forEach((weight) => {
      const { getByTestId } = renderWithProvider(
        <ArticleBodyText weight={weight} dataTestId={`article-body-text-${weight}`}>
          {weight} text
        </ArticleBodyText>
      );

      const element = getByTestId(`article-body-text-${weight}`);
      expect(element).toHaveClass(`typography-article-body-${weight}`);
    });
  });

  it('merges custom className with typography class', () => {
    const { getByTestId } = renderWithProvider(
      <ArticleBodyText weight="bold" className="custom-class" dataTestId="article-body-text">
        Bold text
      </ArticleBodyText>
    );

    const element = getByTestId('article-body-text');
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveClass('typography-article-body-bold');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithProvider(
      <ArticleBodyText weight="bold" dataTestId="article-body-text">
        <span>Nested Content</span>
      </ArticleBodyText>
    );

    const element = getByTestId('article-body-text');
    expect(element.querySelector('span')).toHaveTextContent('Nested Content');
  });
});

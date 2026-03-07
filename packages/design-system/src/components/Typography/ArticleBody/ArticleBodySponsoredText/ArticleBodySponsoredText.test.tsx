import { renderWithProvider } from '@/test-utils/render';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText';

describe('ArticleBodySponsoredText', () => {
  it('uses regular weight by default', () => {
    const { getByTestId } = renderWithProvider(
      <ArticleBodySponsoredText dataTestId="article-body-text-sponsored">
        Article body sponsored text
      </ArticleBodySponsoredText>
    );

    const element = getByTestId('article-body-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-article-body-sponsored-regular');
    expect(element).toHaveTextContent('Article body sponsored text');
  });

  it('applies the correct typography class for each weight', () => {
    const weights = ['regular', 'italic', 'semibold', 'semibold-italic'] as const;
    weights.forEach((weight) => {
      const { getByTestId } = renderWithProvider(
        <ArticleBodySponsoredText
          weight={weight}
          dataTestId={`article-body-text-sponsored-${weight}`}
        >
          {weight} text
        </ArticleBodySponsoredText>
      );

      const element = getByTestId(`article-body-text-sponsored-${weight}`);
      expect(element).toHaveClass(`typography-article-body-sponsored-${weight}`);
    });
  });

  it('merges custom className with typography class', () => {
    const { getByTestId } = renderWithProvider(
      <ArticleBodySponsoredText
        weight="semibold"
        className="custom-class"
        dataTestId="article-body-text-sponsored"
      >
        Article body sponsored text
      </ArticleBodySponsoredText>
    );

    const element = getByTestId('article-body-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-article-body-sponsored-semibold custom-class');
    expect(element).toHaveTextContent('Article body sponsored text');
  });
});

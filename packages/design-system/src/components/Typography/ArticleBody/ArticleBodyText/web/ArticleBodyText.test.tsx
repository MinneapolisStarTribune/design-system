import { renderWithProvider } from '@/test-utils/render';
import { ArticleBodyText } from './ArticleBodyText';
import { ARTICLE_BODY_TEXT_WEIGHTS } from '../ArticleBodyText.types';

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

  it.each(ARTICLE_BODY_TEXT_WEIGHTS)(
    'applies the correct typography class for %s weight',
    (weight) => {
      const { getByTestId } = renderWithProvider(
        <ArticleBodyText weight={weight} dataTestId={`article-body-text-${weight}`}>
          {weight} text
        </ArticleBodyText>
      );

      const element = getByTestId(`article-body-text-${weight}`);
      if (weight === 'dropcap') {
        expect(element).toHaveClass('typography-article-body-regular');
        expect(element).toHaveClass('typography-article-body-dropcap');
      } else {
        expect(element).toHaveClass(`typography-article-body-${weight}`);
      }
    }
  );

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
});

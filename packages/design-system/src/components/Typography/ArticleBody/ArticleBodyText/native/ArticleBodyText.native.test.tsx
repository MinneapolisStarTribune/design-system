import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { ArticleBodyText } from './ArticleBodyText.native';
import { ARTICLE_BODY_TEXT_WEIGHTS } from '../ArticleBodyText.types';

describe('ArticleBodyText (native)', () => {
  it('renders with default weight', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<ArticleBodyText>Body text</ArticleBodyText>, { wrapper });
    expect(screen.getByText('Body text')).toBeOnTheScreen();
  });

  it.each(ARTICLE_BODY_TEXT_WEIGHTS)('renders weight %s', (weight) => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<ArticleBodyText weight={weight}>Text - {weight}</ArticleBodyText>, { wrapper });
    expect(screen.getByText(`Text - ${weight}`)).toBeOnTheScreen();
  });

  it('uses article body typography tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<ArticleBodyText weight="regular">Body text</ArticleBodyText>, { wrapper });

    const element = screen.getByText('Body text');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyArticleBodyRegular
      )
    );
  });
});

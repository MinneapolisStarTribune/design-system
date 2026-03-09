import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText.native';
import { ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS } from '../ArticleBodySponsoredText.types';

describe('ArticleBodySponsoredText (native)', () => {
  it('renders with default weight', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<ArticleBodySponsoredText>Sponsored text</ArticleBodySponsoredText>, { wrapper });

    expect(screen.getByText('Sponsored text')).toBeOnTheScreen();
  });

  it.each(ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS)('renders weight %s', (weight) => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<ArticleBodySponsoredText weight={weight}>Text - {weight}</ArticleBodySponsoredText>, {
      wrapper,
    });

    expect(screen.getByText(`Text - ${weight}`)).toBeOnTheScreen();
  });

  it('uses Star Tribune sponsored text tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<ArticleBodySponsoredText weight="regular">Sponsored</ArticleBodySponsoredText>, {
      wrapper,
    });

    const element = screen.getByText('Sponsored');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyArticleBodySponsoredRegular
      )
    );
  });
});

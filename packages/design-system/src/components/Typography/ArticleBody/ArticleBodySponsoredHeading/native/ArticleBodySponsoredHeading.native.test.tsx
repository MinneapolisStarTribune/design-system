import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading.native';
import { ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodySponsoredHeading.types';

describe('ArticleBodySponsoredHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(
      <ArticleBodySponsoredHeading importance={1}>Heading content</ArticleBodySponsoredHeading>,
      { wrapper }
    );
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS)(
    'renders importance %s',
    (importance) => {
      const wrapper = TestWrapperInDesignSystemProvider();
      render(
        <ArticleBodySponsoredHeading importance={importance}>
          Heading - {importance}
        </ArticleBodySponsoredHeading>,
        { wrapper }
      );
      expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
    }
  );

  it('renders without throwing when brand is startribune', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    expect(() =>
      render(<ArticleBodySponsoredHeading importance={1}>Sponsored</ArticleBodySponsoredHeading>, {
        wrapper,
      })
    ).not.toThrow();
  });

  it('uses Star Tribune sponsored heading tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<ArticleBodySponsoredHeading importance={1}>Sponsored</ArticleBodySponsoredHeading>, {
      wrapper,
    });

    const element = screen.getByText('Sponsored');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyArticleBodySponsoredH1
      )
    );
  });

  it('throws when brand is varsity (ArticleBodySponsoredHeading is Star Tribune only)', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'varsity' });
    expect(() =>
      render(<ArticleBodySponsoredHeading importance={1}>Sponsored</ArticleBodySponsoredHeading>, {
        wrapper,
      })
    ).toThrow();
  });
});

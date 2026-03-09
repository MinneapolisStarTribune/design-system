import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleBodyHeading } from './ArticleBodyHeading.native';
import { ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodyHeading.types';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleBodyHeading (native)', () => {
  it('renders with importance 1', () => {
    render(<ArticleBodyHeading importance={1}>Heading content</ArticleBodyHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    render(
      <ArticleBodyHeading importance={importance}>Heading - {importance}</ArticleBodyHeading>,
      { wrapper }
    );
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });
});

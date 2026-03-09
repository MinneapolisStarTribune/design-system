import '@/test-utils/mockNativeTokens';

vi.mock('react-native', () => {
  const React = require('react');
  return {
    Text: React.forwardRef(
      (
        { testID, accessibilityRole, children, ...rest }: Record<string, unknown>,
        ref: React.Ref<HTMLSpanElement>
      ) =>
        React.createElement(
          'span',
          { 'data-testid': testID, role: accessibilityRole, ref, ...rest },
          children
        )
    ),
    StyleSheet: {
      create: <T extends Record<string, unknown>>(styles: T): T => styles,
    },
  };
});

import { render, screen } from '@testing-library/react';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleQuote } from './ArticleQuote';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleQuote Accessibility (native)', () => {
  it('sets accessibilityRole to "none" by default', () => {
    render(<ArticleQuote>Highlight key statements or examples within an article.</ArticleQuote>, {
      wrapper,
    });
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveAttribute('role', 'none');
  });

  it('renders all sizes with accessible text content', () => {
    const sizes = ['small', 'large'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(
        <ArticleQuote size={size} dataTestId={`article-quote-${size}`}>
          {size} quote — visual emphasis for key moments.
        </ArticleQuote>,
        { wrapper }
      );
      const element = screen.getByTestId(`article-quote-${size}`);
      expect(element).toHaveTextContent(`${size} quote`);
      unmount();
    });
  });

  it('forwards aria-label to the underlying element', () => {
    render(
      <ArticleQuote aria-label="Featured pull quote">Custom accessible article quote</ArticleQuote>,
      { wrapper }
    );
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveAttribute('aria-label', 'Featured pull quote');
  });

  it('forwards aria-describedby to the underlying element', () => {
    render(<ArticleQuote aria-describedby="quote-source">Described article quote</ArticleQuote>, {
      wrapper,
    });
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveAttribute('aria-describedby', 'quote-source');
  });

  it('forwards aria-hidden to the underlying element', () => {
    render(<ArticleQuote aria-hidden={true}>Hidden article quote</ArticleQuote>, { wrapper });
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveAttribute('aria-hidden', 'true');
  });
});

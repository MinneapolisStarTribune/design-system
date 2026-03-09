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

describe('ArticleQuote (native)', () => {
  it('renders with default props', () => {
    render(<ArticleQuote>Quote content</ArticleQuote>, { wrapper });
    const element = screen.getByTestId('article-quote');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Quote content');
  });

  it('renders each size variant without error', () => {
    const sizes = ['small', 'large'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(
        <ArticleQuote size={size} dataTestId={`article-quote-${size}`}>
          Quote - {size}
        </ArticleQuote>,
        { wrapper }
      );
      const element = screen.getByTestId(`article-quote-${size}`);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(`Quote - ${size}`);
      unmount();
    });
  });

  it('uses custom dataTestId', () => {
    render(<ArticleQuote dataTestId="custom-quote">Custom test id</ArticleQuote>, { wrapper });
    expect(screen.getByTestId('custom-quote')).toBeInTheDocument();
  });

  it('passes through accessibility props', () => {
    render(
      <ArticleQuote aria-label="Featured quote" dataTestId="article-quote">
        Accessible quote
      </ArticleQuote>,
      { wrapper }
    );
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveAttribute('aria-label', 'Featured quote');
  });
});

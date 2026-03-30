import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';
import { InlineLink } from './InlineLink';

describe('InlineLink (web)', () => {
  it('renders as anchor with href', () => {
    render(
      <ArticleBodyText>
        Text{' '}
        <InlineLink brand="startribune" href="/article">
          link
        </InlineLink>
      </ArticleBodyText>
    );
    const el = screen.getByRole('link', { name: 'link' });
    expect(el).toHaveAttribute('href', '/article');
  });

  it('applies brand class for startribune and varsity', () => {
    const { rerender } = render(
      <InlineLink brand="startribune" href="/a">
        a
      </InlineLink>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();

    rerender(
      <InlineLink brand="varsity" href="/b">
        b
      </InlineLink>
    );
    expect(screen.getByRole('link', { name: 'b' })).toBeInTheDocument();
  });

  it('renders disabled state with aria-disabled', () => {
    render(
      <ArticleBodyText>
        <InlineLink brand="startribune" href="/x" disabled>
          unavailable
        </InlineLink>
      </ArticleBodyText>
    );
    const el = screen.getByRole('link', { name: 'unavailable' });
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el.tagName.toLowerCase()).toBe('span');
  });

  it('calls onClick when enabled', () => {
    const onClick = vi.fn();
    render(
      <InlineLink brand="varsity" href="#" onClick={onClick}>
        Tap
      </InlineLink>
    );
    screen.getByRole('link', { name: 'Tap' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with `as` component', () => {
    function CustomRoot({
      href: hrefProp,
      className,
      children,
    }: {
      href?: string;
      className?: string;
      children: ReactNode;
    }) {
      return (
        <a data-testid="custom-root" href={hrefProp} className={className}>
          {children}
        </a>
      );
    }

    render(
      <InlineLink as={CustomRoot} brand="startribune" href="/via-as">
        Custom
      </InlineLink>
    );
    expect(screen.getByTestId('custom-root')).toHaveAttribute('href', '/via-as');
  });
});

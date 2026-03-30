import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './Link';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';

describe('Link (web)', () => {
  it('renders as anchor with href', () => {
    render(
      <Link size="medium" href="/article">
        Read more
      </Link>
    );
    const el = screen.getByRole('link', { name: 'Read more' });
    expect(el).toHaveAttribute('href', '/article');
  });

  it('renders disabled state with aria-disabled and without navigation', () => {
    render(
      <Link size="medium" href="/article" disabled>
        Read more
      </Link>
    );
    const el = screen.getByRole('link', { name: 'Read more' });
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el.tagName.toLowerCase()).toBe('span');
  });

  it('calls onClick when enabled', async () => {
    const onClick = vi.fn();
    render(
      <Link size="small" href="#" onClick={onClick}>
        Tap
      </Link>
    );
    screen.getByRole('link', { name: 'Tap' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['small', 'typography-utility-text-medium-x-small'],
    ['medium', 'typography-utility-text-medium-small'],
    ['large', 'typography-utility-text-medium-medium'],
  ] as const)('maps size %s to Utility Body token class %s', (size, expectedClass) => {
    render(
      <Link size={size} href="/x">
        Label
      </Link>
    );
    expect(screen.getByText('Label')).toHaveClass(expectedClass);
  });

  it('renders variant inline without Utility Body typography class', () => {
    render(
      <ArticleBodyText>
        <Link variant="inline" brand="startribune" href="/inline">
          inline
        </Link>
      </ArticleBodyText>
    );
    const inner = screen.getByText('inline');
    expect(inner.tagName.toLowerCase()).toBe('span');
    expect(inner).not.toHaveClass('typography-utility-text-medium-small');
  });

  it('renders as native button without href when `as="button"`', () => {
    render(
      <Link as="button" size="medium" href="/ignored-for-button">
        Action
      </Link>
    );
    const el = screen.getByRole('button', { name: 'Action' });
    expect(el).not.toHaveAttribute('href');
    expect(el).toHaveAttribute('type', 'button');
  });

  it('renders with `as` component instead of a native anchor', () => {
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
      <Link as={CustomRoot} size="medium" href="/via-as">
        Custom
      </Link>
    );
    const root = screen.getByTestId('custom-root');
    expect(root).toHaveAttribute('href', '/via-as');
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });
});

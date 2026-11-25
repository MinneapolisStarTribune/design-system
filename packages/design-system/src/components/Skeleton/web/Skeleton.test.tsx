import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

const renderSkeleton = (props: Parameters<typeof Skeleton>[0] = {}) => {
  render(<Skeleton dataTestId="skeleton" {...props} />);
  return screen.getByTestId('skeleton');
};

describe('Skeleton', () => {
  it('is hidden from assistive tech by default', () => {
    expect(renderSkeleton()).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the variant class and the animate class by default', () => {
    const circle = renderSkeleton({ variant: 'circle' });
    expect(circle).toHaveClass(styles['variant-circle'], styles.animate);
  });

  it('omits the animate class when animate is false', () => {
    expect(renderSkeleton({ animate: false })).not.toHaveClass(styles.animate);
  });

  it('sets text bar sizes from width and height', () => {
    const bar = renderSkeleton({ width: '70%', height: 12 });
    expect(bar.style.width).toBe('70%');
    expect(bar.style.height).toBe('12px');
  });

  it('renders a square from equal width and height', () => {
    const square = renderSkeleton({ width: 16, height: 16 });
    expect(square.style.width).toBe('16px');
    expect(square.style.height).toBe('16px');
  });

  it('keeps circles 1:1 for a single dimension', () => {
    const circle = renderSkeleton({ variant: 'circle', height: 32 });
    expect(circle.style.width).toBe('32px');
    expect(circle.style.height).toBe('32px');
  });

  it('sets borderRadius from radius', () => {
    expect(renderSkeleton({ radius: 12 })).toHaveStyle({ borderRadius: '12px' });
  });

  it('sets no inline style when no overrides are passed', () => {
    expect(renderSkeleton()).not.toHaveAttribute('style');
  });

  it('lets style win over width, height and radius props', () => {
    const el = renderSkeleton({ width: 10, radius: 4, style: { width: 50, borderRadius: 8 } });
    expect(el.style.width).toBe('50px');
    expect(el.style.borderRadius).toBe('8px');
  });

  it('passes className through next to the component classes', () => {
    const el = renderSkeleton({ className: 'h-4 rounded-full' });
    expect(el).toHaveClass(styles.skeleton, styles['variant-rectangle'], 'h-4', 'rounded-full');
  });

  it('forwards standard div props', () => {
    const el = renderSkeleton({ id: 'bar', 'aria-hidden': false });
    expect(el).toHaveAttribute('id', 'bar');
    expect(el).toHaveAttribute('aria-hidden', 'false');
  });

  it('exposes one status announcement when wrapped, with shapes hidden', () => {
    render(
      <div role="status" aria-label="Loading roster">
        <Skeleton dataTestId="a" />
        <Skeleton dataTestId="b" />
      </div>
    );
    expect(screen.getByRole('status', { name: 'Loading roster' })).toBeInTheDocument();
    expect(screen.getByTestId('a')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('b')).toHaveAttribute('aria-hidden', 'true');
  });
});

// jsdom does not evaluate media queries or specificity, so assert the stylesheet source.
describe('Skeleton styles', () => {
  const scss = readFileSync(join(__dirname, 'Skeleton.module.scss'), 'utf8');

  it('turns the shimmer off under prefers-reduced-motion', () => {
    expect(scss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*{\s*:where\(\.skeleton\.animate\)\s*{\s*animation: none;/
    );
  });

  it('keeps every top-level rule at zero specificity so consumer classes win', () => {
    const selectors = [...scss.matchAll(/^([.:][^{]*){/gm)].map((m) => m[1].trim());
    expect(selectors.length).toBeGreaterThan(0);
    selectors.forEach((selector) => expect(selector).toMatch(/^:where\(.+\)$/));
  });

  it('uses the Figma placeholder palette', () => {
    expect(scss).toContain('--skeleton-from: #e3e5e8');
    expect(scss).toContain('--skeleton-to: #f5f6f7');
  });
});

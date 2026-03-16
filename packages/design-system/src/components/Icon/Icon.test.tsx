import { render, screen } from '@testing-library/react';
import React from 'react';
import type { SVGProps } from 'react';
import { expectTypeOf } from 'vitest';
import { createIconWrapper } from './Icon';
import type { IconComponent } from './Icon.types';
import {
  ICON_COLOR_TOKENS,
  ICON_PIXEL_SIZES,
  type IconColor,
  type IconSize,
  type IconWrapperProps,
} from './Icon.types';
import { CameraIcon } from '@/icons';

const MockSvgIcon: IconComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg data-testid="mock-svg" {...props} />
);

describe('Icon types and constants', () => {
  it('ICON_PIXEL_SIZES maps each IconSize to a pixel string', () => {
    const sizes: IconSize[] = ['x-small', 'small', 'medium', 'large', 'x-large'];
    expect(sizes.every((s) => typeof ICON_PIXEL_SIZES[s] === 'string')).toBe(true);
    expect(ICON_PIXEL_SIZES['x-small']).toBe('14px');
    expect(ICON_PIXEL_SIZES['small']).toBe('16px');
    expect(ICON_PIXEL_SIZES['medium']).toBe('20px');
    expect(ICON_PIXEL_SIZES['large']).toBe('24px');
    expect(ICON_PIXEL_SIZES['x-large']).toBe('32px');
  });

  it('ICON_COLOR_TOKENS maps each IconColor to a CSS var', () => {
    const colors = Object.keys(ICON_COLOR_TOKENS) as IconColor[];
    expect(colors.length).toBeGreaterThan(0);
    colors.forEach((key) => {
      const value = ICON_COLOR_TOKENS[key];
      expect(value).toMatch(/^var\(--color-icon-/);
    });
    expect(ICON_COLOR_TOKENS['on-dark-secondary']).toBe('var(--color-icon-on-dark-secondary)');
    expect(ICON_COLOR_TOKENS['brand-01']).toBe('var(--color-icon-brand-01)');
  });
});

describe('createIconWrapper', () => {
  const TestIcon = createIconWrapper(MockSvgIcon);

  it('renders with default size (medium) and default color (on-light-primary)', () => {
    const { container } = render(<TestIcon aria-hidden />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20px');
    expect(svg).toHaveAttribute('height', '20px');
    expect(svg).toHaveStyle({ color: 'var(--color-icon-on-light-primary)' });
  });

  it('applies size prop to width and height', () => {
    const { container } = render(<TestIcon size="small" aria-hidden />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16px');
    expect(svg).toHaveAttribute('height', '16px');
  });

  it('applies color prop as CSS variable in style', () => {
    const { container } = render(<TestIcon size="small" color="on-dark-secondary" aria-hidden />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ color: 'var(--color-icon-on-dark-secondary)' });
  });

  it('passes through aria attributes', () => {
    render(<TestIcon aria-label="Camera" />);
    expect(screen.getByLabelText('Camera')).toBeInTheDocument();
  });

  it('passes through className', () => {
    const { container } = render(<TestIcon className="custom-icon" aria-hidden />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-icon');
  });
});

describe('generated icon typings', () => {
  it('CameraIcon from barrel accepts IconWrapperProps (size and color unions)', () => {
    expectTypeOf(CameraIcon).toMatchTypeOf<React.FC<IconWrapperProps>>();
  });
});

import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { mockViewport } from '@/test-utils/viewport';
import type { Responsive } from '@/types/globalTypes';
import { resolveResponsive, useBreakpoint, useResponsiveValue } from './useResponsiveValue';

describe('resolveResponsive', () => {
  it('returns a plain value at every breakpoint', () => {
    expect(resolveResponsive('left', 'small')).toBe('left');
    expect(resolveResponsive('left', 'large')).toBe('left');
  });

  it('uses the nearest key at or below the breakpoint', () => {
    const value = { small: 'bottom', large: 'left' };

    expect(resolveResponsive(value, 'small')).toBe('bottom');
    expect(resolveResponsive(value, 'medium')).toBe('bottom');
    expect(resolveResponsive(value, 'large')).toBe('left');
  });

  it('returns undefined below the smallest key', () => {
    expect(resolveResponsive({ medium: 'left' }, 'small')).toBeUndefined();
    expect(resolveResponsive(undefined, 'small')).toBeUndefined();
  });

  it('treats an empty map as having no keys', () => {
    expect(resolveResponsive({} as Responsive<string>, 'large')).toBeUndefined();
  });
});

describe('useBreakpoint', () => {
  let viewport: ReturnType<typeof mockViewport>;

  afterEach(() => viewport.restore());

  it.each([
    [375, 'small'],
    [768, 'medium'],
    [1159, 'medium'],
    [1160, 'large'],
  ])('returns the breakpoint for a %ipx viewport', (width, breakpoint) => {
    viewport = mockViewport(width);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe(breakpoint);
  });

  it('updates when the viewport crosses a breakpoint', () => {
    viewport = mockViewport(375);

    const { result } = renderHook(() => useBreakpoint());

    viewport.resize(1200);

    expect(result.current).toBe('large');
  });
});

describe('useResponsiveValue', () => {
  let viewport: ReturnType<typeof mockViewport>;

  afterEach(() => viewport.restore());

  it('falls back to the default for breakpoints the value does not cover', () => {
    viewport = mockViewport(375);

    const { result } = renderHook(() =>
      useResponsiveValue({ medium: 'left' }, { small: 'bottom', medium: 'right' })
    );

    expect(result.current).toBe('bottom');

    viewport.resize(800);

    expect(result.current).toBe('left');
  });

  it('falls back to the default for an empty map', () => {
    viewport = mockViewport(800);

    const { result } = renderHook(() =>
      useResponsiveValue({} as Responsive<string>, { small: 'bottom', medium: 'right' })
    );

    expect(result.current).toBe('right');
  });
});

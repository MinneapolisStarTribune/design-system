import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useResponsiveSize } from './useResponsiveSize';

describe('useResponsiveSize', () => {
  it('returns override value when provided', () => {
    const { result } = renderHook(() => useResponsiveSize('medium'));

    expect(result.current).toBe('medium');
  });

  it('returns large for desktop width', () => {
    window.innerWidth = 1200;

    const { result } = renderHook(() => useResponsiveSize());

    expect(result.current).toBe('large');
  });

  it('returns medium for mobile/tablet width', () => {
    window.innerWidth = 800;

    const { result } = renderHook(() => useResponsiveSize());

    expect(result.current).toBe('medium');
  });

  it('updates on resize', () => {
    window.innerWidth = 1200;

    const { result } = renderHook(() => useResponsiveSize());

    expect(result.current).toBe('large');

    act(() => {
      window.innerWidth = 800;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('medium');
  });
});

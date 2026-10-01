'use client';

import { useSyncExternalStore } from 'react';
import { BREAKPOINTS, type Breakpoint, type Responsive } from '@/types/globalTypes';

// Min widths from tokens/primitives/breakpoint.json, largest first.
const BREAKPOINT_QUERIES = [
  ['large', '(min-width: 1160px)'],
  ['medium', '(min-width: 768px)'],
] as const satisfies ReadonlyArray<readonly [Breakpoint, string]>;

const getBreakpoint = (): Breakpoint => {
  const match = BREAKPOINT_QUERIES.find(([, query]) => window.matchMedia(query).matches);

  return match ? match[0] : 'small';
};

// The server can't see the viewport, so it renders mobile-first and hydration catches up.
const getServerBreakpoint = (): Breakpoint => 'small';

const subscribe = (onChange: () => void) => {
  const mediaQueryLists = BREAKPOINT_QUERIES.map(([, query]) => window.matchMedia(query));

  mediaQueryLists.forEach((list) => list.addEventListener('change', onChange));

  return () => mediaQueryLists.forEach((list) => list.removeEventListener('change', onChange));
};

/** The current viewport breakpoint, updated as the viewport crosses one. */
export const useBreakpoint = (): Breakpoint =>
  useSyncExternalStore(subscribe, getBreakpoint, getServerBreakpoint);

const isBreakpointMap = <T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> =>
  typeof value === 'object' &&
  value !== null &&
  BREAKPOINTS.some((breakpoint) => breakpoint in value);

/**
 * Resolves a responsive value at a breakpoint: the value for the nearest key at or below it.
 * Returns `undefined` when no key applies (e.g. `{ medium: 'left' }` at `small`).
 */
export const resolveResponsive = <T>(
  value: Responsive<T> | undefined,
  breakpoint: Breakpoint
): T | undefined => {
  if (!isBreakpointMap(value)) return value;

  const applicable = BREAKPOINTS.slice(0, BREAKPOINTS.indexOf(breakpoint) + 1);

  return applicable.reduce<T | undefined>((resolved, key) => value[key] ?? resolved, undefined);
};

/**
 * Resolves a responsive prop at the current breakpoint. Breakpoints the prop doesn't cover use
 * `defaultValue`, which may itself be responsive.
 */
export const useResponsiveValue = <T>(
  value: Responsive<T> | undefined,
  defaultValue: Responsive<T>
): T => {
  const breakpoint = useBreakpoint();

  return (resolveResponsive(value, breakpoint) ?? resolveResponsive(defaultValue, breakpoint)) as T;
};

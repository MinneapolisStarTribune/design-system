import type { HTMLAttributes } from 'react';
import type { ComponentName } from '@/types/component-names';

/** Semantic heading level; maps to h1–h6 and typography class suffix. */
export type EditorialHeadingImportance = 1 | 2 | 3 | 4 | 5 | 6;

export interface EditorialHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children'> {
  importance: EditorialHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/**
 * Options for the editorial heading factory.
 * Used to create distinct heading components (NewsHeading, SponsoredHeading, etc.).
 */
export interface CreateEditorialHeadingOptions {
  /** Component name for React DevTools and brand validation. */
  componentName: ComponentName;
  /**
   * Class name segment (e.g. 'news', 'sponsored').
   * Produces classes: typography-editorial-{classNamePrefix}-h1 … h6.
   */
  classNamePrefix: string;
}

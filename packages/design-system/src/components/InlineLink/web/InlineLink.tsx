import React from 'react';
import { Link } from '@/components/Link/web/Link';
import type { InlineLinkProps } from '../InlineLink.types';

/**
 * Inline text link for use inside editorial, article body, sponsored, or utility typography.
 * Implemented as **`Link variant="inline"`** — inherits font from the parent; hover and visited
 * colors follow **`brand`** (Star Tribune vs Varsity).
 *
 * @example
 * ```tsx
 * <ArticleBodyText>
 *   See <InlineLink brand="startribune" href="/terms">terms of use</InlineLink> for details.
 * </ArticleBodyText>
 * ```
 */
export const InlineLink: React.FC<InlineLinkProps> = (props) => (
  <Link variant="inline" {...props} />
);

InlineLink.displayName = 'InlineLink';

export type { InlineLinkProps } from '../InlineLink.types';

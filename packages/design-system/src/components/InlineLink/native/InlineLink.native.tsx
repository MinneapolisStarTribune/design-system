import React from 'react';
import { Link, type NativeLinkInlineProps } from '@/components/Link/native/Link.native';

export type InlineLinkProps = Omit<NativeLinkInlineProps, 'variant'>;

export const InlineLink: React.FC<InlineLinkProps> = (props) => (
  <Link variant="inline" {...props} />
);

InlineLink.displayName = 'InlineLink';

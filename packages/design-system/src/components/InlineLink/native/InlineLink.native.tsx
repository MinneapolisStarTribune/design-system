import React from 'react';
import { Link, type LinkProps } from '@/components/Link/native/Link.native';

export type InlineLinkProps = Omit<Extract<LinkProps, { variant: 'inline' }>, 'variant'>;

export const InlineLink: React.FC<InlineLinkProps> = (props) => (
  <Link variant="inline" {...props} />
);

InlineLink.displayName = 'InlineLink';

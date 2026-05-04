import React from 'react';
import { Link, type InlineLinkProps } from '@/components/index.native';

export type { InlineLinkProps } from '@/components/Link/native/Link.native';

export const InlineLink: React.FC<InlineLinkProps> = (props) => <Link {...props} />;

InlineLink.displayName = 'InlineLink';

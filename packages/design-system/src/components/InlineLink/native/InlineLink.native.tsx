import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Link } from '@/components/Link/native/Link.native';
import type { LinkInlineProps } from '@/components/Link/Link.types';

type LinkOmit = 'as' | 'className' | 'href' | 'onClick' | 'variant';

export type InlineLinkProps = Omit<LinkInlineProps, LinkOmit> & {
  onPress?: (event: GestureResponderEvent) => void;
  testID?: string;
};

export const InlineLink: React.FC<InlineLinkProps> = (props) => (
  <Link variant="inline" {...props} />
);

InlineLink.displayName = 'InlineLink';
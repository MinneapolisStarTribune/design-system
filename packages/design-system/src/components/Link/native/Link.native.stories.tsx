import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';
import { ArrowRightIcon } from '@/icons';
import {
  INLINE_LINK_BRANDS,
  LINK_ICON_POSITIONS,
  LINK_SIZES,
  type InlineLinkBrand,
  type LinkIconPosition,
  type LinkSize,
} from '../Link.types';
import { Link } from './Link.native';

type LinkStoryArgs = {
  children?: string;
  variant?: 'utility' | 'inline';
  size?: LinkSize;
  disabled?: boolean;
  showIcon?: boolean;
  iconPosition?: LinkIconPosition;
  brand?: InlineLinkBrand;
  onPress?: () => void;
  dataTestId?: string;
  'aria-label'?: string;
};

const meta = {
  title: 'Actions/Link',
  component: Link as React.ComponentType<LinkStoryArgs>,
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'select', options: ['utility', 'inline'] },
    size: { control: 'select', options: [...LINK_SIZES] },
    disabled: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    iconPosition: { control: 'select', options: [...LINK_ICON_POSITIONS] },
    brand: { control: 'select', options: [...INLINE_LINK_BRANDS] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<LinkStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    children: 'Read more',
    variant: 'utility',
    size: 'medium',
    disabled: false,
    showIcon: false,
    iconPosition: 'end',
    brand: 'startribune',
  },

  render: (args) => {
    if (args.variant === 'inline') {
      return (
        <Link
          variant="inline"
          brand={args.brand ?? 'startribune'}
          disabled={args.disabled}
          onPress={args.onPress}
          dataTestId={args.dataTestId}
          aria-label={args['aria-label']}
        >
          {args.children ?? 'Read more'}
        </Link>
      );
    }

    return (
      <Link
        variant="utility"
        size={args.size ?? 'medium'}
        disabled={args.disabled}
        iconPosition={args.iconPosition ?? 'end'}
        icon={args.showIcon ? <ArrowRightIcon /> : undefined}
        onPress={args.onPress}
        dataTestId={args.dataTestId}
        aria-label={args['aria-label']}
      >
        {args.children ?? 'Read more'}
      </Link>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },

  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
      {LINK_SIZES.flatMap((size) =>
        LINK_ICON_POSITIONS.flatMap((iconPosition) =>
          [false, true].flatMap((disabled) => (
            <View
              key={`${size}-${iconPosition}-${disabled}`}
              style={{ width: 220, gap: 10, marginBottom: 20 }}
            >
              <Text style={{ fontSize: 12, opacity: 0.5 }}>
                {size} · icon {iconPosition} · {disabled ? 'disabled' : 'enabled'}
              </Text>

              {/* Utility */}
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 11, opacity: 0.4 }}>Utility</Text>
                <Link
                  variant="utility"
                  size={size}
                  disabled={disabled}
                  iconPosition={iconPosition}
                  icon={<ArrowRightIcon />}
                >
                  Read more
                </Link>
              </View>

              {/* Inline */}
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 11, opacity: 0.4 }}>Inline</Text>
                <Text style={{ fontSize: 16, lineHeight: 24 }}>
                  Read the{' '}
                  <Link variant="inline" brand="startribune" disabled={disabled}>
                    full article
                  </Link>{' '}
                  for details.
                </Text>
              </View>
            </View>
          ))
        )
      )}
    </View>
  ),
};

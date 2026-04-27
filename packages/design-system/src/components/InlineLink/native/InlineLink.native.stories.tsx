import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, Text, View } from 'react-native';
import { INLINE_LINK_BRANDS, type InlineLinkBrand } from '../InlineLink.types';
import {
  INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANTS,
  INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANT_LABELS,
  parseInlineLinkStorybookTypographyVariant,
  type InlineLinkStorybookTypographyVariant,
} from '../inlineLinkTypographyMatrix';
import { InlineLink } from './InlineLink.native';
import {
  ArticleBodySponsoredText,
  ArticleBodyText,
  EditorialSponsoredText,
  EditorialText,
  UtilityBody,
} from '@/index.native';

type InlineLinkStoryArgs = {
  children?: string;
  typographyVariant?: InlineLinkStorybookTypographyVariant;
  brand?: InlineLinkBrand;
  disabled?: boolean;
  onPress?: () => void;
  dataTestId?: string;
  'aria-label'?: string;
};

const meta = {
  title: 'Typography/InlineLink',
  component: InlineLink as React.ComponentType<InlineLinkStoryArgs>,
  argTypes: {
    children: { control: 'text' },
    typographyVariant: {
      name: 'Typography (parent + weight)',
      control: 'select',
      options: [...INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANTS],
      labels: INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANT_LABELS,
    },
    brand: { control: 'select', options: [...INLINE_LINK_BRANDS] },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<InlineLinkStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

function wrapInTypography(inner: React.ReactNode, variant: InlineLinkStorybookTypographyVariant) {
  const { parent, weight } = parseInlineLinkStorybookTypographyVariant(variant);

  switch (parent) {
    case 'articleBody':
      return (
        <ArticleBodyText weight={weight as React.ComponentProps<typeof ArticleBodyText>['weight']}>
          {inner}
        </ArticleBodyText>
      );
    case 'editorial':
      return (
        <EditorialText
          size="medium"
          weight={weight as React.ComponentProps<typeof EditorialText>['weight']}
        >
          {inner}
        </EditorialText>
      );
    case 'editorialSponsored':
      return (
        <EditorialSponsoredText
          size="medium"
          weight={weight as React.ComponentProps<typeof EditorialSponsoredText>['weight']}
        >
          {inner}
        </EditorialSponsoredText>
      );
    case 'articleBodySponsored':
      return (
        <ArticleBodySponsoredText
          weight={weight as React.ComponentProps<typeof ArticleBodySponsoredText>['weight']}
        >
          {inner}
        </ArticleBodySponsoredText>
      );
    case 'utility':
      return (
        <UtilityBody
          size="medium"
          weight={weight as React.ComponentProps<typeof UtilityBody>['weight']}
        >
          {inner}
        </UtilityBody>
      );
    default:
      return <ArticleBodyText>{inner}</ArticleBodyText>;
  }
}

export const Configurable: Story = {
  args: {
    children: 'inline link',
    typographyVariant: 'articleBody::regular',
    brand: 'startribune',
    disabled: false,
  },
  render: (args) => {
    const inner = (
      <>
        This sentence includes an{' '}
        <InlineLink
          brand={args.brand ?? 'startribune'}
          disabled={args.disabled}
          onPress={args.onPress}
          dataTestId={args.dataTestId}
          aria-label={args['aria-label']}
        >
          {args.children ?? 'inline link'}
        </InlineLink>{' '}
        inside running text.
      </>
    );

    return wrapInTypography(inner, args.typographyVariant ?? 'articleBody::regular');
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: [
        'children',
        'typographyVariant',
        'disabled',
      ],
    },
  },
  render: (_args) => (
    <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ gap: 14, padding: 16 }}>
      {INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANTS.map((variant) => (
        <View key={variant} style={{ gap: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.6 }}>
            {INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANT_LABELS[variant]}
          </Text>
          {wrapInTypography(
            <>
              Read the <InlineLink brand="startribune">full article</InlineLink> for details.
            </>,
            variant
          )}
        </View>
      ))}
    </ScrollView>
  ),
};

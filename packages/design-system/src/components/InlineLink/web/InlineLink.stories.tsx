import type { ComponentType, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodySponsoredText } from '@/components/Typography/ArticleBody/ArticleBodySponsoredText/web/ArticleBodySponsoredText';
import type { ArticleBodySponsoredTextWeight } from '@/components/Typography/ArticleBody/ArticleBodySponsoredText/ArticleBodySponsoredText.types';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';
import type { ArticleBodyTextWeight } from '@/components/Typography/ArticleBody/ArticleBodyText/ArticleBodyText.types';
import { EditorialSponsoredText } from '@/components/Typography/Editorial/EditorialSponsoredText/web/EditorialSponsoredText';
import type { EditorialSponsoredTextWeight } from '@/components/Typography/Editorial/EditorialSponsoredText/EditorialSponsoredText.types';
import { EditorialText } from '@/components/Typography/Editorial/EditorialText/web/EditorialText';
import type { EditorialTextWeight } from '@/components/Typography/Editorial/EditorialText/EditorialText.types';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/web/UtilityBody';
import type { UtilityBodyWeight } from '@/components/Typography/Utility/UtilityBody/UtilityBody.types';
import {
  INLINE_LINK_STORYBOOK_PREVIEW_HREF,
  INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANTS,
  INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANT_LABELS,
  parseInlineLinkStorybookTypographyVariant,
  type InlineLinkStorybookTypographyVariant,
} from '../inlineLinkTypographyMatrix';
import type { InlineLinkProps } from '../InlineLink.types';
import { InlineLink } from './InlineLink';
import { InlineLinkTypographyVariantShowcase } from './InlineLinkTypographyVariantShowcase';

const INLINE_LINK_PREVIEW_HREF = INLINE_LINK_STORYBOOK_PREVIEW_HREF;

type StoryArgs = InlineLinkProps & { typographyVariant: InlineLinkStorybookTypographyVariant };

const meta: Meta<StoryArgs> = {
  title: 'Typography/InlineLink',
  /** `typographyVariant` is story-only; `InlineLink` props match `InlineLinkProps`. */
  component: InlineLink as ComponentType<StoryArgs>,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Linked phrase (inherits font from the typography preset below)',
    },
    typographyVariant: {
      name: 'Typography (parent + weight)',
      control: 'select',
      options: [...INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANTS],
      labels: INLINE_LINK_STORYBOOK_TYPOGRAPHY_VARIANT_LABELS,
      description:
        'Parent component and **weight** (editorial + utility use **medium** size in this story). See **All variants** for every size × weight.',
    },
    brand: {
      control: false,
      description:
        'Palette for `color.link` (set per story in source). Use the Storybook **Brand** toolbar for theme CSS.',
    },
    href: {
      control: 'text',
      description:
        'Browsers match **:visited** when this exact URL is in history—common URLs (e.g. startribune.com) often look “always visited.” Use a unique URL or a private window to preview default/hover.',
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ConfigurableInner(props: InlineLinkProps) {
  return (
    <>
      This sentence includes an <InlineLink {...props} /> inside running text so font inherits
      correctly.
    </>
  );
}

function wrapConfigurable(inner: ReactNode, variant: InlineLinkStorybookTypographyVariant) {
  const { parent, weight } = parseInlineLinkStorybookTypographyVariant(variant);

  switch (parent) {
    case 'articleBody':
      return <ArticleBodyText weight={weight as ArticleBodyTextWeight}>{inner}</ArticleBodyText>;
    case 'editorial':
      return (
        <EditorialText size="medium" weight={weight as EditorialTextWeight}>
          {inner}
        </EditorialText>
      );
    case 'editorialSponsored':
      return (
        <EditorialSponsoredText size="medium" weight={weight as EditorialSponsoredTextWeight}>
          {inner}
        </EditorialSponsoredText>
      );
    case 'articleBodySponsored':
      return (
        <ArticleBodySponsoredText weight={weight as ArticleBodySponsoredTextWeight}>
          {inner}
        </ArticleBodySponsoredText>
      );
    case 'utility':
      return (
        <UtilityBody size="medium" weight={weight as UtilityBodyWeight}>
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
    brand: 'startribune',
    href: INLINE_LINK_PREVIEW_HREF,
    disabled: false,
    typographyVariant: 'articleBody::regular',
  },
  render: (args) => {
    const { typographyVariant, ...inlineProps } = args;
    const inner = <ConfigurableInner {...inlineProps} />;
    return wrapConfigurable(inner, typographyVariant);
  },
};

/**
 * Every **parent typography × size/weight** variant that supports **`InlineLink`**, with Figma-style captions.
 * See **`HOW_BRANDS_CHOOSE_INLINE_PARENT_TYPOGRAPHY`** and **`INLINE_LINK_TYPOGRAPHY_FAMILIES`** in `inlineLinkTypographyMatrix.ts`.
 */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Responsive **CSS grid** of the same `InlineLink` in each cell — **typography parents** only. **EditorialText** (12), **ArticleBodyText** (4), **EditorialSponsoredText** (12), **ArticleBodySponsoredText** (4), **UtilityBody** (18). Use the **Brand** / **theme** toolbar for `color.link`.',
      },
    },
  },
  render: () => <InlineLinkTypographyVariantShowcase brand="startribune" />,
};

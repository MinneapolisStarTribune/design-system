import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodySponsoredText } from '@/components/Typography/ArticleBody/ArticleBodySponsoredText/web/ArticleBodySponsoredText';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';
import { EditorialSponsoredText } from '@/components/Typography/Editorial/EditorialSponsoredText/web/EditorialSponsoredText';
import { EditorialText } from '@/components/Typography/Editorial/EditorialText/web/EditorialText';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/web/UtilityBody';
import { INLINE_LINK_STORYBOOK_PREVIEW_HREF } from '../inlineLinkTypographyMatrix';
import type { InlineLinkProps } from '../InlineLink.types';
import { InlineLink } from './InlineLink';
import { InlineLinkTypographyVariantShowcase } from './InlineLinkTypographyVariantShowcase';

const INLINE_LINK_PREVIEW_HREF = INLINE_LINK_STORYBOOK_PREVIEW_HREF;

const TYPOGRAPHY_PARENTS = [
  'articleBody',
  'editorial',
  'editorialSponsored',
  'articleBodySponsored',
  'utility',
] as const;

type TypographyParent = (typeof TYPOGRAPHY_PARENTS)[number];

type StoryArgs = InlineLinkProps & { typographyParent: TypographyParent };

const meta: Meta<StoryArgs> = {
  title: 'Typography/InlineLink',
  /** `typographyParent` is story-only; `InlineLink` props match `InlineLinkProps`. */
  component: InlineLink as ComponentType<StoryArgs>,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Linked phrase (inherits font from the typography parent below)',
    },
    typographyParent: {
      name: 'Typography parent',
      control: 'select',
      options: [...TYPOGRAPHY_PARENTS],
      labels: {
        articleBody: 'ArticleBodyText',
        editorial: 'EditorialText (medium, regular)',
        editorialSponsored: 'EditorialSponsoredText (medium, regular)',
        articleBodySponsored: 'ArticleBodySponsoredText (regular)',
        utility: 'UtilityBody (medium, regular)',
      },
      description:
        'Which **typography component** wraps the sentence — **`InlineLink`** inherits size/weight from it.',
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
      This sentence includes an <InlineLink {...props} /> inside running text so font inherits correctly.
    </>
  );
}

export const Configurable: Story = {
  args: {
    children: 'inline link',
    brand: 'startribune',
    href: INLINE_LINK_PREVIEW_HREF,
    disabled: false,
    typographyParent: 'articleBody',
  },
  render: (args) => {
    const { typographyParent, ...inlineProps } = args;
    const inner = <ConfigurableInner {...inlineProps} />;
    switch (typographyParent) {
      case 'articleBody':
        return <ArticleBodyText>{inner}</ArticleBodyText>;
      case 'editorial':
        return (
          <EditorialText size="medium" weight="regular">
            {inner}
          </EditorialText>
        );
      case 'editorialSponsored':
        return (
          <EditorialSponsoredText size="medium" weight="regular">
            {inner}
          </EditorialSponsoredText>
        );
      case 'articleBodySponsored':
        return <ArticleBodySponsoredText weight="regular">{inner}</ArticleBodySponsoredText>;
      case 'utility':
        return (
          <UtilityBody size="medium" weight="regular">
            {inner}
          </UtilityBody>
        );
      default:
        return <ArticleBodyText>{inner}</ArticleBodyText>;
    }
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

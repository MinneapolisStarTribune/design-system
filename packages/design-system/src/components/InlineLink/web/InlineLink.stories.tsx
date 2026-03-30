import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon } from '@/icons';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';
import { INLINE_LINK_STORYBOOK_PREVIEW_HREF } from '../inlineLinkTypographyMatrix';
import type { InlineLinkProps } from '../InlineLink.types';
import { InlineLink } from './InlineLink';
import { InlineLinkTypographyVariantShowcase } from './InlineLinkTypographyVariantShowcase';

const INLINE_LINK_PREVIEW_HREF = INLINE_LINK_STORYBOOK_PREVIEW_HREF;

type StoryArgs = InlineLinkProps & { showIcon: boolean };

const meta: Meta<StoryArgs> = {
  title: 'Typography/InlineLink',
  component: InlineLink,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description:
        'Link label (inherits typography from parent — **ArticleBodyText** in this story)',
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
    iconPosition: { control: 'select', options: ['start', 'end'] },
    showIcon: {
      control: 'boolean',
      description: 'Story helper: trailing ArrowRightIcon',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    children: 'inline link',
    brand: 'startribune',
    href: INLINE_LINK_PREVIEW_HREF,
    disabled: false,
    iconPosition: 'end',
    showIcon: false,
  },
  render: (args) => {
    const { showIcon, ...linkProps } = args;
    return (
      <ArticleBodyText>
        This sentence includes an{' '}
        <InlineLink {...linkProps} icon={showIcon ? <ArrowRightIcon /> : undefined} /> inside
        article body text so font inherits correctly.
      </ArticleBodyText>
    );
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading';
import { ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodySponsoredHeading.types';
import { TEXT_COLOR_TOKENS } from '@/types';

const meta = {
  title: 'Typography/ArticleBody/ArticleBodySponsoredHeading',
  component: ArticleBodySponsoredHeading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Article body sponsored heading (Star Tribune only). Use the **Brand** control in the toolbar-this component throws when used with Varsity.',
      },
    },
  },
  argTypes: {
    importance: {
      control: 'select',
      options: ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the HTML element (h1-h6) and the typography class.',
    },
    color: {
      control: 'select',
      options: Object.keys(TEXT_COLOR_TOKENS),
      description: 'Semantic text color token.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof ArticleBodySponsoredHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Article body sponsored heading example',
    color: 'on-light-primary',
  },
};

export const AllVariants: Story = {
  args: {
    importance: 1,
    children: '',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1.5rem 2rem',
        alignItems: 'start',
        width: '100%',
      }}
    >
      {ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <div
          key={level}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <ArticleBodySponsoredHeading importance={level}>
            ArticleBodySponsoredHeading importance={level} (h{level})
          </ArticleBodySponsoredHeading>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All six heading levels in one view for comparison. Article body sponsored headings use Barlow Condensed (Star Tribune only).',
      },
    },
  },
};

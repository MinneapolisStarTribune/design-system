import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading';
import type { ArticleBodySponsoredHeadingImportance } from './ArticleBodySponsoredHeading';

const importanceOptions: ArticleBodySponsoredHeadingImportance[] = [1, 2, 3, 4, 5, 6];

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleBodySponsoredHeading',
  component: ArticleBodySponsoredHeading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Article body sponsored heading (Star Tribune only). Use the **Brand** control in the toolbar—this component throws when used with Varsity.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: importanceOptions,
      description:
        'Semantic heading level (1–6). Controls both the HTML element (h1–h6) and the typography class.',
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
  },
};

export const AllVariants: Story = {
  args: {
    importance: 1,
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(importanceOptions as ArticleBodySponsoredHeadingImportance[]).map((level) => (
        <ArticleBodySponsoredHeading key={level} importance={level}>
          ArticleBodySponsoredHeading importance={level} (h{level})
        </ArticleBodySponsoredHeading>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All six heading levels in one view for comparison. Article body sponsored headings use Barlow Condensed (Star Tribune only).',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodyHeading } from './ArticleBodyHeading';
import { ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodyHeading.types';
const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleBodyHeading',
  component: ArticleBodyHeading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Article body heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1–6). Controls both the HTML element (h1–h6) and the typography class.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof ArticleBodyHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Article Body Heading',
  },
};

export const AllLevels: Story = {
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
      {ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS.map((level) => (
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
          <ArticleBodyHeading importance={level}>
            ArticleBodyHeading importance={level} (h{level})
          </ArticleBodyHeading>
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
          'All six heading levels in one view for comparison. Switch **Brand** in the toolbar to see different fonts.',
      },
    },
  },
};

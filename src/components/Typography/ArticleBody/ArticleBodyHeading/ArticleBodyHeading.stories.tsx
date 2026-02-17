import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodyHeading } from './ArticleBodyHeading';
import type { ArticleBodyHeadingImportance } from './ArticleBodyHeading';

const importanceOptions: ArticleBodyHeadingImportance[] = [1, 2, 3, 4, 5, 6];

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
      options: importanceOptions,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(importanceOptions as ArticleBodyHeadingImportance[]).map((level) => (
        <ArticleBodyHeading key={level} importance={level}>
          ArticleBodyHeading importance={level} (h{level})
        </ArticleBodyHeading>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All six heading levels in one view for comparison. Switch **Brand** in the toolbar to see different fonts.',
      },
    },
  },
};

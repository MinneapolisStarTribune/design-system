import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleQuote } from './ArticleQuote';
import type { ArticleQuoteSize } from '../ArticleQuote.types';

const articleQuoteSizes: ArticleQuoteSize[] = ['small', 'large'];

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleQuote',
  component: ArticleQuote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: articleQuoteSizes,
      description: 'Size variant - small or large',
    },
    children: {
      control: 'text',
      description: 'The quoted content',
    },
  },
} satisfies Meta<typeof ArticleQuote>;

export default meta;

type Story = StoryObj<typeof ArticleQuote>;

export const Configurable: Story = {
  args: {
    size: 'large',
    children: 'Highlight key statements or examples within an article.',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '600px',
      }}
    >
      {articleQuoteSizes.map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#666',
            }}
          >
            {size}
          </span>
          <ArticleQuote size={size}>
            Article quote in {size} size — highlights key statements with visual emphasis.
          </ArticleQuote>
        </div>
      ))}
    </div>
  ),
};

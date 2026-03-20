import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodyText } from './ArticleBodyText';
import { ARTICLE_BODY_TEXT_WEIGHTS } from '../ArticleBodyText.types';

const meta = {
  title: 'Typography/ArticleBody/ArticleBodyText',
  component: ArticleBodyText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    weight: {
      control: 'select',
      options: ARTICLE_BODY_TEXT_WEIGHTS,
      description: 'The font weight of the article body text',
    },
    children: {
      control: 'text',
      description: 'The content of the article body text',
    },
  },
} satisfies Meta<typeof ArticleBodyText>;

export default meta;

type Story = StoryObj<typeof ArticleBodyText>;

export const Configurable: Story = {
  args: {
    weight: 'regular',
    children: 'Article body text',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    weight: 'regular',
    children: 'Article body text',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {ARTICLE_BODY_TEXT_WEIGHTS.map((weight) => (
        <div key={weight} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ArticleBodyText weight={weight}>Article body text - {weight}</ArticleBodyText>
        </div>
      ))}
    </div>
  ),
};

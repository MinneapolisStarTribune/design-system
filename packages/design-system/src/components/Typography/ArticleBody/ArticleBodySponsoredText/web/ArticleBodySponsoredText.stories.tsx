import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText';
import { ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS } from '../ArticleBodySponsoredText.types';
import { TEXT_COLOR_TOKENS } from '@/types';

const meta = {
  title: 'Typography/ArticleBody/ArticleBodySponsoredText',
  component: ArticleBodySponsoredText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    weight: {
      control: 'select',
      options: ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS,
      description: 'The font weight of the article body sponsored text',
    },
    color: {
      control: 'select',
      options: Object.keys(TEXT_COLOR_TOKENS),
      description:
        'Semantic color token. Use on-light-* for light backgrounds and on-dark-* for dark backgrounds. Brand and state tokens are also available.',
    },
    children: {
      control: 'text',
      description: 'The content of the article body sponsored text',
    },
  },
} satisfies Meta<typeof ArticleBodySponsoredText>;

export default meta;

type Story = StoryObj<typeof ArticleBodySponsoredText>;

export const Configurable: Story = {
  args: {
    weight: 'regular',
    children: 'Article body sponsored text',
    color: 'on-light-primary',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    weight: 'regular',
    children: 'Article body sponsored text',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS.map((weight) => (
        <div key={weight} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ArticleBodySponsoredText weight={weight}>
            Article body sponsored text - {weight}
          </ArticleBodySponsoredText>
        </div>
      ))}
    </div>
  ),
};

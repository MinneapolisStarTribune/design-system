import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodyText } from './ArticleBodyText';
import { ARTICLE_BODY_TEXT_WEIGHTS } from '../ArticleBodyText.types';
import { TEXT_COLOR_TOKENS } from '@/types';

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
    color: {
      control: 'select',
      options: Object.keys(TEXT_COLOR_TOKENS),
      description:
        'Semantic color token. Use on-light-* for light backgrounds and on-dark-* for dark backgrounds. Brand and state tokens are also available.',
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
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '600px',
      }}
    >
      {ARTICLE_BODY_TEXT_WEIGHTS.map((weight) => (
        <div key={weight} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontFamily: 'sans-serif',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {weight}
          </h3>
          <ArticleBodyText weight={weight}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Mauris rhoncus aenean vel elit scelerisque
            mauris pellentesque. Ut eu sem integer vitae justo eget. Amet consectetur adipiscing
            elit ut. Erat nam at lectus urna duis. Nisi vitae suscipit tellus mauris a diam maecenas
            sed. Sed sed risus pretium quam vulputate. Mi bibendum neque egestas congue quisque
            egestas diam.
          </ArticleBodyText>
        </div>
      ))}
    </div>
  ),
};

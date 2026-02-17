import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText';

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleBodySponsoredText',
  component: ArticleBodySponsoredText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    weight: {
      control: 'select',
      options: ['regular', 'italic', 'semibold', 'semibold-italic'],
      description: 'The font weight of the article body sponsored text',
    },
    children: {
      control: 'text',
      description: 'The content of the article body sponsored text',
    },
  },
} satisfies Meta<typeof ArticleBodySponsoredText>;

export default meta;

type Story = StoryObj<typeof ArticleBodySponsoredText>;

export const Default: Story = {
  args: {
    weight: 'regular',
    children: 'Article body sponsored text',
  },
};

export const Regular: Story = {
  args: {
    weight: 'regular',
    children: 'Article body sponsored text',
  },
};

export const Italic: Story = {
  args: {
    weight: 'italic',
    children: 'Article body sponsored text',
  },
};

export const Semibold: Story = {
  args: {
    weight: 'semibold',
    children: 'Article body sponsored text',
  },
};

export const SemiboldItalic: Story = {
  args: {
    weight: 'semibold-italic',
    children: 'Article body sponsored text',
  },
};

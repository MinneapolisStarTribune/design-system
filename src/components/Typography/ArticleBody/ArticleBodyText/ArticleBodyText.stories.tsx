import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleBodyText } from './ArticleBodyText';
import { FONT_WEIGHT_STYLE } from '../../../../types/globalTypes';

const meta = {
  title: 'Foundations/Typography/ArticleBody/ArticleBodyText',
  component: ArticleBodyText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    weight: {
      control: 'select',
      options: FONT_WEIGHT_STYLE,
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

export const Default: Story = {
  args: {
    weight: 'regular',
    children: 'Article body text',
  },
};

export const Regular: Story = {
  args: {
    weight: 'regular',
    children: 'Article body text',
  },
};

export const Italic: Story = {
  args: {
    weight: 'italic',
    children: 'Article body text',
  },
};

export const Bold: Story = {
  args: {
    weight: 'bold',
    children: 'Article body text',
  },
};

export const BoldItalic: Story = {
  args: {
    weight: 'bold-italic',
    children: 'Article body text',
  },
};

export const Dropcap: Story = {
  args: {
    weight: 'dropcap',
    children: 'Article body text',
  },
};

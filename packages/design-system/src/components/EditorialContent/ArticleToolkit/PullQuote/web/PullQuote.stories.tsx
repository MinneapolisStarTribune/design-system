import type { Meta, StoryObj } from '@storybook/react-vite';
import { PullQuoteProps } from '../PullQuote.types';
import { PullQuote } from './PullQuote';

const meta: Meta<PullQuoteProps> = {
  title: 'Editorial Content/Article Toolkit/Pull Quote',
  component: PullQuote,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    quote: {
      control: 'text',
      description: 'The quote text to be displayed in the pull quote.',
    },
    attribution: {
      control: 'text',
      description: 'The name of the person being quoted.',
    },
    jobTitle: {
      control: 'text',
      description: 'The job title of the person being quoted.',
    },
    isLongQuote: {
      control: 'boolean',
      description: 'Indicates if the quote is long, which may affect styling.',
    },
  },
};

export default meta;

type Story = StoryObj<PullQuoteProps>;

export const Configurable: Story = {
  args: {
    quote: 'I still believe jurors can do the right thing and justice can be served.',
    attribution: 'Gov. Tim Walz',
    jobTitle: 'Governor, Minnesota',
    align: 'left',
  },
};

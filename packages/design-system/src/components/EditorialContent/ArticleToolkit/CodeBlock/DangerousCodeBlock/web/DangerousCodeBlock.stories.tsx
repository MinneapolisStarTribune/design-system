import type { Meta, StoryObj } from '@storybook/react-vite';
import { DangerousCodeBlock } from './DangerousCodeBlock';

const meta: Meta<typeof DangerousCodeBlock> = {
  title: 'EditorialContent/ArticleToolkit/CodeBlock/DangerousCodeBlock',
  component: DangerousCodeBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['standard', 'immersive'],
      description: 'Layout variant of the code block',
    },
    cleanQuotes: {
      control: 'boolean',
      description: 'Replace smart quotes in markup',
    },
    markup: {
      control: 'text',
      description: 'Raw HTML markup injected into the DOM',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DangerousCodeBlock>;

const baseMarkup = `
<div style="padding:24px;border:1px solid #ccc;background:#fafafa">
  <h3>Example Embed</h3>
  <p>“Smart quotes” copied from an external embed.</p>
</div>
`;

const scriptMarkup = `
<div id="dangerous-code-block-counter">Counter: 0</div>
<script>
  const el = document.getElementById("dangerous-code-block-counter");
  let count = 0;
  setInterval(() => {
    count++;
    el.innerText = "Counter: " + count;
  }, 1000);
</script>
`;

export const Configurable: Story = {
  args: {
    markup: baseMarkup,
    variant: 'standard',
    cleanQuotes: true,
  },
};

export const StandardVariant: Story = {
  args: {
    markup: baseMarkup,
    variant: 'standard',
    cleanQuotes: true,
  },
};

export const ImmersiveVariant: Story = {
  args: {
    markup: baseMarkup,
    variant: 'immersive',
    cleanQuotes: true,
  },
};

export const ScriptExecution: Story = {
  args: {
    markup: scriptMarkup,
    variant: 'standard',
    cleanQuotes: true,
  },
};

export const QuoteCleaningEnabled: Story = {
  args: {
    markup: baseMarkup,
    variant: 'standard',
    cleanQuotes: true,
  },
};

export const QuoteCleaningDisabled: Story = {
  args: {
    markup: baseMarkup,
    variant: 'standard',
    cleanQuotes: false,
  },
};

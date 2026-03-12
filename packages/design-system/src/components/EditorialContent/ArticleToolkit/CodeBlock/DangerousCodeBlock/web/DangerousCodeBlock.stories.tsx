import type { Meta, StoryObj } from '@storybook/react-vite';
import { DangerousCodeBlock } from './DangerousCodeBlock';
import { DangerousCodeBlockProps } from '../DangerousCodeBlock.types';

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
      description: 'Replace smart quotes in the markup',
    },
    markup: {
      control: 'text',
      description: 'Raw HTML markup injected into the DOM',
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the code block',
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

const createArgs = (
  variant: DangerousCodeBlockProps['variant'],
  size: DangerousCodeBlockProps['size']
) => ({
  markup: baseMarkup,
  variant,
  size,
  cleanQuotes: false,
});

export const Configurable: Story = {
  args: createArgs('standard', 'full'),
};

export const StandardFull: Story = { args: createArgs('standard', 'full') };
export const StandardLarge: Story = { args: createArgs('standard', 'large') };
export const StandardMedium: Story = { args: createArgs('standard', 'medium') };
export const StandardInline: Story = { args: createArgs('standard', 'inline') };

export const ImmersiveFull: Story = { args: createArgs('immersive', 'full') };
export const ImmersiveLarge: Story = { args: createArgs('immersive', 'large') };
export const ImmersiveMedium: Story = { args: createArgs('immersive', 'medium') };
export const ImmersiveInline: Story = { args: createArgs('immersive', 'inline') };

export const WithScript: Story = {
  args: {
    markup: scriptMarkup,
    variant: 'standard',
    size: 'full',
  },
};

export const WithoutQuoteCleaning: Story = {
  args: {
    ...createArgs('standard', 'full'),
    cleanQuotes: false,
  },
};

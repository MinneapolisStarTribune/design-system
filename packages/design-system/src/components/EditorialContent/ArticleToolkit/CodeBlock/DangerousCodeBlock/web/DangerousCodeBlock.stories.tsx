import type { Meta, StoryObj } from '@storybook/react-vite';
import { DangerousCodeBlock } from './DangerousCodeBlock';
import type { DangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import { CODE_BLOCK_SIZES } from '../../../types';

const meta: Meta<typeof DangerousCodeBlock> = {
  title: 'EditorialContent/ArticleToolkit/CodeBlock/DangerousCodeBlock',
  component: DangerousCodeBlock,
  parameters: { layout: 'fullscreen' },
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
      control: { type: 'select' },
      options: CODE_BLOCK_SIZES,
      description: 'Size of the code block',
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

const createArgs = (
  variant: DangerousCodeBlockProps['variant'],
  size: DangerousCodeBlockProps['size'],
  cleanQuotes = true
) => ({ markup: baseMarkup, variant, size, cleanQuotes });

const renderVariantWithSizes = (variant: DangerousCodeBlockProps['variant']) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {CODE_BLOCK_SIZES.map((size) => (
      <div
        key={`${variant}-${size}`}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <h3
          style={{
            textTransform: 'capitalize',
            textAlign: 'center',
          }}
        >
          {size}
        </h3>
        <DangerousCodeBlock {...createArgs(variant, size, false)} />
      </div>
    ))}
  </div>
);

// Stories
export const Configurable: Story = { args: createArgs('standard', 'full') };
export const Standard: Story = { render: () => renderVariantWithSizes('standard') };
export const Immersive: Story = { render: () => renderVariantWithSizes('immersive') };

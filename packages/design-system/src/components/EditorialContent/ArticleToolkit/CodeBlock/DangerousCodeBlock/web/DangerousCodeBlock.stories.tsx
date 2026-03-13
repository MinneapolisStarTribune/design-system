import type { Meta, StoryObj } from '@storybook/react-vite';
import { DangerousCodeBlock } from './DangerousCodeBlock';
import type { DangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import { CODE_BLOCK_SIZES, ARTICLE_BODY_VARIANTS } from '../../../types';

const meta: Meta<typeof DangerousCodeBlock> = {
  title: 'EditorialContent/ArticleToolkit/CodeBlock/DangerousCodeBlock',
  component: DangerousCodeBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: [ARTICLE_BODY_VARIANTS.STANDARD, ARTICLE_BODY_VARIANTS.IMMERSIVE],
      description: 'Layout variant of the code block',
    },
    size: {
      control: { type: 'select' },
      options: CODE_BLOCK_SIZES,
      description: 'Size variant of the code block',
    },
    cleanQuotes: {
      control: 'boolean',
      description: 'Whether to clean smart quotes in the markup',
    },
    markup: {
      control: 'text',
      description: 'Raw HTML markup injected into the DOM',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DangerousCodeBlock>;

// Sample markup for regular code blocks (with smart quotes cleaned)
const dangerousCodeBlockMarkup = `
  <div style="padding: 20px; background-color: #e3f2fd; border: 2px solid #2196F3; border-radius: 8px; width: 100%;">
    <h3>Enhanced Code Block</h3>
    <p>This is an enhanced code block with sizing options.</p>
    <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 24px;">
      Interactive Content Area
    </div>
    <script>
      console.log('Enhanced code block initialized');
    </script>
  </div>
`;

const createArgs = (
  variant: DangerousCodeBlockProps['variant'],
  size: DangerousCodeBlockProps['size'],
  cleanQuotes = true
) => ({
  markup: dangerousCodeBlockMarkup,
  variant,
  size,
  cleanQuotes,
});

const renderVariantWithSizes = (variant: DangerousCodeBlockProps['variant']) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '48px 0' }}>
    {CODE_BLOCK_SIZES.map((size) => (
      <div key={`${variant}-${size}`}>
        <h3
          style={{
            textTransform: 'capitalize',
            textAlign: 'center',
            marginBottom: '16px',
            fontFamily: 'sans-serif',
            color: '#333',
          }}
        >
          {size} Size Widget
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

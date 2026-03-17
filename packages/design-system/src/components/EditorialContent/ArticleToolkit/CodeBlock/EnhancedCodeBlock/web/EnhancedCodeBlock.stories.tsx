import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnhancedCodeBlock } from './EnhancedCodeBlock';
import type { EnhancedCodeBlockProps } from '../EnhancedCodeBlock.types';
import { CODE_BLOCK_SIZES, ARTICLE_BODY_VARIANTS } from '../../../types';

const meta: Meta<typeof EnhancedCodeBlock> = {
  title: 'Editorial Content/Article Toolkit/Code Block/Enhanced Code Block',
  component: EnhancedCodeBlock,
  tags: ['autodocs'],
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

type Story = StoryObj<typeof EnhancedCodeBlock>;

// Sample markup for enhanced code blocks (no quote cleaning)
const enhancedCodeBlockMarkup = `
  <div style="padding: 20px; background-color: #e3f2fd; border: 2px solid #2196F3; border-radius: 8px; width: 100%;">
    <h3 class="typography-article-body-h3">Enhanced Code Block</h3>
    <p class="typography-editorial-text-regular-medium">This is an enhanced code block with sizing options.</p>
    <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;" class="typography-editorial-text-regular-medium">
      Interactive Content Area
    </div>
    <script>
      console.log('Enhanced code block initialized');
    </script>
  </div>
`;

const createArgs = (
  variant: EnhancedCodeBlockProps['variant'],
  size: EnhancedCodeBlockProps['size'],
  cleanQuotes = false
) => ({
  markup: enhancedCodeBlockMarkup,
  variant,
  size,
  cleanQuotes,
});

const renderVariantWithSizes = (variant: EnhancedCodeBlockProps['variant']) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '48px 0' }}>
    {CODE_BLOCK_SIZES.map((size) => (
      <div key={`${variant}-${size}`}>
        <h3 className="typography-article-body-h3" style={{ textTransform: 'capitalize' }}>
          {size}
        </h3>
        <EnhancedCodeBlock {...createArgs(variant, size, false)} />
      </div>
    ))}
  </div>
);

// Stories
export const Configurable: Story = { args: createArgs('standard', 'full') };
export const Standard: Story = { render: () => renderVariantWithSizes('standard') };
export const Immersive: Story = { render: () => renderVariantWithSizes('immersive') };

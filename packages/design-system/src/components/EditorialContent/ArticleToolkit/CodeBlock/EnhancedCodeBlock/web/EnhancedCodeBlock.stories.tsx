import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnhancedCodeBlock } from './EnhancedCodeBlock';
import type { EnhancedCodeBlockProps } from '../EnhancedCodeBlock.types';
import {
  CODE_BLOCK_SIZES,
  ARTICLE_BODY_VARIANTS,
  type ArticleBodyVariant,
  type CodeBlockSizeType,
} from '../../../types';

const meta: Meta<typeof EnhancedCodeBlock> = {
  title: 'Editorial Content/Article Toolkit/Code Block/Enhanced Code Block',
  component: EnhancedCodeBlock,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  args: {
    variant: 'standard',
    size: 'full',
    cleanQuotes: false,
    markup: '',
    className: undefined,
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
      type: { name: 'enum', value: [...CODE_BLOCK_SIZES] },
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
    className: {
      control: 'text',
      description: 'Custom CSS class names for styling',
      table: { disable: false },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EnhancedCodeBlock>;

// Sample markup for enhanced code blocks (no quote cleaning)
const enhancedCodeBlockMarkup = (size: EnhancedCodeBlockProps['size']) => {
  return `
  <div style="padding: 20px; background-color: #e3f2fd; border: 2px solid #2196F3; border-radius: 8px; width: 100%;">
    <h3 class="typography-article-body-h3">Enhanced Code Block <span style="text-transform: capitalize;">(${size})</span></h3>
    <p class="typography-editorial-text-regular-medium">This is an enhanced code block with sizing options.</p>
    <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: #1a1a1a; color: white;" class="typography-editorial-text-regular-medium">
      Interactive Content Area
    </div>
  </div>
`;
};

const createArgs = (variant: ArticleBodyVariant, size: CodeBlockSizeType, cleanQuotes = false) => ({
  markup: enhancedCodeBlockMarkup(size),
  variant,
  size,
  cleanQuotes,
});

const renderVariantWithSizes: Story['render'] = (args) => {
  const { variant = 'standard', size = 'full', cleanQuotes = false } = args;
  return (
    <div style={{ padding: '48px 0' }}>
      <EnhancedCodeBlock {...createArgs(variant, size, cleanQuotes)} />
    </div>
  );
};

// Stories
export const Configurable: Story = { args: createArgs('standard', 'full') };
export const Standard: Story = {
  args: { variant: 'standard' },
  render: renderVariantWithSizes,
};
export const Immersive: Story = {
  args: { variant: 'immersive' },
  render: renderVariantWithSizes,
};

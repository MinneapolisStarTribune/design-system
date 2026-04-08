import type { Meta, StoryObj } from '@storybook/react-vite';
import { DangerousCodeBlock } from './DangerousCodeBlock';
import { ARTICLE_BODY_VARIANTS } from '../../../types';

const meta: Meta<typeof DangerousCodeBlock> = {
  title: 'Editorial Content/Article Toolkit/Code Block/Dangerous Code Block',
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
    <h3 class="typography-article-body-h3">“Dangerous Code Block”</h3>
    <p class="typography-editorial-text-regular-medium">This example renders raw ‘HTML’ and executes scripts.</p>
    <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 24px;">
      Interactive Content Area
    </div>
    <script>
      console.log('Dangerous code block initialized');
    </script>
  </div>
`;

// Stories
export const Configurable: Story = {
  args: {
    markup: dangerousCodeBlockMarkup,
    variant: 'standard',
    cleanQuotes: true,
  },
};

export const AllVariants: Story = {
  render: (args) => {
    const cases = [
      {
        title: 'Standard',
        props: { variant: 'standard' as const },
      },
      {
        title: 'Immersive',
        props: { variant: 'immersive' as const },
      },
    ];

    return (
      <div style={{ display: 'grid', gap: '48px', padding: '48px 0' }}>
        {cases.map(({ title, props }) => (
          <div key={title}>
            <h3 className="typography-article-body-h3">{title}</h3>

            <DangerousCodeBlock
              {...args}
              {...props}
              markup={dangerousCodeBlockMarkup}
            />
          </div>
        ))}
      </div>
    );
  },
  args: {
    markup: dangerousCodeBlockMarkup,
    variant: 'standard',
    cleanQuotes: true,
  },
};

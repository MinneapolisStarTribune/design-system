import type { Meta, StoryObj } from '@storybook/react-vite';
import { OpinionHeading } from './OpinionHeading';
import { OPINION_HEADING_IMPORTANCE_LEVELS } from '../OpinionHeading.types';

const meta = {
  title: 'Typography/Editorial/OpinionHeading',
  component: OpinionHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial opinion heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  argTypes: {
    importance: {
      control: 'select',
      options: OPINION_HEADING_IMPORTANCE_LEVELS,
      description:
        'Semantic heading level (1-6). Controls both the HTML element (h1-h6) and the typography class.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof OpinionHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Opinion heading example',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All six heading levels in one view for comparison. Switch **Brand** in the toolbar to see different fonts.',
      },
    },
  },
  args: {
    importance: 1,
    children: '',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1.5rem 2rem',
        alignItems: 'start',
        width: '100%',
      }}
    >
      {OPINION_HEADING_IMPORTANCE_LEVELS.map((level) => (
        <div
          key={level}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <OpinionHeading importance={level}>Opinion Heading - h{level}</OpinionHeading>
        </div>
      ))}
    </div>
  ),
};

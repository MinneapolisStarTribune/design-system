import type { Meta, StoryObj } from '@storybook/react-vite';
import { NonNewsHeading } from './NonNewsHeading';
import { NewsHeadingImportance } from '../../NewsHeading/NewsHeading';

const importanceOptions: NewsHeadingImportance[] = [1, 2, 3, 4, 5, 6];

const meta = {
  title: 'Foundations/Typography/Editorial/NonNewsHeading',
  component: NonNewsHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Non-editorial heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: importanceOptions,
      description:
        'Semantic heading level (1–6). Controls both the HTML element (h1–h6) and the typography class.',
    },
    children: {
      control: 'text',
      description: 'Heading text.',
    },
  },
} satisfies Meta<typeof NonNewsHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Non-news heading example',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(importanceOptions as NewsHeadingImportance[]).map((level) => (
        <div key={level} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>NonNewsHeading h{level}</span>
          <NonNewsHeading importance={level}>NonNewsHeading h{level}</NonNewsHeading>
        </div>
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewsHeading } from '../../../../components/Typography/NewsHeading/NewsHeading';
import type { NewsHeadingImportance } from '../../../../components/Typography/NewsHeading/NewsHeading';

const importanceOptions: NewsHeadingImportance[] = [1, 2, 3, 4, 5, 6];

const meta = {
  title: 'Foundations/Typography/Editorial/NewsHeading',
  component: NewsHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial news heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
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
} satisfies Meta<typeof NewsHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    importance: 1,
    children: 'News heading example',
  },
};

export const AllLevels: Story = {
  args: {
    importance: 1,
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(importanceOptions as NewsHeadingImportance[]).map((level) => (
        <NewsHeading key={level} importance={level}>
          NewsHeading importance={level} (h{level})
        </NewsHeading>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All six heading levels in one view for comparison. Switch **Brand** in the toolbar to see different fonts.',
      },
    },
  },
};

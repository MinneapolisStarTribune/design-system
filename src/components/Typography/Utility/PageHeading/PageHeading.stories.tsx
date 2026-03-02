import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeading } from './PageHeading';

const meta = {
  title: 'Foundations/Typography/PageHeading',
  component: PageHeading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'Heading level (1–4), maps to h1–h4',
    },
    children: {
      control: 'text',
      description: 'Heading text',
    },
  },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Page Heading',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    importance: 1,
    children: 'Page Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3, 4].map((importance) => (
        <div key={importance} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Page H{importance}</span>
          <PageHeading importance={importance as 1 | 2 | 3 | 4}>
            Page H{importance} Heading
          </PageHeading>
        </div>
      ))}
    </div>
  ),
};

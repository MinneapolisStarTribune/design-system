import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeading } from './PageHeading';
import { PAGE_HEADING_IMPORTANCE_LEVELS } from '../PageHeading.types';
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
      options: PAGE_HEADING_IMPORTANCE_LEVELS,
      description: 'Heading level (1-4), maps to h1-h4',
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
    layout: 'fullscreen',
  },
  args: {
    importance: 1,
    children: 'Page Heading',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '1.5rem 2rem',
        alignItems: 'start',
        width: '100%',
      }}
    >
      {PAGE_HEADING_IMPORTANCE_LEVELS.map((importance) => (
        <div
          key={importance}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <PageHeading importance={importance}>Page - H{importance} Heading</PageHeading>
        </div>
      ))}
    </div>
  ),
};

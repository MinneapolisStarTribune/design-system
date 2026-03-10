import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading } from './SectionHeading';
import { SECTION_HEADING_IMPORTANCE_LEVELS } from '../SectionHeading.types';

const meta = {
  title: 'Foundations/Typography/Utility/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: SECTION_HEADING_IMPORTANCE_LEVELS,
      description: 'Heading level (1-6), maps to h1-h6',
    },
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    importance: 1,
    children: 'Section Heading',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  args: {
    importance: 2,
    children: 'Heading',
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
      {SECTION_HEADING_IMPORTANCE_LEVELS.map((importance) => (
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
          <SectionHeading importance={importance}>Section - H{importance} Heading</SectionHeading>
        </div>
      ))}
    </div>
  ),
};

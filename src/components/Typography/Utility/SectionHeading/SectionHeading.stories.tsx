import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading } from './SectionHeading';

const meta = {
  title: 'Foundations/Typography/Utility/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
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
  },
  args: {
    importance: 2,
    children: 'Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3, 4, 5, 6].map((importance) => (
        <div key={importance} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Heading {importance}</span>
          <SectionHeading importance={importance as 1 | 2 | 3 | 4 | 5 | 6}>
            Heading {importance}
          </SectionHeading>
        </div>
      ))}
    </div>
  ),
};

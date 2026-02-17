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

export const Playground: Story = {
  args: {
    importance: 1,
    children: 'Section Heading',
  },
};

export const AllLevels: Story = {
  args: {
    importance: 2,
    children: 'Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SectionHeading importance={1}>Heading 1</SectionHeading>
      <SectionHeading importance={2}>Heading 2</SectionHeading>
      <SectionHeading importance={3}>Heading 3</SectionHeading>
      <SectionHeading importance={4}>Heading 4</SectionHeading>
      <SectionHeading importance={5}>Heading 5</SectionHeading>
      <SectionHeading importance={6}>Heading 6</SectionHeading>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityHeading } from './UtilityHeading';

const meta = {
  title: 'Foundations/Typography/Utility/UtilityHeading',
  component: UtilityHeading,
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
  },
} satisfies Meta<typeof UtilityHeading>;

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
      <UtilityHeading importance={1}>Heading 1</UtilityHeading>
      <UtilityHeading importance={2}>Heading 2</UtilityHeading>
      <UtilityHeading importance={3}>Heading 3</UtilityHeading>
      <UtilityHeading importance={4}>Heading 4</UtilityHeading>
      <UtilityHeading importance={5}>Heading 5</UtilityHeading>
      <UtilityHeading importance={6}>Heading 6</UtilityHeading>
    </div>
  ),
};

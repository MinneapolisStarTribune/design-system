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

export const ConfigurableHeading: Story = {
  args: {
    importance: 1,
    children: 'Page Heading',
  },
};

export const AllImportanceLevels: Story = {
  args: {
    importance: 1,
    children: 'Page Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PageHeading importance={1}>Page H1 Heading</PageHeading>
      <PageHeading importance={2}>Page H2 Heading</PageHeading>
      <PageHeading importance={3}>Page H3 Heading</PageHeading>
      <PageHeading importance={4}>Page H4 Heading</PageHeading>
    </div>
  ),
};

export const PageHeadings: Story = {
  args: {
    importance: 1,
    children: 'Page Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PageHeading importance={1}>Page H1</PageHeading>
      <PageHeading importance={2}>Page H2</PageHeading>
      <PageHeading importance={3}>Page H3</PageHeading>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    importance: 1,
    children: 'Heading with custom class',
    className: 'custom-heading-class',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityHeading } from './UtilityHeading';

const meta = {
  title: 'Foundations/Typography/Utility/UtilityHeading',
  component: UtilityHeading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    importance: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Heading level (1–6), maps to h1–h6',
    },
    headingType: {
      control: 'select',
      options: ['section', 'page'],
      description: 'Typography variant: section or page',
    },
    children: {
      control: 'text',
      description: 'Heading text',
    },
  },
} satisfies Meta<typeof UtilityHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfigurableHeading: Story = {
  args: {
    importance: 1,
    headingType: 'page',
    children: 'Utility Heading',
  },
};

export const AllImportanceLevels: Story = {
  args: {
    importance: 1,
    headingType: 'page',
    children: 'Utility Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <UtilityHeading importance={1} headingType="page">
        Page H1 Heading
      </UtilityHeading>
      <UtilityHeading importance={2} headingType="page">
        Page H2 Heading
      </UtilityHeading>
      <UtilityHeading importance={3} headingType="page">
        Page H3 Heading
      </UtilityHeading>
      <UtilityHeading importance={4} headingType="page">
        Page H4 Heading
      </UtilityHeading>
      <UtilityHeading importance={5} headingType="page">
        Page H5 Heading
      </UtilityHeading>
      <UtilityHeading importance={6} headingType="page">
        Page H6 Heading
      </UtilityHeading>
    </div>
  ),
};

export const SectionHeadings: Story = {
  args: {
    importance: 1,
    headingType: 'section',
    children: 'Utility Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <UtilityHeading importance={1} headingType="section">
        Section H1
      </UtilityHeading>
      <UtilityHeading importance={2} headingType="section">
        Section H2
      </UtilityHeading>
      <UtilityHeading importance={3} headingType="section">
        Section H3
      </UtilityHeading>
    </div>
  ),
};

export const PageHeadings: Story = {
  args: {
    importance: 1,
    headingType: 'page',
    children: 'Utility Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <UtilityHeading importance={1} headingType="page">
        Page H1
      </UtilityHeading>
      <UtilityHeading importance={2} headingType="page">
        Page H2
      </UtilityHeading>
      <UtilityHeading importance={3} headingType="page">
        Page H3
      </UtilityHeading>
    </div>
  ),
};

export const SectionVsPage: Story = {
  args: {
    importance: 1,
    headingType: 'page',
    children: 'Utility Heading',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Section</p>
        <UtilityHeading importance={1} headingType="section">
          Section H1
        </UtilityHeading>
        <UtilityHeading importance={2} headingType="section">
          Section H2
        </UtilityHeading>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Page</p>
        <UtilityHeading importance={1} headingType="page">
          Page H1
        </UtilityHeading>
        <UtilityHeading importance={2} headingType="page">
          Page H2
        </UtilityHeading>
      </div>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    importance: 1,
    headingType: 'page',
    children: 'Heading with custom class',
    className: 'custom-heading-class',
  },
};

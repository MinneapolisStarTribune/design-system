import type { Meta, StoryObj } from '@storybook/react-vite';
import { SponsoredHeading } from '../../../../components/Typography/SponsoredHeading/SponsoredHeading';
import type { SponsoredHeadingImportance } from '../../../../components/Typography/SponsoredHeading/SponsoredHeading';

const importanceOptions: SponsoredHeadingImportance[] = [1, 2, 3, 4, 5, 6];

const meta = {
  title: 'Foundations/Typography/Editorial/SponsoredHeading',
  component: SponsoredHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Editorial sponsored heading. Use the **Brand** control in the toolbar to switch between Star Tribune and Varsity to see brand-specific fonts.',
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
} satisfies Meta<typeof SponsoredHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    importance: 1,
    children: 'Sponsored heading example',
  },
};

export const AllLevels: Story = {
  args: {
    importance: 1,
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(importanceOptions as SponsoredHeadingImportance[]).map((level) => (
        <SponsoredHeading key={level} importance={level}>
          SponsoredHeading importance={level} (h{level})
        </SponsoredHeading>
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

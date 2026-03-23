import type { Meta, StoryObj } from '@storybook/react-vite';
import { CandyBar } from './CandyBar';

const meta = {
  title: 'Feedback & Status/CandyBar',
  component: CandyBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    children: { control: 'text' },
    onClose: { action: 'onClose' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#f5f6f7',
          position: 'relative',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Web Page Content
        </div>
        <div style={{ height: '50vh' }} />
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            zIndex: 1000,
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CandyBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      '<NEWSLETTER>-SELECTED Enter your email address and click Submit to start receiving newsletters.',
    onClose: () => {},
  },
} satisfies Story;

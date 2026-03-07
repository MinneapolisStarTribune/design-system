// UtilityBody.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityBody } from './UtilityBody';
import type { UtilityBodySize, UtilityBodyWeight } from './types';

const SIZES: UtilityBodySize[] = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large'];
const WEIGHTS: UtilityBodyWeight[] = ['regular', 'italic', 'medium', 'semibold', 'bold'];

const meta = {
  title: 'Foundations/Typography/Utility/UtilityBody',
  component: UtilityBody,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'italic', 'medium', 'semibold', 'bold'],
    },
  },
} satisfies Meta<typeof UtilityBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Utility body text is designed for readability at a variety of sizes.',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Utility body text',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {SIZES.flatMap((size) =>
        WEIGHTS.map((weight) => (
          <div
            key={`${size}-${weight}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <UtilityBody size={size} weight={weight}>
              Utility body text - {size} / {weight}
            </UtilityBody>
          </div>
        ))
      )}
    </div>
  ),
};

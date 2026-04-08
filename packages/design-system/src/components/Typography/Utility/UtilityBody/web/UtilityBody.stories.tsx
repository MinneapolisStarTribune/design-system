import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityBody } from './UtilityBody';
import { UTILITY_BODY_SIZES, UTILITY_BODY_WEIGHTS } from '../UtilityBody.types';
import { TEXT_COLOR_TOKENS } from '@/types';

const meta = {
  title: 'Typography/Utility/UtilityBody',
  component: UtilityBody,
  argTypes: {
    size: {
      control: 'select',
      options: UTILITY_BODY_SIZES,
    },
    weight: {
      control: 'select',
      options: UTILITY_BODY_WEIGHTS,
    },
    color: {
      control: 'select',
      options: Object.keys(TEXT_COLOR_TOKENS),
      description: 'Semantic text color token.',
    },
    children: {
      control: 'text',
      description: 'Utility text',
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
      {UTILITY_BODY_SIZES.flatMap((size) =>
        UTILITY_BODY_WEIGHTS.map((weight) => (
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityLabel } from './UtilityLabel';
import {
  UTILITY_LABEL_AS_ELEMENTS,
  UTILITY_LABEL_SIZES,
  UTILITY_LABEL_WEIGHTS,
} from '../UtilityLabel.types';

const meta = {
  title: 'Typography/Utility/UtilityLabel',
  component: UtilityLabel,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: UTILITY_LABEL_SIZES,
      description: 'The size of the label',
    },
    weight: {
      control: 'select',
      options: UTILITY_LABEL_WEIGHTS,
      description: 'The font weight of the label',
    },
    capitalize: {
      control: 'boolean',
      description: 'Whether to apply uppercase transformation',
    },
    as: {
      control: 'select',
      options: UTILITY_LABEL_AS_ELEMENTS,
      description: 'The HTML element to render as',
    },
  },
} satisfies Meta<typeof UtilityLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  args: {
    size: 'small',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {UTILITY_LABEL_SIZES.flatMap((size) =>
        UTILITY_LABEL_WEIGHTS.flatMap((weight) =>
          [false, true].map((capitalize) => (
            <div
              key={`${size}-${weight}-${capitalize}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <UtilityLabel size={size} weight={weight} capitalize={capitalize}>
                Label - {size} / {weight}
                {capitalize ? ' / All caps' : ''}
              </UtilityLabel>
            </div>
          ))
        )
      )}
    </div>
  ),
};

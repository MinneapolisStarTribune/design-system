import type { Meta, StoryObj } from '@storybook/react-vite';
import { SIZES } from '@/types';
import { EditorialText, EditorialTextProps } from './EditorialText';

const weightOptions: EditorialTextProps['weight'][] = ['regular', 'bold'];

const meta = {
  title: 'Foundations/Typography/Editorial/EditorialText',
  component: EditorialText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
      description: 'The size of the editorial text',
    },
    weight: {
      control: 'select',
      options: weightOptions,
      description: 'The font weight of the editorial text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial text',
    },
  },
} satisfies Meta<typeof EditorialText>;

export default meta;
type Story = StoryObj<typeof meta>;

// Configurable
export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial text. Use it for long-form content and article bodies.',
  },
};

export const AllVariants: Story = {
  name: 'All sizes / weights',
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial text',
  },
  render: (_args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((size) => (
        <div key={size}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{size}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {weightOptions.map((weight) => (
              <EditorialText key={weight} size={size} weight={weight}>
                {`${size} / ${weight} editorial text`}
              </EditorialText>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

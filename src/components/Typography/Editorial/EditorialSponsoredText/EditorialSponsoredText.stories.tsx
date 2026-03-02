import { Meta, StoryObj } from '@storybook/react-vite';
import { FontWeight, SIZES } from '../../../../types/globalTypes';
import { EditorialSponsoredText } from './EditorialSponsoredText';

const meta = {
  title: 'Foundations/Typography/Editorial/EditorialSponsoredText',
  component: EditorialSponsoredText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
      description: 'The size of the editorial sponsored text',
    },
    weight: {
      control: 'select',
      options: ['regular', 'bold'] as Extract<FontWeight, 'regular' | 'bold'>[],
      description: 'The font weight of the editorial sponsored text',
    },
    children: {
      control: 'text',
      description: 'The content of the editorial sponsored text',
    },
  },
} satisfies Meta<typeof EditorialSponsoredText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial sponsored text. Use it for long-form content and article bodies.',
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Sponsored Text',
  },
  render: () => {
    const sizes = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large'] as const;
    const weights = ['regular', 'bold'] as const;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {sizes.flatMap((size) =>
          weights.map((weight) => (
            <div
              key={`${size}-${weight}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {size} / {weight}
              </span>
              <EditorialSponsoredText size={size} weight={weight}>
                Editorial sponsored text
              </EditorialSponsoredText>
            </div>
          ))
        )}
      </div>
    );
  },
};

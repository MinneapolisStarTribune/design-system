import type { Meta, StoryObj } from '@storybook/react-vite';
import { EditorialSponsoredText } from './EditorialSponsoredText';
import {
  EDITORIAL_SPONSORED_TEXT_SIZES,
  EDITORIAL_SPONSORED_TEXT_WEIGHTS,
} from '../EditorialSponsoredText.types';

const meta = {
  title: 'Typography/Editorial/EditorialSponsoredText',
  component: EditorialSponsoredText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: EDITORIAL_SPONSORED_TEXT_SIZES,
      description: 'The size of the editorial sponsored text',
    },
    weight: {
      control: 'select',
      options: EDITORIAL_SPONSORED_TEXT_WEIGHTS,
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
    layout: 'fullscreen',
  },
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial Sponsored Text',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {EDITORIAL_SPONSORED_TEXT_SIZES.flatMap((size) =>
        EDITORIAL_SPONSORED_TEXT_WEIGHTS.map((weight) => (
          <div
            key={`${size}-${weight}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <EditorialSponsoredText size={size} weight={weight}>
              Editorial sponsored text - {size} / {weight}
            </EditorialSponsoredText>
          </div>
        ))
      )}
    </div>
  ),
};

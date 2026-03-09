import type { Meta, StoryObj } from '@storybook/react-vite';
import { EditorialText } from './EditorialText';
import { EDITORIAL_TEXT_SIZES, EDITORIAL_TEXT_WEIGHTS } from '../EditorialText.types';

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
      options: EDITORIAL_TEXT_SIZES,
      description: 'The size of the editorial text',
    },
    weight: {
      control: 'select',
      options: EDITORIAL_TEXT_WEIGHTS,
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

export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'This is editorial text. Use it for long-form content and article bodies.',
  },
};

export const AllLevels: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    children: 'Editorial text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {EDITORIAL_TEXT_SIZES.map((size) => (
        <div key={size}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EDITORIAL_TEXT_WEIGHTS.map((weight) => (
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

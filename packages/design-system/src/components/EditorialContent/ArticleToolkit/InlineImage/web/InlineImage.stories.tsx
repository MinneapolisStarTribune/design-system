import { Meta, StoryObj } from '@storybook/react-vite';
import { InlineImageProps } from '../InlineImage.types';
import { InlineImage } from './InlineImage';
import { INLINE_IMAGE_SIZES } from '../../types';

const variant: InlineImageProps['variant'][] = ['standard', 'immersive'];

const meta: Meta<InlineImageProps> = {
  title: 'Editorial Content/Article Toolkit/Inline Image',
  component: InlineImage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: INLINE_IMAGE_SIZES,
      description: 'Size of the inline image',
    },
    variant: {
      control: 'radio',
      options: variant,
      description: 'Article body variant: standard or immersive.',
    },
    expandable: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<InlineImageProps>;

const image = {
  src: 'https://picsum.photos/id/1018/1200/800',
  altText: 'Alternative text for the image',
};

const renderVariants = (variant: InlineImageProps['variant'], expandable = false) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {INLINE_IMAGE_SIZES.map((size) => (
        <div key={`${size}-${variant}`}>
          <h3 className="typography-article-body-h3" style={{ textTransform: 'capitalize' }}>
            {variant} ({size})
          </h3>
          <InlineImage
            image={image}
            size={size}
            variant={variant}
            caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
            credit="Star Tribune staff/The Minnesota Star Tribune"
            expandable={expandable}
          />
        </div>
      ))}
    </div>
  );
};

export const Configurable: Story = {
  args: {
    image,
    size: 'medium',
    variant: 'standard',
    caption: "A scenic view of mountains during sunrise, highlighting nature's beauty.",
    credit: 'Star Tribune staff/The Minnesota Star Tribune',
    expandable: false,
  },
};

export const Standard: Story = {
  render: () => renderVariants('standard'),
};

export const Immersive: Story = {
  render: () => renderVariants('immersive'),
};

export const WithExpandable: Story = {
  render: () => renderVariants('immersive', true),
};

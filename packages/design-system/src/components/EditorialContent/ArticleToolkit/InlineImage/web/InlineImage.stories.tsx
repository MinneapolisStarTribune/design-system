import type { Meta, StoryObj } from '@storybook/react-vite';
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

const renderVariants: Story['render'] = (args) => {
  const { variant = 'standard', size = 'full', expandable = false } = args;
  return (
    <div style={{ padding: '48px 0' }}>
      <InlineImage
        image={image}
        size={size}
        variant={variant}
        caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
        credit="Star Tribune staff/The Minnesota Star Tribune"
        expandable={expandable}
      />
    </div>
  );
};

const staticSource = (variant: InlineImageProps['variant'], expandable = false) => ({
  docs: {
    source: {
      code: `
<InlineImage
  image={${JSON.stringify(image)}}
  size="full"
  variant="${variant}"
  caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
  credit="Star Tribune staff/The Minnesota Star Tribune"
  expandable={${expandable}}
/>
`,
    },
  },
});

export const Configurable: Story = {
  render: renderVariants,
  parameters: staticSource('standard', false),
};

export const Standard: Story = {
  args: { variant: 'standard' },
  render: renderVariants,
  parameters: staticSource('standard'),
};

export const Immersive: Story = {
  args: { variant: 'immersive' },
  render: renderVariants,
  parameters: staticSource('immersive'),
};

export const WithExpandable: Story = {
  args: {
    expandable: true,
  },
  render: renderVariants,
  parameters: staticSource('standard', true),
};

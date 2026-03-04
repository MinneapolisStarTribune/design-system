import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image, ImageProps } from './Image';

const meta: Meta<ImageProps> = {
  title: 'Components/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'The source of the image',
    },
    alt: {
      control: 'text',
      description: 'The alt text for the image',
    },
    imgixParams: {
      control: 'text',
      description: 'Optional imgix parameters to optimize the image',
    },
    height: {
      control: 'text',
      description: 'The height of the image in pixels',
    },
    width: {
      control: 'text',
      description: 'The width of the image in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<ImageProps>;

export const Configurable: Story = {
  args: {
    src: 'https://picsum.photos/id/1018/800/500',
    alt: 'Mountain house',
  },
};

export const WithImgix: Story = {
  args: {
    src: 'https://assets.imgix.net/examples/pione.jpg',
    alt: 'Mountain lake with forest',
    imgixParams: 'w=800&h=500&fit=crop&auto=format,compress&q=75',
  },
};

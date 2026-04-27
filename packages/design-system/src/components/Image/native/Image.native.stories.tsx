import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, View } from 'react-native';
import { Image, ImageProps } from './Image.native';

const meta: Meta<ImageProps> = {
  title: 'Foundations/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'The image URL (required).',
    },
    alt: {
      control: 'text',
      description: 'Accessibility label for the image.',
    },
    imgixParams: {
      control: 'text',
      description: 'Optional Imgix params for resizing and optimization.',
    },
    style: {
      control: 'object',
      description: 'React Native style object (width, height, borderRadius, etc).',
    },
    resizeMode: {
      control: 'select',
      options: ['cover', 'contain', 'stretch', 'repeat', 'center'],
      description: 'How the image should resize within its container.',
    },
    dataTestId: {
      control: 'text',
      description: 'Test identifier (mapped to testID internally).',
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Overrides alt text for accessibility.',
    },
    onPress: {
      action: 'pressed',
      description: 'Callback when image is pressed (wraps with Pressable).',
    },
    blurRadius: {
      control: 'number',
      description: 'Blur effect applied to the image.',
    },
  },
};

export default meta;
type Story = StoryObj<ImageProps>;

export const Configurable: Story = {
  render: (args) => (
    <View style={{ width: 300, height: 200 }}>
      <Image {...args} />
    </View>
  ),
  args: {
    src: 'https://picsum.photos/id/1018/800/500',
    alt: 'Mountain house',
    style: { width: '100%', height: '100%', borderRadius: 8 },
    resizeMode: 'cover',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      {/* Default */}
      <View>
        <Text style={{ marginBottom: 6 }}>Default</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1018/800/500"
            alt="Default image"
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
          />
        </View>
      </View>

      {/* Imgix Optimized */}
      <View>
        <Text style={{ marginBottom: 6 }}>With Imgix Optimization</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://assets.imgix.net/examples/pione.jpg"
            alt="Imgix optimized"
            imgixParams="w=500&h=300&fit=crop&auto=format,compress&q=75&borderRadius=16"
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
          />
        </View>
      </View>

      {/* Non-clickable */}
      <View>
        <Text style={{ marginBottom: 6 }}>Non-clickable</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1025/800/500"
            alt="Non-clickable image"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      {/* Clickable */}
      <View>
        <Text style={{ marginBottom: 6 }}>Clickable (onPress)</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1019/800/500"
            alt="Clickable image"
            onPress={() => alert('Image pressed')}
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
          />
        </View>
      </View>

      {/* Accessibility Cases */}
      <View>
        <Text style={{ marginBottom: 6 }}>Accessibility (alt fallback)</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1040/800/500"
            alt="Accessible via alt"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 6 }}>Accessibility (no alt)</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1041/800/500"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 6 }}>Accessibility (override label)</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1042/800/500"
            alt="Alt text"
            accessibilityLabel="Custom accessibility label"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 6 }}>Accessibility (clickable role)</Text>
        <View style={{ width: 250, height: 150 }}>
          <Image
            src="https://picsum.photos/id/1043/800/500"
            alt="Clickable accessible image"
            onPress={() => alert('Pressed')}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>
    </View>
  ),
};

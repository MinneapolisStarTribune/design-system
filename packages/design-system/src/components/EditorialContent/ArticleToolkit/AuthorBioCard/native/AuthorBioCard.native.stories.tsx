// AuthorBioCard.native.stories.tsx

import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';

import { AuthorBioCardNative } from './AuthorBioCard.native';

const meta: Meta<typeof AuthorBioCardNative> = {
  title: 'Editorial Content/Article Toolkit/AuthorBioCard',
  component: AuthorBioCardNative,
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional heading label displayed above the card.',
    },
    name: {
      control: 'text',
      description: 'Author name.',
    },
    description: {
      control: 'text',
      description: 'Author bio/description.',
    },
    position: {
      control: 'text',
      description: 'Author role or designation.',
    },
    thumbnailIcon: {
      control: 'text',
      description: 'Image URL for author avatar.',
    },
    thumbnailIconAlt: {
      control: 'text',
      description: 'Accessibility label for the image.',
    },
    thumbnailIconRounded: {
      control: 'boolean',
      description: 'Renders circular avatar when true.',
    },
    ctaLink: {
      control: 'object',
      description: 'CTA config: { label, link?, onPress? }. Either link or onPress required.',
    },
    hasTopBorder: {
      control: 'boolean',
      description: 'Adds top border.',
    },
    hasBottomBorder: {
      control: 'boolean',
      description: 'Adds bottom border.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof AuthorBioCardNative>;

// configurable
export const Configurable: Story = {
  args: {
    label: 'Author',
    name: 'John Doe',
    description: 'John covers local news, investigative journalism, and community stories.',
    position: 'Staff Writer',
    thumbnailIcon: 'https://i.pravatar.cc/150?img=12',
    thumbnailIconAlt: 'John Doe profile image',
    thumbnailIconRounded: true,
    hasTopBorder: true,
    hasBottomBorder: false,
    ctaLink: {
      label: 'View profile',
      link: 'https://example.com',
    },
  },
};

// all variants
export const AllVariants: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 24 }}>
      <AuthorBioCardNative
        label="Default"
        name="Jane Smith"
        description="Reporter focused on long-form storytelling."
        position="Reporter"
        thumbnailIcon="https://i.pravatar.cc/150?img=5"
        ctaLink={{ label: 'View profile', link: 'https://example.com' }}
      />

      <AuthorBioCardNative
        label="Staff (Rounded Image)"
        name="Michael Brown"
        description="Senior editor overseeing newsroom strategy."
        position="Senior Editor"
        thumbnailIcon="https://i.pravatar.cc/150?img=8"
        thumbnailIconRounded
        ctaLink={{ label: 'View profile', link: 'https://example.com' }}
      />

      <AuthorBioCardNative
        label="Without Image"
        name="Alex Johnson"
        description="Freelance journalist covering tech."
        position="Contributor"
        ctaLink={{ label: 'Read articles', link: 'https://example.com' }}
      />

      <AuthorBioCardNative
        label="Without CTA"
        name="Emily Davis"
        description="Covers health and science."
        position="Health Reporter"
        thumbnailIcon="https://i.pravatar.cc/150?img=9"
      />

      <AuthorBioCardNative
        label="With Borders"
        name="Border Example"
        description="Top and bottom borders applied."
        position="Editor"
        hasTopBorder
        hasBottomBorder
        thumbnailIcon="https://i.pravatar.cc/150?img=10"
        ctaLink={{ label: 'Explore', link: 'https://example.com' }}
      />
    </View>
  ),
};

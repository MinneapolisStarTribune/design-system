// AuthorBioCard.native.stories.tsx

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollView } from 'react-native';

import { AuthorBioCard } from './AuthorBioCard.native';

const meta: Meta<typeof AuthorBioCard> = {
  title: 'Editorial Content/Article Toolkit/AuthorBioCard',
  component: AuthorBioCard,
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

type Story = StoryObj<typeof AuthorBioCard>;

// configurable
export const Configurable: Story = {
  args: {
    name: 'John Doe',
    description: 'John covers local news, investigative journalism, and community stories.',
    position: 'Staff Writer',
    thumbnailIcon: 'https://i.pravatar.cc/150?img=12',
    thumbnailIconAlt: 'John Doe profile image',
    hasTopBorder: true,
    hasBottomBorder: false,
    ctaLink: {
      link: 'https://example.com',
    },
  },
};

// all variants
export const AllVariants: Story = {
  render: () => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
      <AuthorBioCard
        name="Jane Smith"
        description="Reporter focused on long-form storytelling."
        position="Reporter"
        thumbnailIcon="https://i.pravatar.cc/150?img=5"
        ctaLink={{ link: 'https://example.com' }}
      />

      <AuthorBioCard
        label="Without Image"
        name="Alex Johnson"
        description="Freelance journalist covering tech."
        position="Contributor"
        ctaLink={{ label: 'Read articles', link: 'https://example.com' }}
      />

      <AuthorBioCard
        label="Without CTA"
        name="Emily Davis"
        description="Covers health and science."
        position="Health Reporter"
        thumbnailIcon="https://i.pravatar.cc/150?img=9"
      />

      <AuthorBioCard
        label="With Borders"
        name="Border Example"
        description="Top and bottom borders applied."
        position="Editor"
        hasTopBorder
        hasBottomBorder
        thumbnailIcon="https://i.pravatar.cc/150?img=10"
        ctaLink={{ label: 'Explore', link: 'https://example.com' }}
      />
    </ScrollView>
  ),
};

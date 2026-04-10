import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthorBioCard } from './AuthorBioCard';

const meta: Meta<typeof AuthorBioCard> = {
  title: 'Editorial Content/AuthorBioCard',
  component: AuthorBioCard,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof AuthorBioCard>;

// identifier: configurable
export const Configurable: Story = {
  args: {
    label: 'Author',
    name: 'John Doe',
    description: 'John covers local news, investigative journalism, and community stories.',
    position: 'Staff Writer',
    thumbnailIcon: 'https://i.pravatar.cc/150?img=12',
    thumbnailIconAlt: 'John Doe profile image',
    thumbnailIconRounded: true,
    headingLevel: 'h4',
    hasTopBorder: true,
    hasBottomBorder: false,
    ctaLink: {
      label: 'View profile',
      link: '#',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
<AuthorBioCard
  label="Author"
  name="John Doe"
  description="John covers local news, investigative journalism, and community stories."
  position="Staff Writer"
  thumbnailIcon="https://i.pravatar.cc/150?img=12"
  thumbnailIconAlt="John Doe profile image"
  thumbnailIconRounded
  headingLevel="h4"
  hasTopBorder
  ctaLink={{ label: "View profile", link: "#" }}
/>
        `,
      },
    },
  },
};

// identifier: all variants
export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `
<>
  <AuthorBioCard
    label="Default Variant"
    name="Jane Smith"
    description="Reporter focused on long-form storytelling."
    position="Reporter"
    thumbnailIcon="https://i.pravatar.cc/150?img=5"
    ctaLink={{ label: "View profile", link: "#" }}
  />

  <AuthorBioCard
    label="Staff Variant"
    name="Michael Brown"
    description="Senior editor overseeing newsroom strategy."
    position="Senior Editor"
    thumbnailIcon="https://i.pravatar.cc/150?img=8"
    thumbnailIconRounded
    ctaLink={{ label: "View profile", link: "#" }}
  />

  <AuthorBioCard
    label="Without Image"
    name="Alex Johnson"
    description="Freelance journalist covering tech."
    position="Contributor"
    ctaLink={{ label: "Read articles", link: "#" }}
  />

  <AuthorBioCard
    label="Without CTA"
    name="Emily Davis"
    description="Covers health and science."
    position="Health Reporter"
    thumbnailIcon="https://i.pravatar.cc/150?img=9"
  />
</>
        `,
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <AuthorBioCard
        label="Default Variant"
        name="Jane Smith"
        description="Reporter focused on long-form storytelling."
        position="Reporter"
        thumbnailIcon="https://i.pravatar.cc/150?img=5"
        ctaLink={{ label: 'View profile', link: '#' }}
      />

      <AuthorBioCard
        label="Staff Variant"
        name="Michael Brown"
        description="Senior editor overseeing newsroom strategy."
        position="Senior Editor"
        thumbnailIcon="https://i.pravatar.cc/150?img=8"
        thumbnailIconRounded
        ctaLink={{ label: 'View profile', link: '#' }}
      />

      <AuthorBioCard
        label="Without Image"
        name="Alex Johnson"
        description="Freelance journalist covering tech."
        position="Contributor"
        ctaLink={{ label: 'Read articles', link: '#' }}
      />

      <AuthorBioCard
        label="Without CTA"
        name="Emily Davis"
        description="Covers health and science."
        position="Health Reporter"
        thumbnailIcon="https://i.pravatar.cc/150?img=9"
      />
    </div>
  ),
};

import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EyebrowBadge } from './EyebrowBadge';
import {
  EYEBROW_BADGE_AS_ELEMENTS,
  EYEBROW_BADGE_SIZES,
  EYEBROW_BADGE_VARIANTS,
} from '@/components/EyebrowBadge/EyebrowBadge.types';

const meta = {
  title: 'Editorial Content/EyebrowBadge',
  component: EyebrowBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: EYEBROW_BADGE_VARIANTS,
    },
    size: {
      control: 'select',
      options: EYEBROW_BADGE_SIZES,
      description:
        '`large` (default): 24px badge height, 6px radius. `small`: 20px height, 4px radius — all variants.',
    },
    as: {
      control: 'select',
      options: EYEBROW_BADGE_AS_ELEMENTS,
      description:
        'Root element: `span` (default), `div`, or `a`. For Next.js, use `as={NextLink}` with `href` in app code.',
    },
    href: {
      control: 'text',
      description: 'Navigation target when `as="a"` or `as={NextLink}`.',
    },
    showDot: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof EyebrowBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'Live',
    secondaryLabel: 'Updated 12 mins ago',
    variant: 'live',
    size: 'large',
    showDot: true,
  },
};

export const ExampleLive: Story = {
  tags: ['!dev'],
  args: {
    label: 'Live',
    secondaryLabel: 'Updated 12 mins ago',
    variant: 'live',
    size: 'large',
  },
  parameters: {
    controls: { disable: true },
  },
};

export const ExampleBreaking: Story = {
  tags: ['!dev'],
  args: {
    label: 'Breaking',
    secondaryLabel: 'Developing story',
    variant: 'breaking',
    size: 'large',
  },
  parameters: {
    controls: { disable: true },
  },
};

export const ExampleShowcaseSmall: Story = {
  tags: ['!dev'],
  args: {
    label: 'Showcase',
    secondaryLabel: 'Style',
    variant: 'showcase',
    size: 'small',
    showDot: false,
  },
  parameters: {
    controls: { disable: true },
  },
};

/** Minimal stand-in for `next/link` in Storybook. In your app: `import NextLink from 'next/link'`. */
function StoryMockNextLink({
  href,
  className,
  children,
  prefetch,
  ...rest
}: React.ComponentPropsWithoutRef<'a'> & { prefetch?: boolean }) {
  return (
    <a
      href={href}
      className={className}
      data-prefetch={prefetch === undefined ? undefined : String(prefetch)}
      {...rest}
    >
      {children}
    </a>
  );
}

export const ExampleAsAnchor: Story = {
  tags: ['!dev'],
  args: {
    as: 'a',
    href: '/live',
    label: 'Live',
    secondaryLabel: 'Updated 12 mins ago',
    variant: 'live',
    size: 'large',
  },
  parameters: {
    controls: { disable: true },
  },
};

export const ExampleAsNextLink: Story = {
  tags: ['!dev'],
  args: {
    href: '/breaking',
    prefetch: false,
    label: 'Breaking',
    secondaryLabel: 'Developing story',
    variant: 'breaking',
    size: 'large',
  },
  parameters: {
    controls: { disable: true },
  },
  render: (args) => <EyebrowBadge {...args} as={StoryMockNextLink} />,
};

export const ExampleSponsoredAsDiv: Story = {
  tags: ['!dev'],
  args: {
    as: 'div',
    label: 'Sponsored',
    variant: 'sponsored',
    dataTestId: 'sponsored-eyebrow-badge',
  },
  parameters: {
    controls: { disable: true },
  },
};

function VariantSizesRow(props: {
  variantLabel: string;
  badge: Omit<ComponentProps<typeof EyebrowBadge>, 'size'>;
}) {
  const { variantLabel, badge } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <span className="typography-utility-label-semibold-small">{variantLabel}</span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
          <span className="typography-utility-text-regular-small">Large</span>
          <EyebrowBadge {...badge} size="large" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
          <span className="typography-utility-text-regular-small">Small</span>
          <EyebrowBadge {...badge} size="small" />
        </div>
      </div>
    </div>
  );
}

export const AllVariants: Story = {
  args: {
    label: 'Live',
    secondaryLabel: 'Updated 12 mins ago',
    variant: 'live',
    size: 'large',
    showDot: true,
  },
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <VariantSizesRow
        variantLabel="Live"
        badge={{
          label: 'Live',
          secondaryLabel: 'Updated 12 mins ago',
          variant: 'live',
        }}
      />
      <VariantSizesRow
        variantLabel="Breaking"
        badge={{
          label: 'Breaking',
          secondaryLabel: 'Developing story',
          variant: 'breaking',
        }}
      />
      <VariantSizesRow
        variantLabel="Showcase"
        badge={{
          label: 'Showcase',
          secondaryLabel: 'Optional label',
          variant: 'showcase',
          showDot: false,
        }}
      />
      <VariantSizesRow
        variantLabel="Sponsored"
        badge={{
          label: 'Sponsored',
          variant: 'sponsored',
        }}
      />
    </div>
  ),
};

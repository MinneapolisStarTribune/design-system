import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon } from '@/icons';
import { LINK_ICON_POSITIONS, LINK_SIZES } from '../Link.types';
import { Link } from './Link';
import type { LinkProps } from '../Link.types';
import storyStyles from './Link.stories.module.scss';

type StoryArgs = LinkProps & { showIcon: boolean; useAsNextLike: boolean };

const meta: Meta<StoryArgs> = {
  title: 'Actions/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Link label text',
    },
    size: {
      control: 'select',
      options: [...LINK_SIZES],
      description: 'Utility Body size (weight is always medium)',
    },
    href: {
      control: 'text',
      description: 'URL for the anchor `href`',
    },
    disabled: {
      control: 'boolean',
      description: 'When true, link is not interactive and uses `aria-disabled`',
    },
    iconPosition: {
      control: 'select',
      options: [...LINK_ICON_POSITIONS],
      description: 'Icon placement when `showIcon` is enabled',
    },
    showIcon: {
      control: 'boolean',
      description: 'Story helper: show ArrowRightIcon (pass `icon` in app code)',
    },
    useAsNextLike: {
      control: 'boolean',
      description:
        "When on, this story sets `as` to a mock `next/link` (you do **not** fill the `as` control). In app code: `import NextLink from 'next/link'` then `as={NextLink}`.",
    },
    as: {
      control: false,
      description:
        'Not used in Storybook — use **useAsNextLike** above. In your app, pass a component: `as={NextLink}`.',
    },
    icon: {
      control: false,
      description: 'Use **showIcon** in this story; in app code pass an icon node to `icon`.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Mimics `next/link` props (`href`, `className`, `children`) for Storybook only. */
function StoryNextLinkLike({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} data-testid="story-as-next-like">
      {children}
    </a>
  );
}

export const Configurable: Story = {
  args: {
    children: 'Read more',
    size: 'medium',
    href: 'https://www.startribune.com',
    disabled: false,
    iconPosition: 'end',
    showIcon: false,
    useAsNextLike: false,
  },
  render: (args) => {
    const { showIcon, useAsNextLike, as: _ignoredAs, icon: _ignoredIcon, ...linkProps } = args;
    return (
      <Link
        {...linkProps}
        as={useAsNextLike ? StoryNextLinkLike : undefined}
        icon={showIcon ? <ArrowRightIcon /> : undefined}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Each tile shows **Default** and **Focus** (simulated focus ring for static preview). **Disabled** tiles only show default — focus does not apply.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      {LINK_SIZES.flatMap((size) =>
        LINK_ICON_POSITIONS.flatMap((iconPosition) =>
          [false, true].flatMap((disabled) =>
            [false, true].map((withIcon) => (
              <div
                key={`${size}-${iconPosition}-${disabled}-${withIcon}`}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <span
                  className="typography-utility-text-regular-small"
                  style={{ color: 'var(--color-text-on-light-secondary)' }}
                >
                  {size} · icon {iconPosition} · {disabled ? 'disabled' : 'enabled'}
                  {withIcon ? ' · icon' : ''}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span
                      className="typography-utility-text-regular-small"
                      style={{ color: 'var(--color-text-on-light-tertiary)' }}
                    >
                      Default
                    </span>
                    <Link
                      size={size}
                      href="https://www.startribune.com"
                      disabled={disabled}
                      iconPosition={iconPosition}
                      icon={withIcon ? <ArrowRightIcon /> : undefined}
                      dataTestId={`link-${size}-${iconPosition}-${disabled}-${withIcon}-default`}
                    >
                      Read more
                    </Link>
                  </div>
                  {!disabled ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span
                        className="typography-utility-text-regular-small"
                        style={{ color: 'var(--color-text-on-light-tertiary)' }}
                      >
                        Focus
                      </span>
                      <Link
                        size={size}
                        href="https://www.startribune.com"
                        iconPosition={iconPosition}
                        icon={withIcon ? <ArrowRightIcon /> : undefined}
                        dataTestId={`link-${size}-${iconPosition}-${withIcon}-focus`}
                        className={storyStyles.forceFocusRing}
                      >
                        Read more
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )
        )
      )}
    </div>
  ),
};

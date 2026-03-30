import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon } from '@/icons';
import { LINK_ICON_POSITIONS, LINK_SIZES } from '../Link.types';
import { Link } from './Link';
import type { LinkUtilityProps } from '../Link.types';
import storyStyles from './Link.stories.module.scss';

/**
 * Storybook-only stand-in for `Link`’s `as` prop: real `as` is `ElementType`, which controls can’t edit.
 * Maps **`a`** → native anchor, **`nextLink`** → mock `next/link` (omit this control entirely if you don’t need that preview).
 */
type StoryAsControl = 'a' | 'nextLink';

type StoryArgs = Omit<LinkUtilityProps, 'as'> & { showIcon: boolean; as: StoryAsControl };

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
    as: {
      control: 'select',
      options: ['a', 'nextLink'],
      description:
        'Story-only: **`a`** = `<a>`. **`nextLink`** = mock `next/link` (in app: `import NextLink from \'next/link\'` then `as={NextLink}`). **`button`** is not listed here — pass `as="button"` in source.',
    },
    icon: {
      control: false,
      description: 'Use **showIcon** in this story; in app code pass an icon node to `icon`.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Minimal stand-in for `next/link` in Storybook (same `href` + children contract). */
function StoryMockNextLink({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} data-testid="story-mock-next-link">
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
    as: 'a',
  },
  render: (args) => {
    const { showIcon, as: asControl, icon: _ignoredIcon, ...linkProps } = args;
    return (
      <Link
        {...linkProps}
        as={asControl === 'nextLink' ? StoryMockNextLink : 'a'}
        icon={showIcon ? <ArrowRightIcon /> : undefined}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Responsive **grid** (fullscreen canvas): each tile shows **Default** and **Focus** (simulated focus ring). **Disabled** tiles only show default — focus does not apply.',
      },
    },
  },
  render: () => (
    <div className={storyStyles.allVariantsGrid}>
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

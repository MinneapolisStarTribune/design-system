import type { Meta, StoryObj } from '@storybook/react-vite';

import type { ButtonProps } from './Button';
import {
  Button,
  BUTTON_VARIANTS,
  BUTTON_COLORS,
  BUTTON_SIZES,
  ICON_ONLY_BUTTON_SIZES,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  type IconOnlyButtonSize,
} from './Button';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';
import { NewsHeading } from '@/components/index.web';
import { allModes } from '@storybook-config/modes';
import { ArrowRightIcon } from '@/icons';
import { AvatarIcon } from '@/icons';

/** Story-only arg for toggling demo icon in Configurable */
type ConfigurableArgs = ButtonProps & { showIcon?: boolean };

const meta: Meta<ConfigurableArgs> = {
  title: 'Actions/Button',
  component: Button,
  parameters: {
    docs: {
      canvas: {
        sourceState: 'hidden',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The button label text',
    },
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS] as string[],
      description: 'The visual style variant of the button',
    },
    color: {
      control: 'select',
      options: [...BUTTON_COLORS] as string[],
      description: 'The color token for the button',
    },
    size: {
      control: 'select',
      options: [...ICON_ONLY_BUTTON_SIZES] as string[],
      description: 'The size of the button. Note: "x-small" is only valid for icon-only buttons.',
    },
    showIcon: {
      control: 'boolean',
      description:
        'Stories only: toggles AvatarIcon. In apps, pass icon={<YourIcon />} (see Button `icon` prop docs).',
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      if: { arg: 'showIcon', truthy: true },
      description:
        'When the button has both icon and text, position of the icon relative to the label.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    capitalize: {
      control: 'boolean',
      description: 'Whether to capitalize the button text',
    },
    surface: {
      control: 'select',
      options: ['light', 'dark'],
      description:
        'Use `dark` on dark backgrounds when the page still uses light theme CSS on :root. Brand follows DesignSystemProvider (`html[data-ds-brand]`).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Storybook serializes wrapped icons as `Icon(Svg…)`; docs snippets use the public export name. */
const docsSourceArrowRightIconEnd = `icon={<ArrowRightIcon />}
  iconPosition="end"`;

const onDarkBackgroundDocsSource = `
<Button surface="dark" color="neutral" variant="filled">
  Neutral filled
</Button>

<Button surface="dark" color="neutral" variant="outlined">
  Neutral outlined
</Button>

<Button surface="dark" color="brand" variant="filled">
  Brand filled
</Button>

<Button
  surface="dark"
  color="neutral"
  variant="filled"
  ${docsSourceArrowRightIconEnd}
>
  With icon
</Button>
`.trim();

const buttonWithAnalyticsDocsSource = `
<Button
  variant="filled"
  color="brand"
  analytics={{ cta_type: 'subscribe', module_position: 'hero' }}
  ${docsSourceArrowRightIconEnd}
>
  Subscribe
</Button>
`.trim();

export const Configurable: Story = {
  args: {
    children: 'See More',
    onClick: () => alert('Hello'),
    variant: 'filled',
    size: 'large',
    color: 'brand',
    showIcon: false,
    isDisabled: false,
    capitalize: false,
    surface: 'light',
  } as ConfigurableArgs,
  render: (args) => {
    const { showIcon, iconPosition, ...buttonProps } = args as ConfigurableArgs;
    return (
      <Button
        {...buttonProps}
        icon={showIcon ? <AvatarIcon /> : undefined}
        {...(showIcon ? { iconPosition: iconPosition ?? 'end' } : {})}
      />
    );
  },
};

/**
 * Button with analytics tracking enabled. Click the button and check the browser console
 * to see the tracking event payload. In production, brands wire this to GA4, Piano, etc.
 */
export const ButtonWithAnalytics: Story = {
  args: {
    children: 'Subscribe',
    onClick: () => alert('Subscribed!'),
    variant: 'filled',
    color: 'brand',
    analytics: { cta_type: 'subscribe', module_position: 'hero' },
  },
  parameters: {
    docs: {
      source: {
        code: buttonWithAnalyticsDocsSource,
        type: 'code',
      },
    },
  },
  render: (args) => <Button {...args} icon={<ArrowRightIcon />} iconPosition="end" />,
  decorators: [
    (Story) => (
      <AnalyticsProvider
        onTrackingEvent={(event) => {
          // eslint-disable-next-line no-console
          console.log('[Analytics] Button click:', event);
        }}
      >
        <Story />
      </AnalyticsProvider>
    ),
  ],
};

/** Light toolbar theme + dark strip — same pattern as apps with light :root and a dark module. */
export const OnDarkBackground: Story = {
  parameters: {
    theme: 'light',
    controls: { disable: true },
    docs: {
      source: {
        code: onDarkBackgroundDocsSource,
        type: 'code',
      },
    },
  },
  render: () => (
    <div
      style={{
        background: '#0D0D0D',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <Button surface="dark" color="neutral" variant="filled">
        Neutral filled
      </Button>
      <Button surface="dark" color="neutral" variant="outlined">
        Neutral outlined
      </Button>
      <Button surface="dark" color="brand" variant="filled">
        Brand filled
      </Button>
      <Button
        surface="dark"
        color="brand-accent"
        variant="filled"
        icon={<AvatarIcon />}
        iconPosition="end"
      >
        With icon
      </Button>
    </div>
  ),
};

/** Same variant × color × size walks as `renderButtonSection`; used only to build docs source (no layout noise). */
function eachVariantMatrix<T extends ButtonSize | IconOnlyButtonSize>(
  sizes: readonly T[],
  format: (args: { variant: ButtonVariant; color: ButtonColor; size: T }) => string
): string {
  const chunks: string[] = [];
  for (const variant of BUTTON_VARIANTS) {
    for (const color of BUTTON_COLORS) {
      for (const size of sizes) {
        chunks.push(format({ variant, color, size }));
      }
    }
  }
  return chunks.join('\n\n');
}

const allVariantsDocsSource = (() => {
  const demoLabel = (color: ButtonColor, variant: ButtonVariant, size: string) =>
    `${color} ${variant} ${size}`;

  return [
    '// All Text Buttons\n\n',
    eachVariantMatrix(BUTTON_SIZES, ({ variant, color, size }) => {
      const label = demoLabel(color, variant, size);
      return `<Button variant="${variant}" color="${color}" size="${size}">\n  ${label}\n</Button>`;
    }),
    '\n\n// All Text Buttons with Icons\n\n',
    eachVariantMatrix(BUTTON_SIZES, ({ variant, color, size }) => {
      const label = demoLabel(color, variant, size);
      return `<Button variant="${variant}" color="${color}" size="${size}" icon={<AvatarIcon />} iconPosition="start">\n  ${label}\n</Button>`;
    }),
    '\n\n// All Icon Only Buttons\n\n',
    eachVariantMatrix(ICON_ONLY_BUTTON_SIZES, ({ variant, color, size }) => {
      return `<Button variant="${variant}" color="${color}" size="${size}" icon={<AvatarIcon />} aria-label="Icon button" />`;
    }),
  ]
    .join('')
    .trim();
})();

/**
 * Helper function to render a section of buttons (text-only, with icons, or icon-only)
 */
function renderButtonSection(
  title: string,
  sizes: readonly (ButtonSize | IconOnlyButtonSize)[],
  iconOnly: boolean,
  withIcon: boolean
) {
  return (
    <div>
      <NewsHeading importance={2}>{title}</NewsHeading>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {BUTTON_VARIANTS.flatMap((variant) =>
          BUTTON_COLORS.map((color) => (
            <div
              key={`${variant}-${color}`}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
                gap: '1rem',
              }}
            >
              {sizes.map((size) => (
                <div
                  key={`${variant}-${color}-${size}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  {iconOnly ? (
                    <Button
                      variant={variant}
                      color={color}
                      size={size as IconOnlyButtonSize}
                      icon={<AvatarIcon />}
                      aria-label="Icon button"
                    />
                  ) : (
                    <Button
                      variant={variant}
                      color={color}
                      size={size as ButtonSize}
                      icon={withIcon ? <AvatarIcon /> : undefined}
                      iconPosition={withIcon ? 'start' : undefined}
                    >
                      {`${color} ${variant} ${size}`}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * All button variants - used for Chromatic visual regression testing.
 * Chromatic captures a snapshot for each brand/theme mode (star-tribune-light, star-tribune-dark,
 * varsity-light, varsity-dark) via chromatic.modes. Use the Brand and Theme toggles in the
 * toolbar to preview different combinations.
 */
export const AllVariants: Story = {
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      source: {
        code: allVariantsDocsSource,
        type: 'code',
      },
    },
  },
  render: () => (
    <div style={{ padding: '2rem' }}>
      {renderButtonSection('All Text Buttons', BUTTON_SIZES, false, false)}
      {renderButtonSection('All Text Buttons with Icons', BUTTON_SIZES, false, true)}
      {renderButtonSection('All Icon Only Buttons', ICON_ONLY_BUTTON_SIZES, true, false)}
    </div>
  ),
};

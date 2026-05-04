import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { allModes } from '@storybook-config/modes';
import {
  EyebrowLabel,
  EYEBROW_LABEL_AS_ELEMENTS,
  EYEBROW_LABEL_BACKGROUNDS,
  EYEBROW_LABEL_COLORS,
  EYEBROW_LABEL_SIZES,
} from './EyebrowLabel';
import { ICON_COLOR_TOKENS } from '@/components/Icon/Icon.types';

type EyebrowStoryProps = ComponentProps<typeof EyebrowLabel>;

/** Row definition: `size` / `background` come from columns and section. */
type VariantRowSpec = {
  key: string;
  label: string;
} & Omit<
  EyebrowStoryProps,
  'size' | 'background' | 'children' | 'label' | 'dataTestId' | 'className'
>;

const ALL_VARIANT_ROWS: VariantRowSpec[] = [
  {
    key: 'neutral-no-logo',
    label: 'Label',
    color: 'neutral',
    logo: false,
    brand: 'startribune',
  },
  {
    key: 'brand-st-no-logo',
    label: 'Label',
    color: 'brand',
    logo: false,
    brand: 'startribune',
  },
  {
    key: 'neutral-logo-st',
    label: 'Label',
    color: 'neutral',
    logo: true,
    brand: 'startribune',
  },
  {
    key: 'neutral-logo-varsity',
    label: 'Label',
    color: 'neutral',
    logo: true,
    brand: 'varsity',
  },
  {
    key: 'brand-logo-st',
    label: 'Label',
    color: 'brand',
    logo: true,
    brand: 'startribune',
  },
  {
    key: 'brand-logo-varsity',
    label: 'Label',
    color: 'brand',
    logo: true,
    brand: 'varsity',
  },
  {
    key: 'subscriber-only-neutral',
    label: 'Subscriber only',
    color: 'neutral',
    logo: true,
    brand: 'startribune',
    isSubscriberOnly: true,
  },
  {
    key: 'subscriber-only-brand',
    label: 'Subscriber only',
    color: 'brand',
    logo: true,
    brand: 'startribune',
    isSubscriberOnly: true,
  },
  {
    key: 'live',
    label: 'Live',
    color: 'live',
    logo: false,
    brand: 'startribune',
  },
];

const VARIANT_SIZES = ['small', 'medium', 'large'] as const;

/** Surfaces aligned with **All variants** so docs previews match Storybook demos. */
const DOCS_PREVIEW_SURFACE = {
  onLight: '#ffffff',
  onDark: '#0d0d0d',
} as const;

const meta = {
  title: 'Typography/Utility/EyebrowLabel',
  component: EyebrowLabel,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: EYEBROW_LABEL_SIZES,
      description: 'Size of the eyebrow label text treatment.',
    },
    color: {
      control: 'select',
      options: EYEBROW_LABEL_COLORS,
      description: 'Visual color mode: neutral, brand, or live.',
    },
    logo: {
      control: 'boolean',
      description:
        'When true, shows the active brand logo on the left (hidden when color is live or isSubscriberOnly).',
    },
    isSubscriberOnly: {
      control: 'boolean',
      description:
        'Subscriber-only: leading key icon; brand logo is not shown (same suppression rule as live).',
    },
    logoColor: {
      control: 'select',
      options: Object.keys(ICON_COLOR_TOKENS) as (keyof typeof ICON_COLOR_TOKENS)[],
      description: 'Semantic icon color for the logo. Leave unset to match eyebrow text.',
      if: { arg: 'logo' },
    },
    background: {
      control: 'select',
      options: EYEBROW_LABEL_BACKGROUNDS,
      description: 'Text contrast context for on-light or on-dark surfaces.',
    },
    isBackground: {
      control: 'boolean',
      description: 'Legacy boolean toggle for on-dark/on-light mapping.',
    },
    as: {
      control: 'select',
      options: EYEBROW_LABEL_AS_ELEMENTS,
      description: 'HTML element to render.',
    },
  },
} satisfies Meta<typeof EyebrowLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'Label',
    size: 'medium',
    color: 'neutral',
    logo: false,
    background: 'on-light',
    isBackground: false,
    brand: 'startribune',
    isSubscriberOnly: false,
    as: 'span',
  },
};

/**
 * Each doc example keeps **`args`** and spreads **`{…args}`** in **`render`** so Storybook MDX **`Canvas`**
 * resolves correctly (Stories that only used **`render`** without **`args`** can fall back to component defaults).
 */
export const DocsNeutralMediumOnLight: Story = {
  tags: ['!dev'],
  args: {
    size: 'medium',
    color: 'neutral',
    background: 'on-light',
    label: 'Label',
    logo: false,
    brand: 'startribune',
  },
  parameters: {
    chromatic: { disable: true },
    controls: { disable: true },
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-block',
        padding: '1rem',
        background: DOCS_PREVIEW_SURFACE.onLight,
        borderRadius: '0.25rem',
      }}
    >
      <EyebrowLabel {...args} />
    </div>
  ),
};

export const DocsBrandLargeOnDark: Story = {
  tags: ['!dev'],
  args: {
    size: 'large',
    color: 'brand',
    background: 'on-dark',
    logo: true,
    brand: 'startribune',
    label: 'Label',
  },
  parameters: {
    chromatic: { disable: true },
    controls: { disable: true },
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-block',
        padding: '1rem',
        background: DOCS_PREVIEW_SURFACE.onDark,
        borderRadius: '0.25rem',
      }}
    >
      <EyebrowLabel {...args} />
    </div>
  ),
};

export const DocsBrandLargeOnLight: Story = {
  tags: ['!dev'],
  args: {
    size: 'large',
    color: 'brand',
    background: 'on-light',
    logo: true,
    brand: 'startribune',
    label: 'Label',
  },
  parameters: {
    chromatic: { disable: true },
    controls: { disable: true },
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-block',
        padding: '1rem',
        background: DOCS_PREVIEW_SURFACE.onLight,
        borderRadius: '0.25rem',
      }}
    >
      <EyebrowLabel {...args} />
    </div>
  ),
};

export const DocsLiveSmallOnLight: Story = {
  tags: ['!dev'],
  args: {
    size: 'small',
    color: 'live',
    background: 'on-light',
    label: 'Live',
    logo: false,
    brand: 'startribune',
    isSubscriberOnly: false,
  },
  parameters: {
    chromatic: { disable: true },
    controls: { disable: true },
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-block',
        padding: '1rem',
        background: DOCS_PREVIEW_SURFACE.onLight,
        borderRadius: '0.25rem',
      }}
    >
      <EyebrowLabel {...args} />
    </div>
  ),
};

export const DocsSubscriberOnlyMediumOnLight: Story = {
  tags: ['!dev'],
  args: {
    size: 'medium',
    color: 'neutral',
    background: 'on-light',
    label: 'Subscriber only',
    logo: false,
    brand: 'startribune',
    isSubscriberOnly: true,
  },
  parameters: {
    chromatic: { disable: true },
    controls: { disable: true },
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-block',
        padding: '1rem',
        background: DOCS_PREVIEW_SURFACE.onLight,
        borderRadius: '0.25rem',
      }}
    >
      <EyebrowLabel {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
      {EYEBROW_LABEL_BACKGROUNDS.map((background) => (
        <section
          key={background}
          style={{
            background: background === 'on-dark' ? '#0d0d0d' : '#ffffff',
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        >
          <h3
            style={{
              margin: '0 0 1rem',
              color: background === 'on-dark' ? '#ffffff' : '#111111',
              fontFamily: 'sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {background}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))',
              gap: '1.25rem',
              alignItems: 'start',
            }}
          >
            {VARIANT_SIZES.map((size, columnIndex) => (
              <div
                key={size}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}
              >
                <h4
                  style={{
                    margin: '0',
                    paddingBottom: '4px',
                    borderBottom: background === 'on-dark' ? '1px solid #333' : '1px solid #e5e5e5',
                    color: background === 'on-dark' ? '#e5e5e5' : '#525252',
                    fontFamily: 'sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {size}
                </h4>
                {ALL_VARIANT_ROWS.map(({ key, label, ...variantProps }) => (
                  <EyebrowLabel
                    key={`${background}-${size}-${key}`}
                    {...variantProps}
                    label={label}
                    size={size}
                    background={background}
                    dataTestId={`eyebrow-all-${columnIndex}-${key}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

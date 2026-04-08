import type { ComponentType, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, BUTTON_COLORS, BUTTON_SIZES, BUTTON_VARIANTS, type ButtonSize } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { AvatarIcon } from '@/icons';
import { allModes } from '@storybook-config/modes';

type ConfigurableArgs = {
  count: number;
  maxWidth: number;
  variant: (typeof BUTTON_VARIANTS)[number];
  color: (typeof BUTTON_COLORS)[number];
  size: ButtonSize;
  showIcon: boolean;
  iconOnly: boolean;
};

const meta: Meta<ConfigurableArgs> = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup as unknown as ComponentType<ConfigurableArgs>,
  argTypes: {
    count: {
      control: { type: 'number', min: 1, max: 24, step: 1 },
      description: 'Storybook-only control (not a ButtonGroup prop): how many buttons to render.',
    },
    maxWidth: {
      control: { type: 'number', min: 180, max: 900, step: 20 },
      description:
        'Storybook-only control (not a ButtonGroup prop): container width for wrapping preview.',
    },
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS] as string[],
    },
    color: {
      control: 'select',
      options: [...BUTTON_COLORS] as string[],
    },
    size: {
      control: 'select',
      options: [...BUTTON_SIZES] as string[],
    },
    showIcon: {
      control: 'boolean',
      description: 'When true, each button includes AvatarIcon.',
    },
    iconOnly: {
      control: 'boolean',
      description: 'When true, buttons render icon-only and use aria-label.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sectionTitleStyle: CSSProperties = {
  marginBottom: '1rem',
  fontSize: '14px',
  fontWeight: 600,
};

export const Configurable: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ButtonGroup>
  <Button
    variant="outlined"
    color="neutral"
    size="small"
    icon={<AvatarIcon />}
    aria-label="Button 1"
    onClick={() => undefined}
  />
  <Button
    variant="outlined"
    color="neutral"
    size="small"
    onClick={() => undefined}
  >
    Button 2
  </Button>
</ButtonGroup>`,
      },
    },
  },
  args: {
    count: 8,
    maxWidth: 360,
    variant: 'outlined',
    color: 'neutral',
    size: 'small',
    showIcon: false,
    iconOnly: false,
  } as ConfigurableArgs,
  render: (args) => {
    const { count, maxWidth, variant, color, size, showIcon, iconOnly } = args as ConfigurableArgs;

    return (
      <div style={{ maxWidth }}>
        <ButtonGroup>
          {Array.from({ length: count }, (_, index) => {
            const label = `Button ${index + 1}`;
            return (
              <Button
                key={index}
                variant={variant}
                color={color}
                size={size}
                icon={showIcon ? <AvatarIcon /> : undefined}
                aria-label={iconOnly ? label : undefined}
                onClick={() => undefined}
              >
                {iconOnly ? undefined : label}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
    );
  },
};

/**
 * Icon-only, text, and wrapping layouts in one canvas — used for Chromatic visual regression.
 */
export const AllVariants: Story = {
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={sectionTitleStyle}>Icon buttons</h3>
        <ButtonGroup>
          <Button
            variant="outlined"
            color="neutral"
            size="medium"
            icon={<AvatarIcon />}
            aria-label="First icon button"
            onClick={() => undefined}
          />
          <Button
            variant="outlined"
            color="neutral"
            size="medium"
            icon={<AvatarIcon />}
            aria-label="Second icon button"
            onClick={() => undefined}
          />
          <Button
            variant="outlined"
            color="neutral"
            size="medium"
            icon={<AvatarIcon />}
            aria-label="Third icon button"
            onClick={() => undefined}
          />
        </ButtonGroup>
      </div>

      <div>
        <h3 style={sectionTitleStyle}>Text buttons</h3>
        <div style={{ maxWidth: 280 }}>
          <ButtonGroup>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              One
            </Button>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              Two
            </Button>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              Three
            </Button>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              Four
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div>
        <h3 style={sectionTitleStyle}>Many buttons wrapping</h3>
        <div style={{ maxWidth: 380 }}>
          <ButtonGroup>
            {Array.from({ length: 20 }, (_, index) => (
              <Button
                key={index}
                variant="outlined"
                color="neutral"
                size="small"
                onClick={() => undefined}
              >
                Button {index + 1}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
};

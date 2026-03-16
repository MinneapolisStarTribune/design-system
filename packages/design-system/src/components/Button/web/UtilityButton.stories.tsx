import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  UtilityButton,
  BUTTON_COLORS,
  BUTTON_SIZES,
  type ButtonSize,
} from './UtilityButton';
import styles from './UtilityButton.module.scss';
import { iconOptions } from '@/components/Icon/iconOptions';
import { IconName } from '@/components/Icon/iconNames';
import { NewsHeading } from '@/components/index.web';
import { allModes } from '@storybook-config/modes';

const meta = {
  title: 'Actions/UtilityButton',
  component: UtilityButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The utility button label text',
    },
    variant: {
      control: 'select',
      options: ['default'] as string[],
      description: 'The variant of the utility button',
    },
    size: {
      control: 'select',
      options: [...BUTTON_SIZES] as string[],
      description: 'The size of the utility button',
    },
    icon: {
      control: 'select',
      options: Object.keys(iconOptions) as IconName[],
      description: 'Optional icon to display in the utility button',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the utility button is disabled',
    },
  },
} satisfies Meta<typeof UtilityButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'Share',
    onClick: () => alert('Utility button clicked'),
    variant: 'default',
    size: 'large',
    color: 'neutral',
    icon: undefined,
    isDisabled: false,
  },
};

function renderUtilityButtonSection(
  title: string,
  sizes: readonly ButtonSize[],
  withIcon: boolean,
  showFocusedExample: boolean = false
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
        {BUTTON_COLORS.map((color) => (
          <div
            key={color}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
              gap: '1rem',
            }}
          >
            {sizes.map((size) => (
              <div
                key={`${color}-${size}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <UtilityButton
                  {
                    ...({
                      variant: 'default',
                      color,
                      size,
                      icon: withIcon ? 'avatar' : undefined,
                      // Only non-icon-only buttons should render the text label.
                      ...(withIcon ? {} : { label: 'Share' }),
                      isDisabled: color === BUTTON_COLORS[BUTTON_COLORS.length - 1],
                      className:
                        showFocusedExample &&
                        color === 'brand' &&
                        (size === 'small' || size === 'large')
                          ? styles['storybook-focus']
                          : undefined,
                    } as any)
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderUtilityButtonTextRightSection(
  title: string,
  sizes: readonly ButtonSize[],
  showFocusedExample: boolean = false
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
        {BUTTON_COLORS.map((color) => (
          <div
            key={color}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
              gap: '1rem',
            }}
          >
            {sizes.map((size) => (
              <div
                key={`${color}-${size}-text-right`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <UtilityButton
                  variant="default"
                  color={color}
                  size={size}
                  icon="avatar"
                  label="Share"
                  isDisabled={color === BUTTON_COLORS[BUTTON_COLORS.length - 1]}
                  className={
                    showFocusedExample &&
                    color === 'brand' &&
                    (size === 'small' || size === 'large')
                      ? styles['storybook-focus']
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export const AllUtilityButtons: Story = {
  args: {
    label: 'Share',
    variant: 'default',
    size: 'large',
    color: 'neutral',
  },
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '2rem' }}>
      {renderUtilityButtonSection('Utility buttons', BUTTON_SIZES, false, true)}
      {renderUtilityButtonSection('Utility buttons icon only', BUTTON_SIZES, true, true)}
      {renderUtilityButtonTextRightSection(
        'Utility buttons with icon and label',
        BUTTON_SIZES,
        true
      )}
    </div>
  ),
};


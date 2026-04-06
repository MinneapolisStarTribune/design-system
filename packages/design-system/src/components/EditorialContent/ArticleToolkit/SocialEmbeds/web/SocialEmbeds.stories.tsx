import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialEmbeds } from './SocialEmbeds';
import type { SocialEmbedsProps } from '../SocialEmbed.types';
import React from 'react';

/**
 * Story-only control for platform content
 */
type StoryPlatform = 'instagram' | 'facebook' | 'twitter' | 'threads';

/**
 * Story args (we control children via render)
 */
type StoryArgs = Omit<SocialEmbedsProps, 'children'> & {
  platform: StoryPlatform;
};

const meta: Meta<StoryArgs> = {
  title: 'Editorial Content/Article Toolkit/SocialEmbeds',
  component: SocialEmbeds as unknown as React.ComponentType<StoryArgs>,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disable: true },
  },
  argTypes: {
    platform: {
      control: 'select',
      options: ['instagram', 'facebook', 'twitter', 'threads'],
      description: 'Platform identifier for styling and analytics',
    },
    variant: {
      control: 'select',
      options: ['standard', 'inline', 'full'],
      description: 'Controls layout width and spacing',
    },
    className: {
      control: 'text',
      description: 'Custom class name for root element',
    },
    dataTestId: {
      control: 'text',
      description: 'Test identifier mapped to data-testid',
    },
    style: {
      control: 'object',
      description: 'Inline styles applied to root element',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the container',
    },
    'aria-describedby': {
      control: 'text',
      description: 'References element that describes the container',
    },
    'aria-hidden': {
      control: 'boolean',
      description: 'Hides element from assistive technologies',
    },
    role: {
      control: 'text',
      description: 'Defines semantic role',
    },
    tabIndex: {
      control: 'number',
      description: 'Controls keyboard focus',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const getMockEmbed = (platform: StoryPlatform) => {
  return (
    <div
      style={{
        width: '100%',
        height: 400,
        borderRadius: 'var(--radius-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {platform.toUpperCase()} EMBED
    </div>
  );
};

export const Configurable: Story = {
  args: {
    platform: 'instagram',
    variant: 'standard',
  },
  render: (args) => {
    const { platform, ...rest } = args;

    return (
      <SocialEmbeds {...rest} platform={platform}>
        {getMockEmbed(platform)}
      </SocialEmbeds>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => {
    const platforms: StoryPlatform[] = ['instagram', 'facebook', 'twitter', 'threads'];

    const variants: SocialEmbedsProps['variant'][] = ['standard', 'inline', 'full'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3
              style={{
                marginBottom: 16,
                color: 'var(--color-text-on-light-secondary)',
              }}
            >
              {variant}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {platforms.map((platform) => (
                <SocialEmbeds key={platform} platform={platform} variant={variant}>
                  {getMockEmbed(platform)}
                </SocialEmbeds>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

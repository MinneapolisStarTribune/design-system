import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, Text, View } from 'react-native';
import { SOCIAL_EMBED_PLATFORMS, SOCIAL_EMBEDS_VARIANTS } from '../SocialEmbed.types';
import { SocialEmbeds } from './SocialEmbeds.native';

const meta = {
  title: 'Editorial Content/Article Toolkit/SocialEmbeds',
  component: SocialEmbeds,
  argTypes: {
    platform: {
      control: 'select',
      options: SOCIAL_EMBED_PLATFORMS,
    },
    variant: {
      control: 'select',
      options: SOCIAL_EMBEDS_VARIANTS,
    },
    dataTestId: {
      control: 'text',
    },
    accessibilityLabel: {
      control: 'text',
    },
  },
} satisfies Meta<typeof SocialEmbeds>;

export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = ({ text }: { text: string }) => (
  <View style={styles.placeholder}>
    <Text>{text}</Text>
  </View>
);

export const Configurable: Story = {
  args: {
    platform: 'instagram',
    variant: 'standard',
    dataTestId: 'social-embeds',
    accessibilityLabel: 'Social embed container',
  },
  render: (args) => (
    <SocialEmbeds {...args}>
      <Placeholder text="Embedded content placeholder" />
    </SocialEmbeds>
  ),
};

export const PlatformsAndVariants: Story = {
  args: {
    platform: 'instagram',
    variant: 'standard',
    dataTestId: 'social-embeds',
    accessibilityLabel: 'Social embed container',
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <View style={styles.grid}>
      {SOCIAL_EMBED_PLATFORMS.flatMap((platform) =>
        SOCIAL_EMBEDS_VARIANTS.map((variant) => (
          <View key={`${platform}-${variant}`} style={styles.item}>
            <Text style={styles.heading}>
              {platform} / {variant}
            </Text>
            <SocialEmbeds
              platform={platform}
              variant={variant}
              accessibilityLabel={`${platform} ${variant} embed`}
              dataTestId={`social-embeds-${platform}-${variant}`}
            >
              <Placeholder text="Embedded content placeholder" />
            </SocialEmbeds>
          </View>
        ))
      )}
    </View>
  ),
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    gap: 16,
  },
  item: {
    gap: 8,
  },
  heading: {
    fontSize: 13,
    fontWeight: '600',
  },
  placeholder: {
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 8,
    padding: 12,
  },
});

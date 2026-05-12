import { useCallback, useContext } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, Text, View } from 'react-native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
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

function useStoryStyles() {
  const ctx = useContext(DesignSystemContext);
  const isDark = ctx?.colorScheme === 'dark';

  return useNativeStyles(
    useCallback(
      (theme) =>
        StyleSheet.create({
          grid: {
            width: '100%',
            gap: theme.spacing16,
          },
          item: {
            gap: theme.spacing8,
          },
          placeholder: {
            borderWidth: 1,
            borderColor: isDark
              ? theme.colorBorderOnDarkSubtle01
              : theme.colorBorderOnLightSubtle01,
            borderRadius: theme.radius8,
            padding: theme.spacing12,
          },
          placeholderText: {
            color: isDark ? theme.colorTextOnDarkPrimary : theme.colorTextOnLightPrimary,
          },
        }),
      [isDark]
    )
  );
}

const Placeholder = ({ text }: { text: string }) => {
  const styles = useStoryStyles();
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{text}</Text>
    </View>
  );
};

const AllPlatformsAndVariantsPreview = () => {
  const styles = useStoryStyles();

  return (
    <View style={styles.grid}>
      {SOCIAL_EMBED_PLATFORMS.flatMap((platform) =>
        SOCIAL_EMBEDS_VARIANTS.map((variant) => (
          <View key={`${platform}-${variant}`} style={styles.item}>
            <UtilityLabel size="small" weight="semibold">
              {platform} / {variant}
            </UtilityLabel>
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
  );
};

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

export const AllVariants: Story = {
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
  render: () => <AllPlatformsAndVariantsPreview />,
};

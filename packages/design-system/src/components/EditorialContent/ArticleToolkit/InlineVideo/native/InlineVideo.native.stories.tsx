import type { Meta, StoryObj } from '@storybook/react';
import {
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ARTICLE_BODY_VARIANTS, INLINE_VIDEO_ORIENTATIONS } from '../../types';
import { InlineVideo, type InlineVideoProps } from './InlineVideo.native';

const SAMPLE_HORIZONTAL_VIDEO = 'https://placeholdervideo.dev/1280x720';
const SAMPLE_HORIZONTAL_POSTER = 'https://picsum.photos/id/1018/1200/800';
const SAMPLE_VERTICAL_VIDEO = 'https://placeholdervideo.dev/360x640';
const SAMPLE_VERTICAL_POSTER = 'https://picsum.photos/id/1018/640/360';

const meta = {
  title: 'Editorial Content/Article Toolkit/Inline Video',
  component: InlineVideo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Native InlineVideo provides the editorial container, caption, and credit. Consumers provide the actual native video player as children.',
      },
    },
  },
  argTypes: {
    caption: {
      control: 'text',
      description: 'Caption displayed below the player.',
    },
    videoCredit: {
      control: 'text',
      description: 'Attribution / credit appended after the caption.',
    },
    posterUrl: {
      control: 'text',
      description: 'Poster / thumbnail URL. Forwarded to the consumer player.',
    },
    orientation: {
      control: 'radio',
      options: INLINE_VIDEO_ORIENTATIONS,
      description: 'Crop orientation for the video slot.',
    },
    variant: {
      control: 'radio',
      options: Object.values(ARTICLE_BODY_VARIANTS),
      description: 'Article body variant: standard or immersive.',
    },
    children: {
      control: false,
      description: 'Player slot. Consumer provides a native video player.',
    },
  },
} satisfies Meta<typeof InlineVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs: InlineVideoProps = {
  posterUrl: SAMPLE_HORIZONTAL_POSTER,
  caption: 'General Manager Heather Ann Mady with Moua outside the building.',
  videoCredit: 'Rebecca McApline/Star Tribune',
  variant: 'standard',
  orientation: 'horizontal',
  dataTestId: 'inline-video-native-demo',
  'aria-label': 'Video: General Manager interview',
};

function StoryPlayer({
  orientation,
  posterUrl,
}: Pick<InlineVideoProps, 'orientation' | 'posterUrl'>) {
  const isVertical = orientation === 'vertical';
  const videoUrl = isVertical ? SAMPLE_VERTICAL_VIDEO : SAMPLE_HORIZONTAL_VIDEO;
  const fallbackPosterUrl = isVertical ? SAMPLE_VERTICAL_POSTER : SAMPLE_HORIZONTAL_POSTER;

  return (
    <ImageBackground
      source={{ uri: posterUrl || fallbackPosterUrl }}
      resizeMode="cover"
      style={[styles.player, isVertical && styles.playerVertical]}
    >
      <Pressable
        accessibilityLabel="Play sample video"
        accessibilityRole="button"
        onPress={() => {
          void Linking.openURL(videoUrl);
        }}
        style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
      >
        <Text style={styles.playButtonText}>Play</Text>
      </Pressable>
      <Text style={styles.sourceText}>{videoUrl}</Text>
    </ImageBackground>
  );
}

function renderWithPlayer(args: InlineVideoProps) {
  const {
    brand: _brand,
    mode: _mode,
    ...inlineVideoArgs
  } = args as InlineVideoProps & {
    brand?: string;
    mode?: string;
  };

  return (
    <InlineVideo {...inlineVideoArgs} style={styles.inlineVideo}>
      <StoryPlayer
        orientation={inlineVideoArgs.orientation}
        posterUrl={inlineVideoArgs.posterUrl}
      />
    </InlineVideo>
  );
}

export const Configurable: Story = {
  args: defaultArgs,
  render: renderWithPlayer,
};

export const AllVariants: Story = {
  args: defaultArgs,
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: (args) => {
    const cases: {
      title: string;
      props: Partial<InlineVideoProps>;
    }[] = [
      {
        title: 'Standard - Horizontal',
        props: {
          variant: 'standard',
          orientation: 'horizontal',
          posterUrl: SAMPLE_HORIZONTAL_POSTER,
        },
      },
      {
        title: 'Immersive - Horizontal',
        props: {
          variant: 'immersive',
          orientation: 'horizontal',
          posterUrl: SAMPLE_HORIZONTAL_POSTER,
        },
      },
      {
        title: 'Standard - Vertical',
        props: {
          variant: 'standard',
          orientation: 'vertical',
          posterUrl: SAMPLE_VERTICAL_POSTER,
        },
      },
      {
        title: 'Immersive - Vertical',
        props: {
          variant: 'immersive',
          orientation: 'vertical',
          posterUrl: SAMPLE_VERTICAL_POSTER,
        },
      },
    ];

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        {cases.map(({ title, props }) => {
          const storyArgs = {
            ...(args as InlineVideoProps),
            ...props,
            dataTestId: `inline-video-native-${title.toLowerCase().replaceAll(' ', '-')}`,
          };

          return (
            <View key={title} style={styles.case}>
              <Text style={styles.title}>{title}</Text>
              {renderWithPlayer(storyArgs)}
            </View>
          );
        })}
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
  },
  case: {
    gap: 12,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  inlineVideo: {
    gap: 8,
    width: '100%',
  },
  player: {
    alignItems: 'center',
    aspectRatio: 16 / 9,
    backgroundColor: '#111111',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  playerVertical: {
    alignSelf: 'center',
    aspectRatio: 9 / 16,
    maxWidth: 280,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 999,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  playButtonPressed: {
    opacity: 0.8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sourceText: {
    bottom: 10,
    color: '#FFFFFF',
    fontSize: 10,
    left: 10,
    position: 'absolute',
    right: 10,
  },
});

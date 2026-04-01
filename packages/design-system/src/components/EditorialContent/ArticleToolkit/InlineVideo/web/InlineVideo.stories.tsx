import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineVideo } from './InlineVideo';
import type { InlineVideoProps } from '../InlineVideo.types';
import { ARTICLE_BODY_VARIANTS, INLINE_VIDEO_ORIENTATIONS } from '../../types';

const SAMPLE_HORIZONTAL_VIDEO = 'https://placeholdervideo.dev/1280x720';
const SAMPLE_HORIZONTAL_POSTER = 'https://picsum.photos/id/1018/1200/800';
const SAMPLE_VERTICAL_VIDEO = 'https://placeholdervideo.dev/360x640';
const SAMPLE_VERTICAL_POSTER = 'https://picsum.photos/id/1018/640/360';

const meta: Meta<InlineVideoProps> = {
  title: 'Editorial Content/Article Toolkit/Inline Video',
  component: InlineVideo,
  parameters: {
    layout: 'fullscreen',
    docs: { source: { type: 'dynamic' } },
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
      description: 'Poster / thumbnail URL. Forwarded to the consumer player via children.',
    },
    orientation: {
      control: 'radio',
      options: INLINE_VIDEO_ORIENTATIONS,
      description:
        'Crop orientation. Horizontal (16:9) is standard widescreen; Vertical (9:16) is portrait/social.',
    },
    variant: {
      control: 'radio',
      options: Object.values(ARTICLE_BODY_VARIANTS),
      description:
        'Layout variant. "immersive" bleeds edge-to-edge on mobile/tablet with sharp edges; contained with brand radius on desktop.',
    },
    children: {
      control: false,
      description: 'Player slot. Consumer provides JW Player, native <video>, or any element.',
    },
  },
};

export default meta;

type Story = StoryObj<InlineVideoProps>;

const defaultArgs: InlineVideoProps = {
  posterUrl: SAMPLE_HORIZONTAL_POSTER,
  caption: 'A time-lapse of the Minnesota landscape captured at sunrise.',
  videoCredit: 'Star Tribune staff / The Minnesota Star Tribune',
  variant: 'standard',
  orientation: 'horizontal',
};

const renderWithPlayer = (args: InlineVideoProps) => (
  <InlineVideo {...args}>
    <video
      src={args.orientation === 'horizontal' ? SAMPLE_HORIZONTAL_VIDEO : SAMPLE_VERTICAL_VIDEO}
      poster={args.posterUrl}
      controls
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </InlineVideo>
);

export const Configurable: Story = {
  args: defaultArgs,
  render: renderWithPlayer,
};

export const Standard: Story = {
  args: {
    ...defaultArgs,
    variant: 'standard',
  },
  render: renderWithPlayer,
};

export const Immersive: Story = {
  args: {
    ...defaultArgs,
    variant: 'immersive',
  },
  render: renderWithPlayer,
};

export const Horizontal: Story = {
  args: {
    ...defaultArgs,
    orientation: 'horizontal',
  },
  render: renderWithPlayer,
};

export const Vertical: Story = {
  args: {
    ...defaultArgs,
    orientation: 'vertical',
    posterUrl: SAMPLE_VERTICAL_POSTER,
  },
  render: renderWithPlayer,
};

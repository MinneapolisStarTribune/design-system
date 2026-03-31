import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineVideo } from './InlineVideo';
import type { InlineVideoProps } from '../InlineVideo.types';
import { ARTICLE_BODY_VARIANTS, INLINE_VIDEO_ORIENTATIONS } from '../../types';

const SAMPLE_VIDEO = 'https://placeholdervideo.dev/1280x720';
const SAMPLE_POSTER = 'https://picsum.photos/id/1018/1200/800';

const meta: Meta<InlineVideoProps> = {
  title: 'Editorial Content/Article Toolkit/Inline Video',
  component: InlineVideo,
  parameters: {
    layout: 'centered',
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
  posterUrl: SAMPLE_POSTER,
  caption: 'A time-lapse of the Minnesota landscape captured at sunrise.',
  videoCredit: 'Star Tribune staff / The Minnesota Star Tribune',
  variant: 'standard',
  orientation: 'horizontal',
};

const renderWithPlayer = (args: InlineVideoProps) => (
  <InlineVideo {...args}>
    <video src={SAMPLE_VIDEO} poster={args.posterUrl} />
  </InlineVideo>
);

export const Configurable: Story = {
  args: defaultArgs,
  render: renderWithPlayer,
};

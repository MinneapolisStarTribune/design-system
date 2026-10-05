import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { CoachmarkProps } from '../Coachmark.types';
import { Coachmark } from './Coachmark';
import { Button, COACHMARK_ALIGNMENTS, COACHMARK_POSITIONS } from '@/components/index.web';
import { ChevronRightIcon, StarIcon } from '@/icons';

const meta = {
  title: 'Feedback & Status/Coachmark',
  component: Coachmark,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    open: { control: false },
    onOpenChange: { control: false },
    icon: { control: false },
    badgeText: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    ctaText: { control: 'text' },
    actionHref: { control: 'text' },
    onAction: { control: false },
    secondaryContent: { control: false },
    position: {
      control: 'select',
      options: COACHMARK_POSITIONS,
    },
    alignment: {
      control: 'select',
      options: COACHMARK_ALIGNMENTS,
    },
    dismissOnOutsideClick: { control: 'boolean' },
    zIndex: { control: 'number' },
  },
} satisfies Meta<typeof Coachmark>;

export default meta;
type Story = StoryObj<typeof meta>;

// Each story below renders its own controlled instance with local `open` state, ignoring these --
// they only satisfy the required open/onOpenChange/children props for the type checker.
const baseArgs = {
  open: true,
  onOpenChange: () => {},
  children: <Button>Show coachmark</Button>,
  title: 'Title',
  description: 'Description',
};

type StoryCoachmarkProps = Omit<CoachmarkProps, 'open' | 'onOpenChange' | 'children'> & {
  anchorLabel?: string;
};

/**
 * A coachmark is opened externally (e.g. by Piano), never by its own anchor -- pressing the anchor
 * dismisses it instead. So the anchor here is a plain button, and a separate "Show coachmark"
 * button (disabled while it's open) stands in for the external trigger. Toggling from the anchor
 * itself would dismiss on pointerdown and then immediately reopen on click.
 */
const StoryCoachmark = ({ anchorLabel = 'Anchor', ...props }: StoryCoachmarkProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <Coachmark {...props} open={open} onOpenChange={setOpen}>
        <Button>{anchorLabel}</Button>
      </Coachmark>
      <Button variant="outlined" size="small" isDisabled={open} onClick={() => setOpen(true)}>
        Show coachmark
      </Button>
    </div>
  );
};

/**
 * A dismissible, pointed callout for an unprompted, single action -- e.g. a CMS-driven prompt to
 * create an account or favorite something. Unlike Tooltip, it's always externally controlled via
 * `open`/`onOpenChange` (it never opens itself on hover/focus/click), so this playground toggles
 * it with its own trigger button.
 */
export const Configurable: Story = {
  args: {
    // `render` below builds its own controlled instance -- these just satisfy the required
    // open/onOpenChange/children props for Storybook's Controls panel and the type checker.
    open: true,
    onOpenChange: () => {},
    children: <Button>Show coachmark</Button>,
    title: 'Never miss a story',
    description: 'Create a free account to save articles for later.',
    ctaText: 'Create Free Account',
    position: 'bottom-center',
    dismissOnOutsideClick: false,
  },
  render: ({ open: _open, onOpenChange: _onOpenChange, children: _children, ...args }) => (
    <StoryCoachmark {...args} />
  ),
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(true);

<Coachmark
  open={open}
  onOpenChange={setOpen}
  title="Never miss a story"
  description="Create a free account to save articles for later."
  ctaText="Create Free Account"
>
  <Button>Newsletters</Button>
</Coachmark>
        `,
      },
    },
  },
};

/**
 * Every variant/combination rendered statically for Chromatic visual regression -- alignment,
 * icon, badge, secondary content, and all eight `position` values. 'top'/'bottom' positions open
 * above/below the trigger (with 'left'/'right'/'center' controlling where along that edge);
 * 'center-left'/'center-right' open beside the trigger instead, vertically centered -- e.g. for a
 * trigger flush against a screen edge with no room above/below. The flip middleware auto-flips
 * any of these when there isn't room (e.g. near a viewport edge, or scrolled close to it).
 */
export const AllVariants: Story = {
  args: baseArgs,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 280, padding: 80, width: '100%' }}>
      <div>
        <h3 style={{ marginBottom: 24 }}>Default (centered)</h3>
        <StoryCoachmark
          title="Never miss a story"
          description="Create a free account to save articles for later."
          ctaText="Create Free Account"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: 24 }}>alignment=left</h3>
        <StoryCoachmark
          title="Never miss a story"
          description="Create a free account to save articles for later."
          ctaText="Create Free Account"
          alignment="left"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: 24 }}>With icon</h3>
        <StoryCoachmark
          title="Added to favorites"
          description="You'll now see updates for this team in your feed."
          icon={<StarIcon size="x-large" color="on-dark-primary" />}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: 24 }}>With badge</h3>
        <StoryCoachmark
          title="Explore Athlete Pages"
          description="Tap on any athlete's name to visit their page and view their season stats, games, media and more."
          // PianoCoachmark always renders `icon` as an <img> from a CMS-supplied URL (see its
          // own icon prop), never a design-system icon component -- mirrored here, at the same
          // 35x35 size (PianoCoachmark.module.scss's .icon), for an accurate preview.
          icon={
            <img
              src="https://static.startribune.com/assets/piano/coach-mark/star.svg"
              alt=""
              aria-hidden="true"
              style={{ width: 35, height: 35 }}
            />
          }
          badgeText="New"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: 24 }}>With secondary content</h3>
        <StoryCoachmark
          title="Never miss a story"
          description="Create a free account to save articles for later."
          ctaText="Create Free Account"
          secondaryContent={
            // Matches the actual typography real consumers use for this slot (e.g.
            // startribune-web's own login prompt): Graphik regular/medium at 12px, not a bare
            // browser-default span -- otherwise this story understates how large the text
            // really is.
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
              <span className="typography-utility-text-regular-x-small">
                Already have an account?
              </span>
              <span
                className="typography-utility-text-medium-x-small"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
              >
                Log in
                <ChevronRightIcon size="x-small" />
              </span>
            </span>
          }
        />
      </div>
      {COACHMARK_POSITIONS.map((position) => (
        <div key={position}>
          <h3 style={{ marginBottom: 24 }}>{`position="${position}"`}</h3>
          <div
            // 'center-left'/'center-right' open beside the trigger, at the same height as the
            // label above -- shifting just the trigger (not the label) right gives the panel
            // room to extend left without reaching back far enough to cover that label text.
            style={
              position === 'center-left' || position === 'center-right'
                ? { marginLeft: 400 }
                : undefined
            }
          >
            <StoryCoachmark
              title={position}
              description="The flip middleware still auto-flips this when there isn't room."
              ctaText="Got it"
              position={position}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

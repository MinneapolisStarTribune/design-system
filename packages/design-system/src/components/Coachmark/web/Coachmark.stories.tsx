import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Coachmark } from './Coachmark';
import { Button, COACHMARK_POSITIONS } from '@/components/index.web';
import { StarIcon } from '@/icons';

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
  render: (args) => {
    const ControlledCoachmark = () => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark {...args} open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'} coachmark</Button>
        </Coachmark>
      );
    };

    return <ControlledCoachmark />;
  },
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
  <Button onClick={() => setOpen(!open)}>Show coachmark</Button>
</Coachmark>
        `,
      },
    },
  },
};

/**
 * With an icon badge above the title, and no action button -- e.g. informational content with no
 * follow-up action.
 */
export const WithIcon: Story = {
  args: baseArgs,
  render: () => {
    const ControlledCoachmark = () => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title="Added to favorites"
          description="You'll now see updates for this team in your feed."
          icon={<StarIcon size="medium" color="on-dark-primary" />}
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'} coachmark</Button>
        </Coachmark>
      );
    };

    return <ControlledCoachmark />;
  },
};

/**
 * With a "New" badge in the card's top-left corner, vertically centered 24px from the card's top
 * edge -- e.g. to flag a newly-launched feature the coachmark is introducing.
 */
export const WithBadge: Story = {
  args: baseArgs,
  render: () => {
    const ControlledCoachmark = () => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title="Explore Athlete Pages"
          description="Tap on any athlete's name to visit their page and view their season stats, games, media and more."
          icon={<StarIcon size="medium" color="on-dark-primary" />}
          badgeText="New"
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'} coachmark</Button>
        </Coachmark>
      );
    };

    return <ControlledCoachmark />;
  },
};

/**
 * With secondary content below the action button -- e.g. a login link for users who already have
 * an account.
 */
export const WithSecondaryContent: Story = {
  args: baseArgs,
  render: () => {
    const ControlledCoachmark = () => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title="Never miss a story"
          description="Create a free account to save articles for later."
          ctaText="Create Free Account"
          secondaryContent={<span style={{ fontSize: 12 }}>Already have an account? Log in</span>}
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'} coachmark</Button>
        </Coachmark>
      );
    };

    return <ControlledCoachmark />;
  },
};

/**
 * All eight `position` values, side by side. 'top'/'bottom' positions open above/below the
 * trigger (with 'left'/'right'/'center' controlling where along that edge); 'left-center'/
 * 'right-center' open beside the trigger instead, vertically centered -- e.g. for a trigger flush
 * against a screen edge with no room above/below. The flip middleware auto-flips any of these
 * when there isn't room (e.g. near a viewport edge, or scrolled close to it).
 */
export const Positions: Story = {
  args: baseArgs,
  render: () => {
    const PositionedCoachmark = ({
      position,
    }: {
      position: (typeof COACHMARK_POSITIONS)[number];
    }) => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title={position}
          description="The flip middleware still auto-flips this when there isn't room."
          ctaText="Got it"
          position={position}
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
        </Coachmark>
      );
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 160,
          padding: 160,
        }}
      >
        {COACHMARK_POSITIONS.map((position) => (
          <PositionedCoachmark key={position} position={position} />
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

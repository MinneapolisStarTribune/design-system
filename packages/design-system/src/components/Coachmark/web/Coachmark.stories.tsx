import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Coachmark } from './Coachmark';
import { Button } from '@/components/index.web';
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
    title: { control: 'text' },
    description: { control: 'text' },
    ctaText: { control: 'text' },
    actionHref: { control: 'text' },
    onAction: { control: false },
    secondaryContent: { control: false },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'center'],
    },
    align: {
      control: 'select',
      options: ['left', 'right', 'center'],
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
    position: 'bottom',
    align: 'center',
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
 * Top vs. bottom placement, side by side.
 */
export const Positions: Story = {
  args: baseArgs,
  render: () => {
    const PositionedCoachmark = ({ position }: { position: 'top' | 'bottom' }) => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title={`Opens on the ${position}`}
          description="The flip middleware still auto-flips this when there isn't room."
          ctaText="Got it"
          position={position}
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
        </Coachmark>
      );
    };

    return (
      <div style={{ display: 'flex', gap: 160, padding: 120 }}>
        <PositionedCoachmark position="top" />
        <PositionedCoachmark position="bottom" />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Left/right/center horizontal alignment relative to the trigger, side by side.
 */
export const Alignments: Story = {
  args: baseArgs,
  render: () => {
    const AlignedCoachmark = ({ align }: { align: 'left' | 'right' | 'center' }) => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title={`align="${align}"`}
          description="Independent of position's top/bottom side."
          ctaText="Got it"
          align={align}
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
        </Coachmark>
      );
    };

    return (
      <div style={{ display: 'flex', gap: 160, padding: 120 }}>
        <AlignedCoachmark align="left" />
        <AlignedCoachmark align="center" />
        <AlignedCoachmark align="right" />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * `position="center"` opts out of top/bottom entirely -- `align="left"`/`"right"` instead places
 * the coachmark to that side of the trigger, vertically centered on it. The same flip middleware
 * used for top/bottom applies here too, so a trigger flush with a screen edge (with no room on
 * its aligned side) automatically opens on the opposite side instead.
 */
export const CenterPosition: Story = {
  args: baseArgs,
  render: () => {
    const SidePlacedCoachmark = ({ align }: { align: 'left' | 'right' }) => {
      const [open, setOpen] = useState(true);

      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title={`Opens on the ${align}`}
          description="Vertically centered on the trigger instead of above/below it."
          ctaText="Got it"
          position="center"
          align={align}
        >
          <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
        </Coachmark>
      );
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 240,
          padding: 120,
        }}
      >
        <SidePlacedCoachmark align="left" />
        <SidePlacedCoachmark align="right" />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

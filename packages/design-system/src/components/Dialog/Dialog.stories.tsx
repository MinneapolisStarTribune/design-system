import { type ReactNode, type Ref, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Dialog from './Dialog';
import { DIALOG_ROLES } from './Dialog.constants';
import type { DialogProps } from './Dialog.types';
import { Button, FormControl, FormGroup } from '@/components/index.web';
import { allModes } from '@storybook-config/modes';
import styles from './Dialog.stories.module.scss';
import classNames from 'classnames';

const SPORTS = ['Baseball', 'Softball', 'Football', 'Boys Hockey', 'Girls Hockey'].map((label) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
}));

const GAME_STATUSES = ['Scheduled', 'Postponed', 'Canceled'].map((label) => ({
  value: label.toLowerCase(),
  label,
}));

const GAME_TYPES = ['Regular Season', 'Tournament'].map((label) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
}));

const AddGameContent = ({ onClose }: { onClose: () => void }) => {
  const [sport, setSport] = useState<string>();
  const [status, setStatus] = useState('scheduled');
  const [gameType, setGameType] = useState<string>();
  const [externalPartner, setExternalPartner] = useState(false);

  return (
    <>
      <Dialog.Title>Add Game</Dialog.Title>
      <Dialog.Content>
        <div className={styles.form}>
          <FormGroup>
            <FormGroup.Label>Sport</FormGroup.Label>
            <FormControl.Select
              id="dialog-story-sport"
              options={SPORTS}
              value={sport}
              onChange={setSport}
              placeholderText="Select sport..."
            />
          </FormGroup>
          <div className={styles.row}>
            <FormGroup>
              <FormGroup.Label>Game Status</FormGroup.Label>
              <FormControl.Select
                id="dialog-story-status"
                options={GAME_STATUSES}
                value={status}
                onChange={setStatus}
              />
            </FormGroup>
            <FormGroup>
              <FormGroup.Label>Game Type</FormGroup.Label>
              <FormControl.Select
                id="dialog-story-game-type"
                options={GAME_TYPES}
                value={gameType}
                onChange={setGameType}
                placeholderText="Select game type..."
              />
            </FormGroup>
          </div>
          <FormGroup>
            <FormGroup.Label optional>Game Description</FormGroup.Label>
            <FormControl.TextInput placeholderText="e.g. Class 2A Section 7 Quarterfinal" />
          </FormGroup>
          <FormGroup>
            <FormGroup.Label>Location</FormGroup.Label>
            <FormControl.TextInput placeholderText="e.g. East High School" />
          </FormGroup>
          <FormGroup>
            <FormGroup.Label optional>Livestream Link</FormGroup.Label>
            <FormControl.TextInput placeholderText="Enter URL..." />
            <FormControl.Checkbox
              label="External livestream partner"
              checked={externalPartner}
              onChange={setExternalPartner}
            />
          </FormGroup>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button color="brand" onClick={onClose}>
          Add Game
        </Button>
      </Dialog.Actions>
    </>
  );
};

const ConfirmContent = ({
  onClose,
  cancelRef,
}: {
  onClose: () => void;
  cancelRef?: Ref<HTMLElement>;
}) => {
  return (
    <>
      <Dialog.Title>Delete game?</Dialog.Title>
      <Dialog.Content>
        Are you sure you want to delete this game? This can’t be undone.
      </Dialog.Content>
      <Dialog.Actions>
        <Button ref={cancelRef} variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button color="brand" onClick={onClose}>
          Delete
        </Button>
      </Dialog.Actions>
    </>
  );
};

const meta = {
  title: 'Layout & Containers/Dialog',
  component: Dialog.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal window that asks for a decision or a short task — a bottom sheet on phones and a centered dialog from 768px up. Web only. Docs: `Dialog.mdx`.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether the top-right X icon button is rendered.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    role: {
      control: 'inline-radio',
      options: [...DIALOG_ROLES],
      description:
        'The ARIA role. Use `alertdialog` for urgent interruptions that need a response, like confirming a deletion.',
      table: {
        type: { summary: DIALOG_ROLES.join(' | ') },
        defaultValue: { summary: "'dialog'" },
      },
    },
    describeWithContent: {
      control: 'boolean',
      description:
        'Whether the content describes it via `aria-describedby`. Keep it for short messages.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: "true for role='alertdialog', false otherwise" },
      },
    },
    closeLabel: {
      control: 'text',
      description: 'Accessible label for the X icon button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Close'" } },
    },
    open: {
      control: false,
      description: 'Whether the dialog is open.',
      table: { type: { summary: 'boolean' } },
    },
    onClose: {
      action: 'onClose',
      description:
        'Called when the dialog requests a close, with its trigger (close button, Escape or overlay press). Actions set `open` themselves.',
      table: {
        type: { summary: "(reason: 'closeButton' | 'escapeKey' | 'overlayPress') => void" },
      },
    },
    initialFocus: { control: false },
    portalRoot: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    open: false,
    onClose: () => {},
    showCloseButton: true,
    role: 'dialog',
    closeLabel: 'Close',
    children: null,
  },
  render: function Render({ onClose, ...args }) {
    const [open, setOpen] = useState(false);

    const handleClose: DialogProps['onClose'] = (reason) => {
      setOpen(false);
      onClose(reason);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Add game</Button>
        <Dialog.Root {...args} open={open} onClose={handleClose}>
          <AddGameContent onClose={() => setOpen(false)} />
        </Dialog.Root>
      </>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Add game</Button>

<Dialog.Root open={open} onClose={() => setOpen(false)}>
  <Dialog.Title>Add Game</Dialog.Title>
  <Dialog.Content>
    <FormGroup>
      <FormGroup.Label>Sport</FormGroup.Label>
      <FormControl.Select id="sport" options={SPORTS} value={sport} onChange={setSport} />
    </FormGroup>
  </Dialog.Content>
  <Dialog.Actions>
    <Button variant="ghost" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button color="brand" onClick={addGame}>
      Add Game
    </Button>
  </Dialog.Actions>
</Dialog.Root>
        `,
      },
    },
  },
};

// Renders a dialog inside its own frame so variants can be compared side by side.
const VariantFrame = ({
  label,
  ariaLabel,
  showCloseButton,
  role,
  initialFocus,
  initialOpen,
  children,
}: {
  label: string;
  ariaLabel?: string;
  showCloseButton?: boolean;
  role?: DialogProps['role'];
  initialFocus?: DialogProps['initialFocus'];
  initialOpen: boolean;
  children: (onClose: () => void) => ReactNode;
}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(initialOpen);

  return (
    <figure className={styles.variant}>
      <figcaption className={classNames('typography-utility-text-regular-small', styles.caption)}>
        {label}
      </figcaption>
      <div ref={setPortalRoot} className={styles.frame}>
        <Button onClick={() => setOpen(true)}>Open</Button>
        {portalRoot && (
          <Dialog.Root
            open={open}
            onClose={() => setOpen(false)}
            portalRoot={portalRoot}
            aria-label={ariaLabel}
            showCloseButton={showCloseButton}
            role={role}
            initialFocus={initialFocus}
          >
            {children(() => setOpen(false))}
          </Dialog.Root>
        )}
      </div>
    </figure>
  );
};

export const AllVariants: Story = {
  args: {
    open: false,
    onClose: () => {},
    children: null,
  },
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'A long form, a short confirmation (an `alertdialog` that focuses Cancel and is described by its content), a dialog without the close button and one named by `aria-label`, each in its own frame. Below 768px each becomes a bottom sheet. Dialogs start open in the story canvas (and in Chromatic snapshots); on this docs page they start closed so their focus traps don’t take over the page — use Open.',
      },
    },
  },
  render: function Render(_args, { viewMode }) {
    const initialOpen = viewMode !== 'docs';
    const cancelRef = useRef<HTMLElement>(null);

    return (
      <div className={styles.grid}>
        <VariantFrame label="Form with title, content and actions" initialOpen={initialOpen}>
          {(onClose) => <AddGameContent onClose={onClose} />}
        </VariantFrame>
        <VariantFrame
          label='Confirmation (role="alertdialog", initialFocus on Cancel)'
          role="alertdialog"
          initialFocus={cancelRef}
          initialOpen={initialOpen}
        >
          {(onClose) => <ConfirmContent onClose={onClose} cancelRef={cancelRef} />}
        </VariantFrame>
        <VariantFrame
          label="showCloseButton={false}, single action"
          showCloseButton={false}
          initialOpen={initialOpen}
        >
          {(onClose) => (
            <>
              <Dialog.Title>Game added</Dialog.Title>
              <Dialog.Content>It’s on the schedule for both teams.</Dialog.Content>
              <Dialog.Actions>
                <Button color="brand" onClick={onClose}>
                  Done
                </Button>
              </Dialog.Actions>
            </>
          )}
        </VariantFrame>
        <VariantFrame
          label='aria-label="Game details", no title'
          ariaLabel="Game details"
          initialOpen={initialOpen}
        >
          {() => (
            <Dialog.Content>
              Kickoff moved from 6pm. Buses leave the south lot at 5:15pm.
            </Dialog.Content>
          )}
        </VariantFrame>
      </div>
    );
  },
};

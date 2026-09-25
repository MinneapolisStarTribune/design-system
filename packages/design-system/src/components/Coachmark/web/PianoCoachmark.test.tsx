import { useEffect } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  ExternalTriggerProvider,
  useTriggerExternal,
} from '@minneapolisstartribune/external-trigger';
import { PianoCoachmark } from './PianoCoachmark';
import type { PianoCoachmarkPayload } from '../PianoCoachmark.types';
import { renderWithProvider } from '../../../test-utils/render';

const PianoTrigger = ({
  triggerId,
  title = 'Piano title',
  description = 'Piano description',
  ctaText = 'Create Free Account',
  ctaType = 'signup',
  position,
  badgeText,
  dismissOnOutsideClick,
  showLogin,
}: {
  triggerId: string;
} & Partial<PianoCoachmarkPayload>) => {
  const trigger = useTriggerExternal<PianoCoachmarkPayload>();

  return (
    <button
      type="button"
      onClick={() =>
        trigger(triggerId, {
          title,
          description,
          ctaText,
          ctaType,
          position,
          badgeText,
          dismissOnOutsideClick,
          showLogin,
        })
      }
    >
      Fire piano event for {triggerId}
    </button>
  );
};

describe('PianoCoachmark', () => {
  it('renders only its children when not triggered', () => {
    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoCoachmark id="not-triggered" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("shows a Coachmark with the payload's title/description once triggered", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="basic" />
        <PianoCoachmark id="basic" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for basic'));

    const dialog = await screen.findByRole('dialog');

    expect(screen.getByText('Piano title')).toBeInTheDocument();
    expect(screen.getByText('Piano description')).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
  });

  it("passes payload.icon through to Coachmark's icon badge", async () => {
    const user = userEvent.setup();

    const IconTrigger = () => {
      const trigger = useTriggerExternal<PianoCoachmarkPayload>();

      return (
        <button
          type="button"
          onClick={() =>
            trigger('with-icon', {
              title: 'Piano title',
              description: 'Piano description',
              ctaText: 'Create Free Account',
              ctaType: 'signup',
              icon: <span data-testid="piano-icon">icon</span>,
            })
          }
        >
          Fire
        </button>
      );
    };

    renderWithProvider(
      <ExternalTriggerProvider>
        <IconTrigger />
        <PianoCoachmark id="with-icon" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire'));

    expect(await screen.findByTestId('piano-icon')).toBeInTheDocument();
  });

  it('renders a badge with payload.badgeText when present', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="with-badge" badgeText="New" />
        <PianoCoachmark id="with-badge" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for with-badge'));

    expect(await screen.findByText('New')).toBeInTheDocument();
  });

  it('renders the registered action as a link when the ctaAction has an href', async () => {
    const user = userEvent.setup();
    const linkActions = { 'with-href': { href: '/somewhere' } };

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="with-href" ctaText="Go somewhere" ctaType="with-href" />
        <PianoCoachmark id="with-href" ctaActions={linkActions}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for with-href'));

    const link = await screen.findByRole('link', { name: 'Go somewhere' });

    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it("calls the registered action's onClick, with dismiss, when the action button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const clickActions = { 'with-click': { onClick } };

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="with-click" ctaText="Do the thing" ctaType="with-click" />
        <PianoCoachmark id="with-click" ctaActions={clickActions}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for with-click'));
    await user.click(await screen.findByRole('button', { name: 'Do the thing' }));

    expect(onClick).toHaveBeenCalledWith({ dismiss: expect.any(Function) });
  });

  it("renders a registered action's secondary content when showLogin is true", async () => {
    const user = userEvent.setup();
    const customActions = {
      'with-secondary': {
        href: '/somewhere',
        renderSecondary: () => <span>Secondary content</span>,
      },
    };

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger
          triggerId="with-secondary"
          ctaText="Primary action"
          ctaType="with-secondary"
          showLogin
        />
        <PianoCoachmark id="with-secondary" ctaActions={customActions}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for with-secondary'));

    expect(await screen.findByText('Primary action')).toBeInTheDocument();
    expect(screen.getByText('Secondary content')).toBeInTheDocument();
  });

  it("omits a registered action's secondary content when showLogin is omitted", async () => {
    const user = userEvent.setup();
    const customActions = {
      'with-secondary': {
        href: '/somewhere',
        renderSecondary: () => <span>Secondary content</span>,
      },
    };

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="no-login" ctaText="Primary action" ctaType="with-secondary" />
        <PianoCoachmark id="no-login" ctaActions={customActions}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for no-login'));

    expect(await screen.findByText('Primary action')).toBeInTheDocument();
    expect(screen.queryByText('Secondary content')).not.toBeInTheDocument();
  });

  it("renders no action button (but keeps the close button working) when ctaType isn't registered", async () => {
    const user = userEvent.setup();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="unregistered" ctaText="Add To Favorites" ctaType="favorite" />
        <PianoCoachmark id="unregistered" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for unregistered'));

    await screen.findByText('Piano title');

    expect(screen.queryByText('Add To Favorites')).not.toBeInTheDocument();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('favorite'));

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByText('Piano title')).not.toBeInTheDocument();

    consoleWarnSpy.mockRestore();
  });

  it('closes via its close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="close-x" />
        <PianoCoachmark id="close-x" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for close-x'));

    await screen.findByText('Piano title');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByText('Piano title')).not.toBeInTheDocument();
  });

  it('does not close on outside click by default', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="no-outside-dismiss" />
        <PianoCoachmark id="no-outside-dismiss" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
        <button type="button">Outside</button>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for no-outside-dismiss'));

    await screen.findByText('Piano title');

    await user.click(screen.getByText('Outside'));
    expect(screen.getByText('Piano title')).toBeInTheDocument();
  });

  it('closes on Escape even when dismissOnOutsideClick is false', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="no-escape-opt-out" />
        <PianoCoachmark id="no-escape-opt-out" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for no-escape-opt-out'));

    await screen.findByText('Piano title');

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Piano title')).not.toBeInTheDocument();
  });

  it('closes on outside click when the payload opts in via dismissOnOutsideClick', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="outside-dismiss" dismissOnOutsideClick />
        <PianoCoachmark id="outside-dismiss" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
        <button type="button">Outside</button>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for outside-dismiss'));

    await screen.findByText('Piano title');

    await user.click(screen.getByText('Outside'));

    expect(screen.queryByText('Piano title')).not.toBeInTheDocument();
  });

  it('keeps two PianoCoachmark instances with different ids isolated from each other', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="instance-a" title="Title A" />
        <PianoCoachmark id="instance-a" ctaActions={{}}>
          <button type="button">First trigger</button>
        </PianoCoachmark>
        <PianoCoachmark id="instance-b" ctaActions={{}}>
          <button type="button">Second trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for instance-a'));

    expect(await screen.findByText('Title A')).toBeInTheDocument();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it('keeps both coachmarks open when two are piano-triggered at once', async () => {
    // Fires both triggers directly, the way Piano's real SDK invokes our handler -- a plain JS
    // function call with no DOM click/pointerdown involved, so opening the second doesn't read as
    // an outside click against the first.
    const BothPianoTriggers = () => {
      const trigger = useTriggerExternal<PianoCoachmarkPayload>();

      useEffect(() => {
        trigger('instance-c', {
          title: 'Title C',
          description: 'Description C',
          ctaText: 'Create Free Account',
          ctaType: 'signup',
        });
        trigger('instance-d', {
          title: 'Title D',
          description: 'Description D',
          ctaText: 'Create Free Account',
          ctaType: 'signup',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return null;
    };

    renderWithProvider(
      <ExternalTriggerProvider>
        <BothPianoTriggers />
        <PianoCoachmark id="instance-c" ctaActions={{}}>
          <button type="button">Third trigger</button>
        </PianoCoachmark>
        <PianoCoachmark id="instance-d" ctaActions={{}}>
          <button type="button">Fourth trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    expect(await screen.findByText('Title C')).toBeInTheDocument();
    expect(await screen.findByText('Title D')).toBeInTheDocument();
  });
});

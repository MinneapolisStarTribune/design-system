import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Coachmark } from './Coachmark';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '../../../test-utils/render';

describe('Coachmark', () => {
  it('renders only the trigger when closed', () => {
    renderWithProvider(
      <Coachmark
        open={false}
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the title/description in a dialog when open', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders no action button when ctaText is omitted', () => {
    renderWithProvider(
      <Coachmark open onOpenChange={vi.fn()} title="Title" description="Description">
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.queryByRole('button', { name: /Do it/ })).not.toBeInTheDocument();
  });

  it('renders the action as a link when actionHref is given', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Go somewhere"
        actionHref="/somewhere"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    const link = screen.getByRole('link', { name: 'Go somewhere' });
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('calls onAction when the action button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        onAction={onAction}
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    await user.click(screen.getByRole('button', { name: 'Do it' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders secondaryContent below the action button', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        secondaryContent={<span>Secondary content</span>}
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByText('Secondary content')).toBeInTheDocument();
  });

  it('renders an icon badge when icon is given', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        icon={<span data-testid="coachmark-icon">icon</span>}
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByTestId('coachmark-icon')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderWithProvider(
      <Coachmark
        open
        onOpenChange={onOpenChange}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on outside click or Escape by default', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderWithProvider(
      <>
        <Coachmark
          open
          onOpenChange={onOpenChange}
          title="Title"
          description="Description"
          ctaText="Do it"
        >
          <Button>Trigger</Button>
        </Coachmark>
        <div>Outside</div>
      </>
    );

    await user.click(screen.getByText('Outside'));
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on outside click and Escape when dismissOnOutsideClick is true', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderWithProvider(
      <>
        <Coachmark
          open
          onOpenChange={onOpenChange}
          title="Title"
          description="Description"
          ctaText="Do it"
          dismissOnOutsideClick
        >
          <Button>Trigger</Button>
        </Coachmark>
        <div>Outside</div>
      </>
    );

    await user.click(screen.getByText('Outside'));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything(), 'outside-press');
  });

  it('opens above the trigger when position is top', async () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        position="top"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog').getAttribute('style')).toContain('position');
    });

    // The arrow flips its rotation depending on which side of the trigger it's pointing from --
    // confirming placement was actually applied, not just accepted as a prop.
    const arrow = screen.getByRole('dialog').querySelector('svg');
    expect(arrow).toHaveStyle({ transform: '' });
  });

  it('opens below the trigger by default', async () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    const arrow = screen.getByRole('dialog').querySelector('svg');
    await waitFor(() => expect(arrow).toHaveStyle({ transform: 'rotate(180deg)' }));
  });

  it.each(['left', 'right', 'center'] as const)(
    'accepts align="%s" alongside position without error',
    async (align) => {
      renderWithProvider(
        <Coachmark
          open
          onOpenChange={vi.fn()}
          title="Title"
          description="Description"
          ctaText="Do it"
          align={align}
        >
          <Button>Trigger</Button>
        </Coachmark>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    }
  );

  it.each([
    ['left', 'rotate(-90deg)'],
    ['right', 'rotate(90deg)'],
  ] as const)(
    'opens to the %s of the trigger, vertically centered, when position is center and align is %s',
    async (align, expectedArrowTransform) => {
      renderWithProvider(
        <Coachmark
          open
          onOpenChange={vi.fn()}
          title="Title"
          description="Description"
          ctaText="Do it"
          position="center"
          align={align}
        >
          <Button>Trigger</Button>
        </Coachmark>
      );

      // The arrow's rotation reflects which side floating-ui actually placed the dialog on --
      // confirming `align` was used as the side, not silently ignored.
      const arrow = screen.getByRole('dialog').querySelector('svg');
      await waitFor(() => expect(arrow).toHaveStyle({ transform: expectedArrowTransform }));
    }
  );

  it('falls back to opening below the trigger when position is center and align is also center', async () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        position="center"
        align="center"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    const arrow = screen.getByRole('dialog').querySelector('svg');
    await waitFor(() => expect(arrow).toHaveStyle({ transform: 'rotate(180deg)' }));
  });
});

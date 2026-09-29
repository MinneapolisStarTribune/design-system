import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Coachmark } from './Coachmark';
import { COACHMARK_POSITIONS } from '../Coachmark.types';
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

  it('gives the dialog an accessible name/description from title/description', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Never miss a story"
        description="Create a free account to save articles for later."
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    const dialog = screen.getByRole('dialog', { name: 'Never miss a story' });
    expect(dialog).toHaveAccessibleDescription('Create a free account to save articles for later.');
  });

  it('moves focus into the dialog when it opens, and returns it to the trigger on close', async () => {
    const user = userEvent.setup();

    const ControlledCoachmark = () => {
      const [open, setOpen] = useState(true);
      return (
        <Coachmark
          open={open}
          onOpenChange={setOpen}
          title="Title"
          description="Description"
          ctaText="Do it"
        >
          <Button>Trigger</Button>
        </Coachmark>
      );
    };

    renderWithProvider(<ControlledCoachmark />);

    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());

    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus());
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

  it('defaults to centered alignment when alignment is omitted, regardless of icon', () => {
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

    expect(screen.getByRole('dialog').querySelector('[class*="bodyCentered"]')).toBeInTheDocument();
  });

  it('left-aligns the title/description when alignment="left" is given', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        alignment="left"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(
      screen.getByRole('dialog').querySelector('[class*="bodyCentered"]')
    ).not.toBeInTheDocument();
  });

  it('centers when alignment="center" is given explicitly, same as an icon-bearing coachmark', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        alignment="center"
        icon={<span data-testid="coachmark-icon">icon</span>}
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByRole('dialog').querySelector('[class*="bodyCentered"]')).toBeInTheDocument();
  });

  it('renders no badge when badgeText is omitted', () => {
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

    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('renders a badge with the given text when badgeText is present', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        badgeText="New"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByText('New')).toBeInTheDocument();
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

  it('does not close on outside click by default', async () => {
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
  });

  it('closes on Escape even when dismissOnOutsideClick is false', async () => {
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

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything(), 'escape-key');
  });

  it('closes when the trigger itself is clicked, even when dismissOnOutsideClick is false', async () => {
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

    await user.click(screen.getByRole('button', { name: 'Trigger' }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything(), 'reference-press');
  });

  it("still calls the trigger's own onClick when it closes the coachmark", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onTriggerClick = vi.fn();

    renderWithProvider(
      <Coachmark
        open
        onOpenChange={onOpenChange}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button onClick={onTriggerClick}>Trigger</Button>
      </Coachmark>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));

    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything(), 'reference-press');
  });

  it('closes on outside click when dismissOnOutsideClick is true', async () => {
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

  it('opens above the trigger when position is top-center', async () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        position="top-center"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    // The arrow flips its rotation depending on which side of the trigger it's pointing from --
    // confirming placement was actually applied, not just accepted as a prop.
    const arrow = screen.getByRole('dialog').querySelector('svg');
    await waitFor(() => expect(arrow).toHaveStyle({ transform: '' }));
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

  it.each(COACHMARK_POSITIONS)('accepts position="%s" without error', async (position) => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        position={position}
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it.each([
    ['center-left', 'rotate(-90deg)'],
    ['center-right', 'rotate(90deg)'],
  ] as const)(
    'opens beside the trigger, vertically centered, when position is %s',
    async (position, expectedArrowTransform) => {
      renderWithProvider(
        <Coachmark
          open
          onOpenChange={vi.fn()}
          title="Title"
          description="Description"
          ctaText="Do it"
          position={position}
        >
          <Button>Trigger</Button>
        </Coachmark>
      );

      // The arrow's rotation reflects which side floating-ui actually placed the dialog on --
      // confirming the side was actually applied, not silently ignored.
      const arrow = screen.getByRole('dialog').querySelector('svg');
      await waitFor(() => expect(arrow).toHaveStyle({ transform: expectedArrowTransform }));
    }
  );
});

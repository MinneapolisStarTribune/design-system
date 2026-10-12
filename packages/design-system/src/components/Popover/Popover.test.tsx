import { screen, waitFor, within } from '@testing-library/react';
import { type ComponentProps, createRef, type ReactNode } from 'react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import * as Popover from './Popover';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

type PopoverRootProps = Omit<ComponentProps<typeof Popover.Root>, 'children' | 'trigger'> & {
  trigger?: ReactNode;
};

const renderPopover = (
  children: ReactNode,
  { trigger = <Button>Open</Button>, ...props }: PopoverRootProps = {}
) =>
  renderWithProvider(
    <Popover.Root trigger={trigger} {...props}>
      {children}
    </Popover.Root>
  );

const openPopover = (user: UserEvent) => user.click(screen.getByRole('button', { name: 'Open' }));

describe('Popover', () => {
  it('renders into portalRoot when set', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderPopover(<Popover.Body>Popover Content</Popover.Body>, {
      portalRoot: container,
      className: 'custom-popover',
      dataTestId: 'custom-popover',
      style: { zIndex: 5 },
    });

    await openPopover(user);

    const dialog = await screen.findByRole('dialog');
    expect(container.contains(dialog)).toBe(true);
    expect(dialog).toHaveClass('custom-popover');
    expect(dialog).toHaveAttribute('data-testid', 'custom-popover');
    expect(dialog).toHaveStyle({ zIndex: 5 });
    container.remove();
  });

  it('renders the trigger without a wrapper element', () => {
    renderWithProvider(
      <p data-testid="paragraph">
        Text{' '}
        <Popover.Root trigger={<Button>Open</Button>}>
          <Popover.Body>Popover Content</Popover.Body>
        </Popover.Root>{' '}
        more text
      </p>
    );

    expect(screen.getByRole('button', { name: 'Open' }).parentElement).toBe(
      screen.getByTestId('paragraph')
    );
  });

  it('portals to document.body, without an inherited portal root', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Popover Content</Popover.Body>);

    await openPopover(user);

    const portal = (await screen.findByText('Popover Content')).closest(
      '[data-floating-ui-portal]'
    );
    expect(portal?.parentElement).toBe(document.body);
  });

  it('names the dialog by its heading', async () => {
    const user = userEvent.setup();

    renderPopover(
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </>
    );

    await openPopover(user);

    expect(await screen.findByRole('dialog', { name: 'Title' })).toBeInTheDocument();
  });

  it('uses aria-label when there is no heading', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Content</Popover.Body>, { 'aria-label': 'Options' });

    await openPopover(user);

    const dialog = await screen.findByRole('dialog', { name: 'Options' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('uses the heading instead of aria-label when both are provided', async () => {
    const user = userEvent.setup();

    renderPopover(
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </>,
      { 'aria-label': 'Options' }
    );

    await openPopover(user);

    const dialog = await screen.findByRole('dialog', { name: 'Title' });
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  it('points the trigger aria-controls to the dialog', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Popover Content</Popover.Body>, { 'aria-label': 'Options' });

    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog');
    expect(dialog.id).not.toBe('');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
  });

  it('preserves the trigger ref', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();

    renderPopover(<Popover.Body>Popover Content</Popover.Body>, {
      trigger: <Button ref={triggerRef}>Open</Button>,
      'aria-label': 'Options',
    });

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'Open' }));
  });

  it('passes classes and test ids to the content parts', async () => {
    const user = userEvent.setup();

    renderPopover(
      <>
        <Popover.Heading className="custom-heading" dataTestId="heading">
          Title
        </Popover.Heading>
        <Popover.Description className="custom-description" dataTestId="description">
          Description
        </Popover.Description>
        <Popover.Divider className="custom-divider" dataTestId="divider" />
        <Popover.Body className="custom-body" dataTestId="body">
          Body
        </Popover.Body>
      </>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByTestId('heading')).toHaveTextContent('Title');
    expect(screen.getByTestId('heading-close-button')).toHaveAccessibleName('Close popover');
    expect(screen.getByTestId('description')).toHaveTextContent('Description');
    expect(screen.getByRole('separator')).toBe(screen.getByTestId('divider'));
    expect(screen.getByTestId('body')).toHaveTextContent('Body');
    expect(screen.getByTestId('heading')).toHaveClass('custom-heading');
    expect(screen.getByTestId('description')).toHaveClass('custom-description');
    expect(screen.getByTestId('divider')).toHaveClass('custom-divider');
    expect(screen.getByTestId('body')).toHaveClass('custom-body');
  });

  it('uses the id prop for the dialog and aria-controls', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Popover Content</Popover.Body>, {
      'aria-label': 'Options',
      id: 'custom-popover',
    });

    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);

    expect(await screen.findByRole('dialog')).toHaveAttribute('id', 'custom-popover');
    expect(trigger).toHaveAttribute('aria-controls', 'custom-popover');
  });

  const keyboardTriggers: [string, ReactNode][] = [
    ['text', 'Open'],
    [
      'div role="button"',
      <div key="div-trigger" role="button" tabIndex={0}>
        Open
      </div>,
    ],
    ['native button', <Button key="native-button">Open</Button>],
  ];

  describe.each(keyboardTriggers)('with a %s trigger', (_, trigger) => {
    it.each([
      ['Enter', '{Enter}'],
      ['Space', ' '],
    ])('toggles once per %s press', async (_, key) => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      renderPopover(<Popover.Body>Popover Content</Popover.Body>, {
        trigger,
        'aria-label': 'Options',
        onOpenChange,
      });

      const triggerElement = screen.getByRole('button', { name: 'Open' });
      triggerElement.focus();
      await user.keyboard(key);
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(onOpenChange).toHaveBeenCalledTimes(1);

      triggerElement.focus();
      await user.keyboard(key);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    });
  });

  it('does not override the trigger display', () => {
    renderPopover(<Popover.Body>Popover Content</Popover.Body>, {
      trigger: <Button style={{ cursor: 'help' }}>Open</Button>,
    });

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger.style.display).toBe('');
    expect(trigger.style.cursor).toBe('help');
  });

  it('close button closes the popover', async () => {
    const user = userEvent.setup();

    renderPopover(
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </>
    );

    await user.click(screen.getByText('Open'));
    await screen.findByText('Content');

    await user.click(screen.getByLabelText('Close popover'));

    await waitFor(() => {
      expect(screen.queryByText('Content')).toBeNull();
    });
  });

  it('does not open when isDisabled is true', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Content</Popover.Body>, { isDisabled: true });

    await openPopover(user);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it.each<[string, ReactNode]>([
    ['element', <Button key="open">Open</Button>],
    ['text', 'Open'],
  ])('does not open a disabled %s trigger with Enter or Space', async (_, trigger) => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderPopover(<Popover.Body>Content</Popover.Body>, {
      trigger,
      isDisabled: true,
      onOpenChange,
    });

    const triggerElement = screen.getByRole('button', { name: 'Open' });
    expect(triggerElement).toHaveAttribute('aria-disabled', 'true');
    triggerElement.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('takes a disabled text trigger out of the tab order', () => {
    renderPopover(<Popover.Body>Content</Popover.Body>, { trigger: 'Open', isDisabled: true });

    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('tabIndex', '-1');
  });

  it('runs the trigger element handlers along with its own', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onKeyDown = vi.fn();

    renderPopover(<Popover.Body>Content</Popover.Body>, {
      trigger: (
        <div role="button" tabIndex={0} onClick={onClick} onKeyDown={onKeyDown}>
          Open
        </div>
      ),
      'aria-label': 'Options',
    });

    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    trigger.focus();
    await user.keyboard('{Enter}');
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('does not toggle when the trigger element prevents the key event', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Content</Popover.Body>, {
      trigger: (
        <div role="button" tabIndex={0} onKeyDown={(event) => event.preventDefault()}>
          Open
        </div>
      ),
      'aria-label': 'Options',
    });

    screen.getByRole('button', { name: 'Open' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not open on Down Arrow, which only menu triggers handle', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Content</Popover.Body>);
    screen.getByRole('button', { name: 'Open' }).focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Popover placement', () => {
  it.each([
    ['left', 'rotate(-90deg)'],
    ['right-start', 'rotate(90deg)'],
  ] as const)('opens at placement="%s"', async (placement, arrowTransform) => {
    const user = userEvent.setup();
    renderPopover(<Popover.Body>Content</Popover.Body>, { placement, 'aria-label': 'Info' });

    await openPopover(user);

    // The arrow's rotation shows which side Floating UI placed the popover on.
    const arrow = (await screen.findByRole('dialog')).querySelector('svg');
    await waitFor(() => expect(arrow).toHaveStyle({ transform: arrowTransform }));
  });

  it('resolves a per-breakpoint placement', async () => {
    const user = userEvent.setup();
    renderPopover(<Popover.Body>Content</Popover.Body>, {
      placement: { small: 'left' },
      'aria-label': 'Info',
    });

    await openPopover(user);

    const arrow = (await screen.findByRole('dialog')).querySelector('svg');
    await waitFor(() => expect(arrow).toHaveStyle({ transform: 'rotate(-90deg)' }));
  });
});

describe('Popover.Heading', () => {
  it('hides the close button when showCloseButton is false', async () => {
    const user = userEvent.setup();

    renderPopover(
      <>
        <Popover.Heading showCloseButton={false}>Title</Popover.Heading>
        <Popover.Body>Body</Popover.Body>
      </>
    );

    await user.click(screen.getByText('Open'));

    await screen.findByRole('dialog');
    expect(screen.queryByLabelText('Close popover')).toBeNull();
  });

  it('renders eyebrow and value outside the accessible name', async () => {
    const user = userEvent.setup();

    renderPopover(
      <Popover.Heading eyebrow="Saturday, April 4" value="308">
        Boys Volleyball
      </Popover.Heading>
    );

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Boys Volleyball' });
    expect(dialog).toHaveTextContent('Saturday, April 4');
    expect(dialog).toHaveTextContent('308');
  });

  it('renders a numeric zero eyebrow', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Heading eyebrow={0}>Boys Volleyball</Popover.Heading>);

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Boys Volleyball' });
    expect(within(dialog).getByText('0').className).toMatch(/eyebrow/);
  });
});

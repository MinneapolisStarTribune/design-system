import { screen, waitFor, within } from '@testing-library/react';
import { type ComponentProps, createRef, type ReactNode } from 'react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import * as Popover from './Popover';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

type PopoverRootProps = Omit<ComponentProps<typeof Popover.Root>, 'children' | 'trigger'>;

const renderPopover = (children: ReactNode, props: PopoverRootProps = {}) =>
  renderWithProvider(
    <Popover.Root trigger={<Button>Open</Button>} {...props}>
      {children}
    </Popover.Root>
  );

const openPopover = (user: UserEvent) => user.click(screen.getByRole('button', { name: 'Open' }));

describe('Popover', () => {
  it('renders with trigger element', () => {
    renderPopover(<Popover.Body>Content</Popover.Body>);

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Popover Content</Popover.Body>);

    await openPopover(user);

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('renders into portalRoot when set', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderPopover(<Popover.Body>Popover Content</Popover.Body>, { portalRoot: container });

    await openPopover(user);

    expect(container.contains(await screen.findByText('Popover Content'))).toBe(true);
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

  it('applies dataTestId to the dialog', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Content</Popover.Body>, {
      'aria-label': 'Options',
      dataTestId: 'options-popover',
    });

    await openPopover(user);

    expect(await screen.findByTestId('options-popover')).toHaveAttribute('role', 'dialog');
  });

  it('merges the style prop with the positioning styles', async () => {
    const user = userEvent.setup();

    renderPopover(<Popover.Body>Popover Content</Popover.Body>, { style: { zIndex: 5 } });

    await openPopover(user);

    const surface = await screen.findByRole('dialog');
    expect(surface).toHaveStyle({ zIndex: 5, position: 'absolute', left: 0, top: 0 });
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

  it('keeps the trigger ref without a React 19 element.ref warning', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const triggerRef = createRef<HTMLButtonElement>();

    renderWithProvider(
      <Popover.Root trigger={<Button ref={triggerRef}>Open</Button>} aria-label="Options">
        <Popover.Body>Popover Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'Open' }));
    expect(consoleError).not.toHaveBeenCalledWith(expect.stringContaining('element.ref'));
    consoleError.mockRestore();
  });

  it('sets test ids on the sections and the close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading dataTestId="heading">Title</Popover.Heading>
        <Popover.Description dataTestId="description">Description</Popover.Description>
        <Popover.Divider dataTestId="divider" />
        <Popover.Body dataTestId="body">Body</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByTestId('heading')).toHaveTextContent('Title');
    expect(screen.getByTestId('heading-close-button')).toHaveAccessibleName('Close popover');
    expect(screen.getByTestId('description')).toHaveTextContent('Description');
    expect(screen.getByTestId('divider')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toHaveTextContent('Body');
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

  it.each([
    ['element', <Button key="element">Open</Button>],
    ['text', 'Open'],
  ])('never points a %s trigger aria-controls to the generated id', async (_, trigger) => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={trigger} aria-label="Options" id="custom-popover">
        <Popover.Body>Popover Content</Popover.Body>
      </Popover.Root>
    );

    const triggerElement = screen.getByRole('button', { name: 'Open' });
    // Each record keeps the value before its change, so intermediate values are not lost.
    const previousValues: (string | null)[] = [];
    const observer = new MutationObserver((records) =>
      records.forEach((record) => previousValues.push(record.oldValue))
    );
    observer.observe(triggerElement, {
      attributeFilter: ['aria-controls'],
      attributeOldValue: true,
    });

    await user.click(triggerElement);
    await screen.findByRole('dialog');
    observer.disconnect();

    expect([...previousValues, triggerElement.getAttribute('aria-controls')]).toEqual([
      null,
      'custom-popover',
    ]);
  });

  it('does not override the trigger display', () => {
    renderWithProvider(
      <Popover.Root trigger={<Button style={{ cursor: 'help' }}>Open</Button>}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger.style.display).toBe('');
    expect(trigger.style.cursor).toBe('help');
  });

  it('renders close button when heading is present', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByLabelText('Close popover')).toBeInTheDocument();
    });
  });

  it('close button closes the popover', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));
    await waitFor(() => screen.getByText('Content'));

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

  it('renders with heading and body', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Heading</Popover.Heading>
        <Popover.Body>Body</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
    });
  });

  it('renders divider', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const divider = document.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
    });
  });

  it('renders divider with fullBleed enabled', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Divider fullBleed />
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const divider = document.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
    });
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)(
    'renders with placement %s',
    async (placement) => {
      const user = userEvent.setup();

      renderWithProvider(
        <Popover.Root trigger={<Button>Open</Button>} placement={placement}>
          <Popover.Body>{placement} content</Popover.Body>
        </Popover.Root>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByText(`${placement} content`)).toBeInTheDocument();
      });
    }
  );

  it('handles complex trigger elements', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root
        trigger={
          <button>
            <span>Complex</span>
            <span>Trigger</span>
          </button>
        }
      >
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('applies className to the popover surface', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>} className="custom-popover">
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    const surface = (await screen.findByText('Content')).closest('[role="dialog"]');
    expect(surface).toHaveClass('custom-popover');
  });
});

describe('Popover.Body', () => {
  it('renders children', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Body>
          <div data-testid="body">Body</div>
        </Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByTestId('body')).toBeInTheDocument();
    });
  });

  it('applies className to the body', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Body className="custom-body">Body</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-body')).toBeInTheDocument();
    });
  });
});

describe('Popover.Heading', () => {
  it('hides the close button when showCloseButton is false', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading showCloseButton={false}>Title</Popover.Heading>
        <Popover.Body>Body</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await screen.findByRole('dialog');
    expect(screen.queryByLabelText('Close popover')).toBeNull();
  });

  it('renders eyebrow and value outside the accessible name', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading eyebrow="Saturday, April 4" value="308">
          Boys Volleyball
        </Popover.Heading>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Boys Volleyball' });
    expect(dialog).toHaveTextContent('Saturday, April 4');
    expect(dialog).toHaveTextContent('308');
  });

  it('renders a numeric zero eyebrow', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading eyebrow={0}>Boys Volleyball</Popover.Heading>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Boys Volleyball' });
    expect(within(dialog).getByText('0').className).toMatch(/eyebrow/);
  });

  it('renders children and close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>
          <span data-testid="heading">Heading</span>
        </Popover.Heading>

        <Popover.Body>Body</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByTestId('heading')).toBeInTheDocument();
      expect(screen.getByLabelText('Close popover')).toBeInTheDocument();
    });
  });

  it('applies className to the heading', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading className="custom-header">Heading</Popover.Heading>

        <Popover.Body>Body</Popover.Body>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-header')).toBeInTheDocument();
    });
  });
});

describe('Popover.Description', () => {
  it('applies className to the description', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Description className="custom-description">Description</Popover.Description>
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-description')).toBeInTheDocument();
    });
  });
});

describe('Popover.Divider', () => {
  it('applies className to the divider', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Divider className="custom-divider" />
      </Popover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-divider')).toBeInTheDocument();
    });
  });
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import { PopoverPortalRootProvider } from './PopoverContext';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

describe('Popover', () => {
  it('renders with trigger element', () => {
    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('uses a portal root from an ancestor PopoverPortalRootProvider', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <PopoverPortalRootProvider>
        <div data-testid="outer-popover-root">
          <Popover trigger={<Button>Open</Button>}>
            <Popover.Body>Popover Content</Popover.Body>
          </Popover>
        </div>
      </PopoverPortalRootProvider>
    );

    await user.click(screen.getByText('Open'));

    const portal = (await screen.findByText('Popover Content')).closest(
      '[data-floating-ui-portal]'
    );
    expect(portal?.parentElement).toBe(screen.getByTestId('outer-popover-root').parentElement);
  });

  it('renders the trigger without a wrapper element', () => {
    renderWithProvider(
      <p data-testid="paragraph">
        Text{' '}
        <Popover trigger={<Button>Open</Button>}>
          <Popover.Body>Popover Content</Popover.Body>
        </Popover>{' '}
        more text
      </p>
    );

    expect(screen.getByRole('button', { name: 'Open' }).parentElement).toBe(
      screen.getByTestId('paragraph')
    );
  });

  it('portals to document.body, without an inherited portal root', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    const portal = (await screen.findByText('Popover Content')).closest(
      '[data-floating-ui-portal]'
    );
    expect(portal?.parentElement).toBe(document.body);
  });

  it('names the dialog by its heading', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    expect(await screen.findByRole('dialog', { name: 'Title' })).toBeInTheDocument();
  });

  it('uses aria-label when there is no heading', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} aria-label="Options">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Options' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('uses the heading instead of aria-label when both are provided', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} aria-label="Options">
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Title' });
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  it('merges the style prop with the positioning styles', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} style={{ zIndex: 5 }}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    const surface = await screen.findByRole('dialog');
    expect(surface).toHaveStyle({ zIndex: 5, position: 'absolute', left: 0, top: 0 });
  });

  it('renders close button when heading is present', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByLabelText('Close popover')).toBeInTheDocument();
    });
  });

  it('close button closes the popover', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));
    await waitFor(() => screen.getByText('Content'));

    await user.click(screen.getByLabelText('Close popover'));

    await waitFor(() => {
      expect(screen.queryByText('Content')).toBeNull();
    });
  });

  it('uses dark theme colors when the document is in dark mode', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'dark');

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));
    await waitFor(() => screen.getByText('Content'));

    const arrow = document.querySelector('svg');
    const arrowPath = document.querySelector('svg path');

    expect(arrow).toHaveAttribute('fill', 'var(--color-background-dark-gray-01)');
    expect(arrowPath).toHaveAttribute('stroke', 'var(--color-border-on-dark-subtle-01)');

    document.documentElement.removeAttribute('data-theme');
  });

  it('does not open when isDisabled is true', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} isDisabled>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await new Promise((r) => setTimeout(r, 100));

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders with heading and body', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Heading</Popover.Heading>
        <Popover.Body>Body</Popover.Body>
      </Popover>
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
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Content</Popover.Body>
      </Popover>
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
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Divider fullBleed />
        <Popover.Body>Content</Popover.Body>
      </Popover>
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
        <Popover trigger={<Button>Open</Button>} placement={placement}>
          <Popover.Body>{placement} content</Popover.Body>
        </Popover>
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
      <Popover
        trigger={
          <button>
            <span>Complex</span>
            <span>Trigger</span>
          </button>
        }
      >
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('applies className to the popover surface', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} className="custom-popover">
        <Popover.Body>Content</Popover.Body>
      </Popover>
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
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Body>
          <div data-testid="body">Body</div>
        </Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByTestId('body')).toBeInTheDocument();
    });
  });

  it('applies bodyClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Body bodyClassName="custom-body">Body</Popover.Body>
      </Popover>
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
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading showCloseButton={false}>Title</Popover.Heading>
        <Popover.Body>Body</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await screen.findByRole('dialog');
    expect(screen.queryByLabelText('Close popover')).toBeNull();
  });

  it('renders eyebrow and value outside the accessible name', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading eyebrow="Saturday, April 4" value="308">
          Boys Volleyball
        </Popover.Heading>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    const dialog = await screen.findByRole('dialog', { name: 'Boys Volleyball' });
    expect(dialog).toHaveTextContent('Saturday, April 4');
    expect(dialog).toHaveTextContent('308');
  });

  it('renders children and close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>
          <span data-testid="heading">Heading</span>
        </Popover.Heading>

        <Popover.Body>Body</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByTestId('heading')).toBeInTheDocument();
      expect(screen.getByLabelText('Close popover')).toBeInTheDocument();
    });
  });

  it('applies heading classNames', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading
          headerClassName="custom-header"
          titleClassName="custom-title"
          closeButtonClassName="custom-close-button"
        >
          Heading
        </Popover.Heading>

        <Popover.Body>Body</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-header')).toBeInTheDocument();
      expect(document.querySelector('.custom-title')).toBeInTheDocument();
      expect(document.querySelector('.custom-close-button')).toBeInTheDocument();
    });
  });
});

describe('Popover.Description', () => {
  it('applies descriptionClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Description descriptionClassName="custom-description">
          Description
        </Popover.Description>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-description')).toBeInTheDocument();
    });
  });
});

describe('Popover.Divider', () => {
  it('applies dividerClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Divider dividerClassName="custom-divider" />
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(document.querySelector('.custom-divider')).toBeInTheDocument();
    });
  });
});

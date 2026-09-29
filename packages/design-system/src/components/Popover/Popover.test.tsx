import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '../../test-utils/render';

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

  it('applies wrapperClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} wrapperClassName="custom-wrapper">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const content = screen.getByText('Content');

      const wrapper = content.closest('.custom-wrapper');

      expect(wrapper).toHaveClass('custom-wrapper');
    });
  });

  it('applies containerClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} containerClassName="custom-container">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const content = screen.getByText('Content');

      const container = content.closest('.custom-container');

      expect(container).toHaveClass('custom-container');
    });
  });

  it('applies contentClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} contentClassName="custom-content">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const content = screen.getByText('Content');

      const contentEl = content.closest('.custom-content');

      expect(contentEl).toHaveClass('custom-content');
    });
  });

  it('applies arrowClassName', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button>Open</Button>} arrowClassName="custom-arrow">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const arrow = document.querySelector('svg.custom-arrow');

      expect(arrow).toHaveClass('custom-arrow');
    });
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

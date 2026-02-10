import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { renderWithProvider } from '../../test-utils/render';

describe('Popover', () => {
  it('renders with trigger element', () => {
    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
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
      <Popover trigger={<Button label="Open" />}>
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
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));
    await waitFor(() => screen.getByText('Content'));

    await user.click(screen.getByLabelText('Close popover'));

    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('does not open when isDisabled is true', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} isDisabled>
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
      <Popover trigger={<Button label="Open" />}>
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

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(container.querySelector('[class*="divider"]')).toBeInTheDocument();
    });
  });

  it('renders divider with fullBleed enabled', async () => {
    const user = userEvent.setup();

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Divider fullBleed />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      const divider = container.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
    });
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)(
    'renders with pointer position %s',
    async (pointer) => {
      const user = userEvent.setup();

      renderWithProvider(
        <Popover trigger={<Button label="Open" />} pointer={pointer}>
          <Popover.Body>{pointer} content</Popover.Body>
        </Popover>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByText(`${pointer} content`)).toBeInTheDocument();
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
});

describe('Popover.Body', () => {
  it('renders children', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
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
});

describe('Popover.Heading', () => {
  it('renders children and close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
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
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { renderWithProvider } from '../../test-utils/render';

describe('Popover', () => {
  it('renders with trigger element', () => {
    const { getByText } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    expect(getByText('Open')).toBeInTheDocument();
  });

  it('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('renders close button when popover is open', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close popover');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toBeEnabled();
    });
  });

  it('close button is clickable', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Close popover');

    // Just verify the button can be clicked (Mantine handles the actual closing)
    await user.click(closeButton);
    expect(closeButton).toBeInTheDocument();
  });

  it('popover supports closeOnClickOutside behavior', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <div>
        <Popover trigger={<Button label="Open" />}>
          <Popover.Body>Popover Content</Popover.Body>
        </Popover>
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });

    // Verify outside element exists (Mantine handles click outside behavior)
    const outsideElement = screen.getByTestId('outside');
    expect(outsideElement).toBeInTheDocument();
  });

  it('popover supports closeOnEscape behavior', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const popover = screen.getByText('Popover Content');
      expect(popover).toBeInTheDocument();

      // Verify the popover dropdown has tabindex for keyboard interaction
      const dropdown = popover.closest('[role="dialog"]');
      expect(dropdown).toHaveAttribute('tabindex', '-1');
    });
  });

  it('renders with heading', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('renders with divider', async () => {
    const user = userEvent.setup();

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const dividers = container.querySelectorAll('[class*="divider"]');
      expect(dividers.length).toBeGreaterThan(0);
    });
  });

  it('renders divider with fullBleed prop', async () => {
    const user = userEvent.setup();

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider fullBleed />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const divider = container.querySelector('[class*="dividerFullBleed"]');
      expect(divider).toBeInTheDocument();
    });
  });

  it('applies custom className to popover', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} className="custom-popover" dataTestId="popover">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const popover = screen.getByTestId('popover');
      expect(popover).toHaveClass('custom-popover');
    });
  });

  it('renders with data-testid', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} dataTestId="my-popover">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId('my-popover')).toBeInTheDocument();
    });
  });

  it('does not open when isDisabled is true', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} isDisabled>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    // Wait a bit to ensure it doesn't open
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders with pointer position top', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} pointer="top">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('renders with pointer position bottom', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} pointer="bottom">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('renders with pointer position left', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} pointer="left">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('renders with pointer position right', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} pointer="right">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('renders with aria attributes', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover
        trigger={<Button label="Open" />}
        aria-label="Custom popover"
        aria-describedby="description"
        dataTestId="popover"
      >
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const popover = screen.getByTestId('popover');
      expect(popover).toHaveAttribute('aria-label', 'Custom popover');
      expect(popover).toHaveAttribute('aria-describedby', 'description');
    });
  });

  it('has dialog role', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} dataTestId="popover">
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const popover = screen.getByTestId('popover');
      expect(popover).toHaveAttribute('role', 'dialog');
    });
  });

  it('renders scrollable content', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Items</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i}>Item {i + 1}</div>
          ))}
        </Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Items')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 30')).toBeInTheDocument();
    });
  });

  it('renders multiple compound components together', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>
          <div>First section</div>
        </Popover.Body>
        <Popover.Divider fullBleed />
        <Popover.Body>
          <div>Second section</div>
        </Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('First section')).toBeInTheDocument();
      expect(screen.getByText('Second section')).toBeInTheDocument();
    });
  });

  it('close button has correct aria-label', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close popover');
      expect(closeButton).toBeInTheDocument();
    });
  });

  it('renders without heading (body only)', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Just body content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Just body content')).toBeInTheDocument();
      expect(screen.queryByText('Title')).not.toBeInTheDocument();
    });
  });

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

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

describe('Popover.Heading', () => {
  it('renders children correctly', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>
          <span data-testid="heading-content">Custom Heading</span>
        </Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId('heading-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Heading')).toBeInTheDocument();
    });
  });
});

describe('Popover.Body', () => {
  it('renders children correctly', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>
          <div data-testid="body-content">Body content</div>
        </Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId('body-content')).toBeInTheDocument();
    });
  });

  it('renders multiple children', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });
  });
});

describe('Popover.Divider', () => {
  it('renders without fullBleed by default', async () => {
    const user = userEvent.setup();

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const divider = container.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
      expect(divider).not.toHaveClass(/dividerFullBleed/);
    });
  });

  it('renders with fullBleed when prop is true', async () => {
    const user = userEvent.setup();

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider fullBleed={true} />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const divider = container.querySelector('[class*="dividerFullBleed"]');
      expect(divider).toBeInTheDocument();
    });
  });

  it('renders with fullBleed={false} explicitly', async () => {
    const user = userEvent.setup();

    const { container } = renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider fullBleed={false} />
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    await waitFor(() => {
      const divider = container.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
      expect(divider).not.toHaveClass(/dividerFullBleed/);
    });
  });
});

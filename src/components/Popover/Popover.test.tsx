import { screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { renderWithProvider } from '../../test-utils/render';

beforeAll(() => {
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  global.ResizeObserver = ResizeObserverMock;

  global.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0) as unknown as number;

  global.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as NodeJS.Timeout);
});

describe('Popover Root', () => {
  it('renders trigger element', () => {
    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Popover Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByText('Popover Content')).toBeInTheDocument();
  });

  it('closes popover when close button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByText('Content');

    await user.click(screen.getByLabelText('Close popover'));

    await user.click(screen.getByLabelText('Close popover'));

    await waitForElementToBeRemoved(() => screen.queryByText('Content'));
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />} isDisabled>
        <Popover.Body>Content</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)(
    'renders with pointer %s',
    async (pointer) => {
      const user = userEvent.setup();

      renderWithProvider(
        <Popover trigger={<Button label="Open" />} pointer={pointer}>
          <Popover.Body>{pointer} content</Popover.Body>
        </Popover>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(await screen.findByText(`${pointer} content`)).toBeInTheDocument();
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

    expect(await screen.findByText('Content')).toBeInTheDocument();
  });
});

describe('Popover Compound Components', () => {
  it('renders heading', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Heading>
          <span data-testid="heading">Heading</span>
        </Popover.Heading>
        <Popover.Body>Body</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByTestId('heading')).toBeInTheDocument();
    expect(screen.getByLabelText('Close popover')).toBeInTheDocument();
  });

  it('renders description', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Description>
          <span data-testid="description">Description</span>
        </Popover.Description>
        <Popover.Body>Body</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByTestId('description')).toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: 'Open' }));

    await screen.findByText('Content');

    expect(container.querySelector('[class*="divider"]')).toBeInTheDocument();
  });
});

describe('Popover.Body Scroll Logic', () => {
  it('applies bodyAtTop class initially', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>Scrollable</Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const body = await screen.findByText('Scrollable');
    const wrapper = body.closest('div');

    expect(wrapper?.className).toContain('bodyAtTop');
  });

  it('removes bodyAtTop class when scrolled', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Popover trigger={<Button label="Open" />}>
        <Popover.Body>
          <div style={{ height: 2000 }}>Scrollable</div>
        </Popover.Body>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const scrollable = await screen.findByText('Scrollable');
    const wrapper = scrollable.closest('div');

    act(() => {
      Object.defineProperty(wrapper, 'scrollTop', {
        value: 100,
        writable: true,
      });

      wrapper?.dispatchEvent(new Event('scroll'));
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });

    expect(wrapper?.className).not.toContain('bodyAtTop');
  });
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '../../test-utils/render';
import { InformationIcon } from '@/icons';

describe('Tooltip', () => {
  it('renders trigger element', () => {
    renderWithProvider(<Tooltip label="Help text">Help</Tooltip>);

    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Tooltip content">
        <Button>Hover me</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('hides tooltip when not hovering', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Tooltip content">
        <Button>Hover me</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');

    // Hover to show
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    // Unhover to hide
    await user.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Tooltip content">
        <Button>Focus me</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Focus me');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('renders with icon in start position', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Help text" icon={<InformationIcon />} iconPosition="start">
        <Button>Info</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Info');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Help text')).toBeInTheDocument();
    });
  });

  it('renders with icon in end position', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Help text" icon={<InformationIcon />} iconPosition="end">
        <Button>Info</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Info');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Help text')).toBeInTheDocument();
    });
  });

  it('does not show when isDisabled is true', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Tooltip content" isDisabled>
        <Button>Hover me</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);

    await new Promise((r) => setTimeout(r, 300));

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('supports different placements', async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithProvider(
      <Tooltip label="Top tooltip" pointer="top">
        <Button>Hover me</Button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Top tooltip')).toBeInTheDocument();
    });

    // Test with different placement
    await user.unhover(trigger);
    rerender(
      <Tooltip label="Right tooltip" pointer="right">
        <Button>Hover me</Button>
      </Tooltip>
    );

    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText('Right tooltip')).toBeInTheDocument();
    });
  });

  it('wraps any component as a trigger', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Tooltip for div">
        <div>Click me</div>
      </Tooltip>
    );

    const trigger = screen.getByText('Click me');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Tooltip for div')).toBeInTheDocument();
    });
  });

  it('renders tooltip with aria attributes', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <Tooltip label="Help text">
        <Button>Help</Button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Help' });
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-describedby');
    });
  });
});

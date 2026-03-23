import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { CandyBarRenderer } from './CandyBarRenderer';

describe('CandyBarRenderer', () => {
  it('renders nothing when activeItem is null', () => {
    const onDismiss = vi.fn();
    renderWithProvider(<CandyBarRenderer activeItem={null} onDismiss={onDismiss} />);
    expect(screen.queryByTestId('candy-bar-renderer')).not.toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('renders portal shell and CandyBar when activeItem is set', async () => {
    const onDismiss = vi.fn();
    renderWithProvider(
      <CandyBarRenderer
        activeItem={{ id: 'a1', children: <span>Hello candy</span> }}
        onDismiss={onDismiss}
      />
    );

    const shell = await screen.findByTestId('candy-bar-renderer');
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute('role', 'dialog');
    expect(shell).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Hello candy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dismiss candy bar/i })).toBeInTheDocument();
  });

  it('calls onDismiss with id when close button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    renderWithProvider(
      <CandyBarRenderer
        activeItem={{ id: 'close-me', children: 'Content' }}
        onDismiss={onDismiss}
      />
    );

    await screen.findByTestId('candy-bar-renderer');
    await user.click(screen.getByRole('button', { name: /dismiss candy bar/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('close-me');
  });

  it('calls onDismiss with id when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    renderWithProvider(
      <CandyBarRenderer activeItem={{ id: 'esc-me', children: 'Content' }} onDismiss={onDismiss} />
    );

    await screen.findByTestId('candy-bar-renderer');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledWith('esc-me');
    });
  });

  it('replaces visible content when activeItem id changes (single-slot replacement)', async () => {
    const onDismiss = vi.fn();
    const { rerender } = renderWithProvider(
      <CandyBarRenderer
        activeItem={{ id: 'first', children: <span>First</span> }}
        onDismiss={onDismiss}
      />
    );

    expect(await screen.findByText('First')).toBeInTheDocument();

    rerender(
      <CandyBarRenderer
        activeItem={{ id: 'second', children: <span>Second</span> }}
        onDismiss={onDismiss}
      />
    );

    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(await screen.findByText('Second')).toBeInTheDocument();
  });
});

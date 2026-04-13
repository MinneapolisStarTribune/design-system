import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { CandyBar } from './CandyBar';

describe('CandyBar', () => {
  it('renders children', () => {
    renderWithProvider(
      <CandyBar onClose={vi.fn()}>
        <span>Notice content</span>
      </CandyBar>
    );

    expect(screen.getByText('Notice content')).toBeInTheDocument();
  });

  it('calls onClose when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(
      <CandyBar onClose={onClose}>
        <span>Content</span>
      </CandyBar>
    );

    await user.click(screen.getByRole('button', { name: /dismiss candy bar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses an accessible name on the dismiss control', () => {
    renderWithProvider(
      <CandyBar onClose={vi.fn()}>
        <span>Content</span>
      </CandyBar>
    );

    expect(screen.getByRole('button', { name: 'Dismiss candy bar' })).toBeInTheDocument();
  });
});

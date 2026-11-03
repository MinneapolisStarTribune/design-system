import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '@/components/Button/web/Button';
import buttonStyles from '@/components/Button/web/Button.module.scss';
import { DesignSystemProvider, DS_ROOT_THEME_ATTRIBUTE } from './DesignSystemProvider';

const root = document.documentElement;

describe('DesignSystemProvider data-theme', () => {
  afterEach(() => {
    root.removeAttribute(DS_ROOT_THEME_ATTRIBUTE);
  });

  it('sets data-theme on <html> from forceColorScheme and follows changes', () => {
    const { rerender } = render(
      <DesignSystemProvider brand="varsity" forceColorScheme="dark" disableFontInjection>
        <span />
      </DesignSystemProvider>
    );
    expect(root.getAttribute(DS_ROOT_THEME_ATTRIBUTE)).toBe('dark');

    rerender(
      <DesignSystemProvider brand="varsity" forceColorScheme="light" disableFontInjection>
        <span />
      </DesignSystemProvider>
    );
    expect(root.getAttribute(DS_ROOT_THEME_ATTRIBUTE)).toBe('light');
  });

  it('restores the previous data-theme on unmount', () => {
    root.setAttribute(DS_ROOT_THEME_ATTRIBUTE, 'light');
    const { unmount } = render(
      <DesignSystemProvider brand="varsity" forceColorScheme="dark" disableFontInjection>
        <span />
      </DesignSystemProvider>
    );
    expect(root.getAttribute(DS_ROOT_THEME_ATTRIBUTE)).toBe('dark');

    unmount();
    expect(root.getAttribute(DS_ROOT_THEME_ATTRIBUTE)).toBe('light');
  });

  it('leaves an app-managed data-theme alone when forceColorScheme is omitted', () => {
    root.setAttribute(DS_ROOT_THEME_ATTRIBUTE, 'dark');
    render(
      <DesignSystemProvider brand="varsity" disableFontInjection>
        <span />
      </DesignSystemProvider>
    );
    expect(root.getAttribute(DS_ROOT_THEME_ATTRIBUTE)).toBe('dark');
  });

  it.each(['light', 'dark'] as const)(
    'keeps surface button styles independent of the %s scheme',
    (scheme) => {
      const { getByTestId } = render(
        <DesignSystemProvider brand="varsity" forceColorScheme={scheme} disableFontInjection>
          <Button surface="dark" onClick={vi.fn()} data-testid="dark-surface">
            Dark
          </Button>
          <Button surface="light" onClick={vi.fn()} data-testid="light-surface">
            Light
          </Button>
        </DesignSystemProvider>
      );
      expect(getByTestId('dark-surface')).toHaveClass(buttonStyles.surfaceDark);
      expect(getByTestId('light-surface')).not.toHaveClass(buttonStyles.surfaceDark);
    }
  );
});

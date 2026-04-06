import { vi } from 'vitest';
import { UtilityButton } from './UtilityButton';
import { renderWithProvider } from '../../../test-utils/render';
import { Share02Icon } from '@/icons';

describe('UtilityButton', () => {
  it('renders', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton label="Share" onClick={vi.fn()} data-testid="utility-button" />
    );

    expect(getByTestId('utility-button')).toBeInTheDocument();
  });

  it('renders as type="button"', () => {
    const { getByRole } = renderWithProvider(<UtilityButton label="Share" onClick={vi.fn()} />);

    expect(getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('displays the label text', () => {
    const { getByText } = renderWithProvider(<UtilityButton label="Click me" onClick={vi.fn()} />);

    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('applies size class from size prop', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton label="Small" size="small" onClick={vi.fn()} data-testid="utility-button" />
    );

    const classNames = getByTestId('utility-button').className.split(/\s+/);
    expect(classNames.some((c) => c.includes('small'))).toBe(true);
  });

  it('defaults to large size', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton label="Large default" onClick={vi.fn()} data-testid="utility-button" />
    );

    const classNames = getByTestId('utility-button').className.split(/\s+/);
    expect(classNames.some((c) => c.includes('large'))).toBe(true);
  });

  it('applies default variant class', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton label="Default" onClick={vi.fn()} data-testid="utility-button" />
    );

    const classNames = getByTestId('utility-button').className.split(/\s+/);
    expect(classNames.some((c) => c.includes('default'))).toBe(true);
  });

  it('applies icon-only class when icon is present without label', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton
        icon={<Share02Icon />}
        aria-label="Share"
        onClick={vi.fn()}
        data-testid="utility-button"
      />
    );

    const classNames = getByTestId('utility-button').className.split(/\s+/);
    expect(classNames.some((c) => c.includes('icon-only'))).toBe(true);
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton
        label="Custom"
        className="custom-class"
        onClick={vi.fn()}
        data-testid="utility-button"
      />
    );

    expect(getByTestId('utility-button')).toHaveClass('custom-class');
  });

  it('renders an icon', () => {
    const { container } = renderWithProvider(
      <UtilityButton label="Share" icon={<Share02Icon />} onClick={vi.fn()} />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('places icon before label when iconPosition is start', () => {
    const { getByRole } = renderWithProvider(
      <UtilityButton label="Share" icon={<Share02Icon />} iconPosition="start" onClick={vi.fn()} />
    );

    const button = getByRole('button');
    const children = Array.from(button.children);
    expect(children[0]?.tagName.toLowerCase()).toBe('svg');
  });

  it('places icon after label when iconPosition is end', () => {
    const { getByRole } = renderWithProvider(
      <UtilityButton label="Share" icon={<Share02Icon />} iconPosition="end" onClick={vi.fn()} />
    );

    const button = getByRole('button');
    const children = Array.from(button.children);
    expect(children[children.length - 1]?.tagName.toLowerCase()).toBe('svg');
  });

  it('sets aria-label from explicit aria-label over label text', () => {
    const { getByRole } = renderWithProvider(
      <UtilityButton label="Share" aria-label="Publish" icon={<Share02Icon />} onClick={vi.fn()} />
    );

    expect(getByRole('button', { name: 'Publish' })).toBeInTheDocument();
  });

  it('uses label as accessible name when no explicit aria-label', () => {
    const { getByRole } = renderWithProvider(<UtilityButton label="Share" onClick={vi.fn()} />);

    expect(getByRole('button', { name: 'Share' })).toBeInTheDocument();
  });

  it('is disabled when isDisabled is true', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton label="Off" isDisabled onClick={vi.fn()} data-testid="utility-button" />
    );

    expect(getByTestId('utility-button')).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = renderWithProvider(
      <UtilityButton label="Go" onClick={handleClick} data-testid="utility-button" />
    );

    getByTestId('utility-button').click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies toggle inactive class when active is false', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton
        label="Save"
        variant="toggle"
        active={false}
        onClick={vi.fn()}
        data-testid="utility-button"
      />
    );

    const classNames = getByTestId('utility-button').className.split(/\s+/);
    expect(classNames.some((c) => c.includes('toggleInactive'))).toBe(true);
  });

  it('applies toggle active class when active is true', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityButton
        label="Saved"
        variant="toggle"
        active
        onClick={vi.fn()}
        data-testid="utility-button"
      />
    );

    const classNames = getByTestId('utility-button').className.split(/\s+/);
    expect(classNames.some((c) => c.includes('toggleActive'))).toBe(true);
  });
});

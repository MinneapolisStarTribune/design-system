import { vi } from 'vitest';
import { Button } from './Button';
import { renderWithProvider } from '../../../test-utils/render';

describe('Button', () => {
  it('renders', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Button Label" onClick={vi.fn()} data-testid="button" />
    );

    expect(getByTestId('button')).toBeInTheDocument();
  });

  it('displays the label text', () => {
    const { getByText } = renderWithProvider(<Button label="Click me" onClick={vi.fn()} />);

    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('has correct size when passing in a size prop', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Small" onClick={vi.fn()} size="small" data-testid="button" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();

    // Button now uses CSS modules and design tokens for sizing.
    // CSS Modules generate hashed class names like `_button_xxx _small_xxx`.
    // Verify that at least one of the classes corresponds to the `small` size.
    const classNames = component.className.split(' ');
    expect(classNames.some((c) => c.includes('small'))).toBe(true);
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Custom" onClick={vi.fn()} className="custom-class" data-testid="button" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('custom-class');
  });

  it('renders with an icon', () => {
    const { container } = renderWithProvider(
      <Button label="With Icon" onClick={vi.fn()} icon="camera-filled" />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is disabled when isDisabled prop is true', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Disabled" onClick={vi.fn()} isDisabled data-testid="button" />
    );

    const component = getByTestId('button');

    expect(component).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = renderWithProvider(
      <Button label="Clickable" onClick={handleClick} data-testid="button" />
    );

    const component = getByTestId('button');
    component.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

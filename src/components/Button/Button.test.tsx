import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders', () => {
    const { getByTestId } = render(<Button label="Button Label" onClick={vi.fn()} />);

    expect(getByTestId('button')).toBeInTheDocument();
  });

  it('renders nothing when label is empty', () => {
    const { container } = render(<Button label="" onClick={vi.fn()} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders as a link when as and href are provided', () => {
    const MockLink = ({
      href,
      children,
      ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a href={href} {...rest}>
        {children}
      </a>
    );
    const { getByTestId } = render(
      <Button label="Link Button" as={MockLink} href="https://example.com" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveAttribute('href', 'https://example.com');
  });

  it('displays the label text', () => {
    const { getByText } = render(<Button label="Click me" onClick={vi.fn()} />);

    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('has correct color when passing in a color prop', () => {
    const { getByTestId } = render(
      <Button label="Neutral" onClick={vi.fn()} variant="filled" color="neutral" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('ds:bg-[var(--color-button-filled-background)]');
    expect(component).toHaveClass('ds:text-[var(--color-button-filled-text)]');
  });

  it('has correct size when passing in a size prop', () => {
    const { getByTestId } = render(<Button label="Small" onClick={vi.fn()} size="small" />);

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('ds:text-[12px]');
    expect(component).toHaveClass('ds:h-button-sm');
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <Button label="Custom" onClick={vi.fn()} className="custom-class" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('custom-class');
  });

  it('renders with an icon', () => {
    const { container } = render(
      <Button label="With Icon" onClick={vi.fn()} icon="camera-filled" />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is disabled when isDisabled prop is true', () => {
    const { getByTestId } = render(<Button label="Disabled" onClick={vi.fn()} isDisabled />);

    const component = getByTestId('button');

    expect(component).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(<Button label="Clickable" onClick={handleClick} />);

    const component = getByTestId('button');
    component.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

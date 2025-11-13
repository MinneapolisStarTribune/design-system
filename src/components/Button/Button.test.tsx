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
      <Button label="Green" onClick={vi.fn()} variant="primary" color="green" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('ds:text-base-black');
  });

  it('has correct size when passing in a size prop', () => {
    const { getByTestId } = render(<Button label="Small" onClick={vi.fn()} size="sm" />);

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('ds:text-xs');
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
    const icon = <svg data-testid="test-icon" />;
    const { getByTestId } = render(<Button label="With Icon" onClick={vi.fn()} icon={icon} />);

    expect(getByTestId('test-icon')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByTestId } = render(<Button label="Disabled" onClick={vi.fn()} disabled />);

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

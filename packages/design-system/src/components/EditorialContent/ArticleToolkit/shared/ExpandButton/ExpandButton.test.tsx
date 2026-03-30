import { renderWithProvider } from '@/test-utils/render';
import { ExpandButton } from './ExpandButton';
import { fireEvent } from '@testing-library/react';

describe('ExpandButton', () => {
  const testId = 'expand-button';

  const setup = (props = {}) => {
    const onClick = vi.fn();

    const utils = renderWithProvider(
      <ExpandButton onClick={onClick} dataTestId={testId} {...props} />
    );

    const button = utils.getByTestId(testId);

    return { ...utils, button, onClick };
  };

  it('should render the button', () => {
    const { button } = setup();

    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should render expand icon', () => {
    const { container } = setup();

    const iconWrapper = container.querySelector('span');

    expect(iconWrapper).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const { button, onClick } = setup();

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have default aria-label', () => {
    const { button } = setup();

    expect(button).toHaveAttribute('aria-label', 'Expand image');
  });

  it('should accept custom aria-label', () => {
    const { button } = setup({ ariaLabel: 'Expand gallery image' });

    expect(button).toHaveAttribute('aria-label', 'Expand gallery image');
  });
});

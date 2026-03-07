import { FormGroupCaption } from './FormGroup.Caption';
import { FormGroupProvider } from './FormGroupContext';
import { renderWithProvider } from '@/test-utils/render';

describe('FormGroupCaption', () => {
  it('renders with required props', () => {
    const { getByText } = renderWithProvider(
      <FormGroupCaption variant="info">Caption text</FormGroupCaption>
    );

    expect(getByText('Caption text')).toBeInTheDocument();
  });

  it('renders children correctly for each variant', () => {
    const variants = ['info', 'error', 'success'] as const;

    variants.forEach((variant) => {
      const { getByText, unmount } = renderWithProvider(
        <FormGroupCaption variant={variant}>{`${variant} message`}</FormGroupCaption>
      );
      expect(getByText(`${variant} message`)).toBeInTheDocument();
      unmount();
    });
  });

  it('applies id when provided', () => {
    const { getByText } = renderWithProvider(
      <FormGroupCaption variant="info" id="custom-caption-id">
        Caption
      </FormGroupCaption>
    );

    const caption = getByText('Caption').closest('div');
    expect(caption).toHaveAttribute('id', 'custom-caption-id');
  });

  it('uses captionId from context when id prop is not provided', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel hasDescription hasCaption>
        <FormGroupCaption variant="info">Caption from context</FormGroupCaption>
      </FormGroupProvider>
    );

    const caption = getByText('Caption from context').closest('div');
    expect(caption).toHaveAttribute('id');
    expect(caption?.id).toMatch(/^caption-/);
  });

  it('prefers id prop over context captionId', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel hasDescription hasCaption>
        <FormGroupCaption variant="info" id="explicit-id">
          Caption
        </FormGroupCaption>
      </FormGroupProvider>
    );

    const caption = getByText('Caption').closest('div');
    expect(caption).toHaveAttribute('id', 'explicit-id');
  });

  it('has role="alert" when variant is error', () => {
    const { getByText } = renderWithProvider(
      <FormGroupCaption variant="error">Error message</FormGroupCaption>
    );

    const caption = getByText('Error message').closest('div');
    expect(caption).toHaveAttribute('role', 'alert');
  });

  it('does not have role when variant is info', () => {
    const { getByText } = renderWithProvider(
      <FormGroupCaption variant="info">Info message</FormGroupCaption>
    );

    const caption = getByText('Info message').closest('div');
    expect(caption).not.toHaveAttribute('role');
  });

  it('does not have role when variant is success', () => {
    const { getByText } = renderWithProvider(
      <FormGroupCaption variant="success">Success message</FormGroupCaption>
    );

    const caption = getByText('Success message').closest('div');
    expect(caption).not.toHaveAttribute('role');
  });

  it('applies dataTestId when provided', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupCaption variant="info" dataTestId="caption-test">
        Caption
      </FormGroupCaption>
    );

    expect(getByTestId('caption-test')).toBeInTheDocument();
    expect(getByTestId('caption-test')).toHaveTextContent('Caption');
  });

  it('applies typography class', () => {
    const { getByText } = renderWithProvider(
      <FormGroupCaption variant="info">Caption</FormGroupCaption>
    );

    const caption = getByText('Caption').closest('div');
    expect(caption).toHaveClass('typography-utility-text-regular-x-small');
  });

  it('renders an icon for each variant', () => {
    const { container } = renderWithProvider(
      <FormGroupCaption variant="info">Info caption</FormGroupCaption>
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

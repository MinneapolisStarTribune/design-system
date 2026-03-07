import { FormGroupLabel } from './FormGroup.Label';
import { FormGroupProvider } from './FormGroupContext';
import { renderWithProvider } from '@/test-utils/render';

describe('FormGroupLabel', () => {
  it('renders with required props', () => {
    const { getByText } = renderWithProvider(
      <FormGroupLabel dataTestId="form-group-label">Email address</FormGroupLabel>
    );

    expect(getByText('Email address')).toBeInTheDocument();
  });

  it('applies dataTestId to the label element', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupLabel dataTestId="form-group-label">Label text</FormGroupLabel>
    );

    expect(getByTestId('form-group-label')).toBeInTheDocument();
    expect(getByTestId('form-group-label')).toHaveTextContent('Label text');
  });

  it('uses id and htmlFor when provided', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupLabel id="email-label" htmlFor="email-input" dataTestId="label">
        Email
      </FormGroupLabel>
    );

    const label = getByTestId('label');
    expect(label).toHaveAttribute('id', 'email-label');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('shows (Optional) when optional is true', () => {
    const { getByText } = renderWithProvider(
      <FormGroupLabel optional dataTestId="label">
        Optional field
      </FormGroupLabel>
    );

    expect(getByText('(Optional)')).toBeInTheDocument();
  });

  it('does not show (Optional) when optional is false', () => {
    const { queryByText } = renderWithProvider(
      <FormGroupLabel optional={false} dataTestId="label">
        Required field
      </FormGroupLabel>
    );

    expect(queryByText('(Optional)')).not.toBeInTheDocument();
  });

  it('uses context labelId and inputId when inside FormGroupProvider', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
        <FormGroupLabel dataTestId="label">Context label</FormGroupLabel>
      </FormGroupProvider>
    );

    const label = getByText('Context label');
    expect(label).toHaveAttribute('id');
    expect(label.getAttribute('id')).toMatch(/^label-/);
    expect(label).toHaveAttribute('for');
  });

  it('prop id overrides context labelId when both are present', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
        <FormGroupLabel id="custom-id" dataTestId="label">
          Label
        </FormGroupLabel>
      </FormGroupProvider>
    );

    expect(getByTestId('label')).toHaveAttribute('id', 'custom-id');
  });

  it('prop htmlFor overrides context inputId when both are present', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
        <FormGroupLabel htmlFor="custom-input" dataTestId="label">
          Label
        </FormGroupLabel>
      </FormGroupProvider>
    );

    expect(getByTestId('label')).toHaveAttribute('for', 'custom-input');
  });
});

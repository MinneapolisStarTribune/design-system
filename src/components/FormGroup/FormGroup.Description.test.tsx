import { FormGroupDescription } from './FormGroup.Description';
import { FormGroupProvider } from './FormGroupContext';
import { renderWithProvider } from '@/test-utils/render';

describe('FormGroupDescription', () => {
  it('renders children', () => {
    const { getByText } = renderWithProvider(
      <FormGroupDescription>Helpful description</FormGroupDescription>
    );

    expect(getByText('Helpful description')).toBeInTheDocument();
  });

  it('applies dataTestId to the description element', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupDescription dataTestId="form-group-description">
        Description text
      </FormGroupDescription>
    );

    const el = getByTestId('form-group-description');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Description text');
  });

  it('uses context descriptionId when inside FormGroupProvider', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
        <FormGroupDescription>Context description</FormGroupDescription>
      </FormGroupProvider>
    );

    const el = getByText('Context description');
    expect(el).toHaveAttribute('id');
    expect(el.getAttribute('id')).toMatch(/^description-/);
  });

  it('prop id overrides context descriptionId when both are present', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
        <FormGroupDescription id="custom-description-id">
          Custom id description
        </FormGroupDescription>
      </FormGroupProvider>
    );

    const el = getByText('Custom id description');
    expect(el).toHaveAttribute('id', 'custom-description-id');
  });
});


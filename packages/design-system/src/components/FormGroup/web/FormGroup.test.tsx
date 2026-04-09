import { screen } from '@testing-library/react';
import { renderWithProvider } from '@/test-utils/render';
import { useFormGroupContext } from '../FormGroupContext';
import { FormGroup } from './FormGroup';

const ContextProbe = () => {
  const c = useFormGroupContext();
  return (
    <>
      <span data-testid="ctx-has-error">{String(c?.hasError)}</span>
      <span data-testid="ctx-has-success">{String(c?.hasSuccess)}</span>
    </>
  );
};

describe('FormGroup', () => {
  it('passes caption variant from FormGroup.Caption into context', () => {
    const { rerender } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Field</FormGroup.Label>
        <ContextProbe />
        <FormGroup.Caption variant="error">Error</FormGroup.Caption>
      </FormGroup>
    );

    expect(screen.getByTestId('ctx-has-error')).toHaveTextContent('true');
    expect(screen.getByTestId('ctx-has-success')).toHaveTextContent('false');

    rerender(
      <FormGroup>
        <FormGroup.Label>Field</FormGroup.Label>
        <ContextProbe />
        <FormGroup.Caption variant="success">OK</FormGroup.Caption>
      </FormGroup>
    );

    expect(screen.getByTestId('ctx-has-error')).toHaveTextContent('false');
    expect(screen.getByTestId('ctx-has-success')).toHaveTextContent('true');
  });
});

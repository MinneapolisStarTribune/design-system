import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { renderWithProvider } from '../../../test-utils/render';

describe('ButtonGroup', () => {
  it('renders children inside a single group container', () => {
    const { getByTestId, getByText } = renderWithProvider(
      <ButtonGroup dataTestId="group">
        <Button onClick={() => undefined}>Alpha</Button>
        <Button onClick={() => undefined}>Beta</Button>
      </ButtonGroup>
    );

    expect(getByTestId('group')).toBeInTheDocument();
    expect(getByText('Alpha')).toBeInTheDocument();
    expect(getByText('Beta')).toBeInTheDocument();
  });

  it('merges className onto the container', () => {
    const { getByTestId } = renderWithProvider(
      <ButtonGroup dataTestId="group" className="custom-group">
        <Button onClick={() => undefined}>X</Button>
      </ButtonGroup>
    );

    expect(getByTestId('group')).toHaveClass('custom-group');
  });
});

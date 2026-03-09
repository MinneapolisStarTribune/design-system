import { renderWithProvider } from '@/test-utils/render';
import { UtilityBody } from './UtilityBody';

describe('UtilityBody', () => {
  it('renders utility body text', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityBody dataTestId="utility-body">Utility body text</UtilityBody>
    );

    expect(getByTestId('utility-body')).toHaveTextContent('Utility body text');
  });

  it('applies typography class for provided size and weight', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityBody size="x-large" weight="semibold" dataTestId="utility-body">
        Utility body text
      </UtilityBody>
    );

    expect(getByTestId('utility-body')).toHaveClass('typography-utility-text-semibold-x-large');
  });
});

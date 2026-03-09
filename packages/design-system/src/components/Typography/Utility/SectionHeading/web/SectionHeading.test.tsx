import { renderWithProvider } from '@/test-utils/render';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders the expected heading tag', () => {
    const { getByTestId } = renderWithProvider(
      <SectionHeading importance={2} dataTestId="section-heading">
        Section heading
      </SectionHeading>
    );

    expect(getByTestId('section-heading').tagName).toBe('H2');
  });

  it('applies typography class by importance', () => {
    const { getByTestId } = renderWithProvider(
      <SectionHeading importance={5} dataTestId="section-heading">
        Section heading
      </SectionHeading>
    );

    expect(getByTestId('section-heading')).toHaveClass('typography-utility-section-h5');
  });
});

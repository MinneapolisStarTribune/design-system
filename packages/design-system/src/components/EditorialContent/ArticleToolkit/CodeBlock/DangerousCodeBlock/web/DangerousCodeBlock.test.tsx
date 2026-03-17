import { renderWithProvider } from '@/test-utils/render';
import { DangerousCodeBlock } from './DangerousCodeBlock';
import styles from './DangerousCodeBlock.module.scss';

describe('DangerousCodeBlock', () => {
  const markup = '<div data-testid="inner-content">DangerousCodeBlock</div>';

  it('renders injected markup', () => {
    const { getByTestId } = renderWithProvider(<DangerousCodeBlock markup={markup} />);

    const el = getByTestId('inner-content');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('DangerousCodeBlock');
  });

  it('applies standard variant by default', () => {
    const { getByTestId } = renderWithProvider(<DangerousCodeBlock markup={markup} />);

    const wrapper = getByTestId('dangerous-code-block');

    expect(wrapper).toHaveClass(styles['variant-standard']);
  });

  it('applies immersive variant', () => {
    const { getByTestId } = renderWithProvider(
      <DangerousCodeBlock markup={markup} variant="immersive" />
    );

    const wrapper = getByTestId('dangerous-code-block');

    expect(wrapper).toHaveClass(styles['variant-immersive']);
  });

  it('renders with custom dataTestId', () => {
    const { getByTestId } = renderWithProvider(
      <DangerousCodeBlock markup={markup} dataTestId="custom-code-block" />
    );

    const wrapper = getByTestId('custom-code-block');

    expect(wrapper).toBeInTheDocument();
  });

  it('cleans smart quotes when cleanQuotes=true', () => {
    const markup = `<div>“Hello”</div>`;
    const { container } = renderWithProvider(<DangerousCodeBlock markup={markup} cleanQuotes />);

    expect(container.innerHTML).toContain('"Hello"');
  });

  it('renders script tags in markup', () => {
    const scriptMarkup = `
      <div id="test-script">Test</div>
      <script>window.__TEST_SCRIPT__ = true;</script>
    `;

    renderWithProvider(<DangerousCodeBlock markup={scriptMarkup} />);

    const scripts = document.querySelectorAll('script');

    expect(scripts.length).toBeGreaterThan(0);
  });
});

import { renderWithProvider } from '@/test-utils/render';
import { EnhancedCodeBlock } from './EnhancedCodeBlock';
import styles from './EnhancedCodeBlock.module.scss';

describe('EnhancedCodeBlock', () => {
  const markup = '<div data-testid="inner-content">EnhancedCodeBlock</div>';

  it('renders injected markup via DangerousCodeBlock', () => {
    const { getByTestId } = renderWithProvider(<EnhancedCodeBlock markup={markup} />);

    const el = getByTestId('inner-content');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('EnhancedCodeBlock');
  });

  it('applies base enhanced class', () => {
    const { getByTestId } = renderWithProvider(<EnhancedCodeBlock markup={markup} />);

    const wrapper = getByTestId('enhanced-code-block');

    expect(wrapper).toHaveClass(styles['enhanced-code-block']);
  });

  it('applies standard variant by default', () => {
    const { getByTestId } = renderWithProvider(<EnhancedCodeBlock markup={markup} />);

    const wrapper = getByTestId('enhanced-code-block');

    expect(wrapper).toHaveClass(styles['variant-standard']);
  });

  it('applies immersive variant', () => {
    const { getByTestId } = renderWithProvider(
      <EnhancedCodeBlock markup={markup} variant="immersive" />
    );

    const wrapper = getByTestId('enhanced-code-block');

    expect(wrapper).toHaveClass(styles['variant-immersive']);
  });

  it('applies size class when cleanQuotes=false', () => {
    const { getByTestId } = renderWithProvider(
      <EnhancedCodeBlock markup={markup} size="large" cleanQuotes={false} />
    );

    const wrapper = getByTestId('enhanced-code-block');

    expect(wrapper).toHaveClass(styles['size-large']);
  });

  it('does not apply size class when cleanQuotes=true', () => {
    const { getByTestId } = renderWithProvider(
      <EnhancedCodeBlock markup={markup} size="large" cleanQuotes={true} />
    );

    const wrapper = getByTestId('enhanced-code-block');

    expect(wrapper).not.toHaveClass(styles['size-large']);
  });

  it('forwards custom dataTestId', () => {
    const { getByTestId } = renderWithProvider(
      <EnhancedCodeBlock markup={markup} dataTestId="custom-enhanced-code-block" />
    );

    const wrapper = getByTestId('custom-enhanced-code-block');

    expect(wrapper).toBeInTheDocument();
  });

  it('clean smart quotes when cleanQuotes=true', () => {
    const markup = `<div>“Enhanced”</div>`;

    const { container } = renderWithProvider(<EnhancedCodeBlock markup={markup} cleanQuotes />);

    expect(container.innerHTML).toContain('"Enhanced"');
  });

  it('renders script tags in markup via DangerousCodeBlock', () => {
    const scriptMarkup = `
      <div id="test-script">Test</div>
      <script>window.__ENHANCED_TEST__ = true;</script>
    `;

    renderWithProvider(<EnhancedCodeBlock markup={scriptMarkup} />);

    const scripts = document.querySelectorAll('script');

    expect(scripts.length).toBeGreaterThan(0);
  });
});

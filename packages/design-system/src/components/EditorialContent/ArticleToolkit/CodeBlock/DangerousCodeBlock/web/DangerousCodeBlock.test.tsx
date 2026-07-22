import { renderToStaticMarkup } from 'react-dom/server';
import { renderWithProvider } from '@/test-utils/render';
import { DangerousCodeBlock } from './DangerousCodeBlock';
import { DEFERRED_SCRIPT_TYPE } from '../DangerousCodeBlock.utils';
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

  it('keeps scripts inert in server-rendered HTML so the browser skips them on parse', () => {
    const html = renderToStaticMarkup(
      <DangerousCodeBlock markup={`<script>window.__RAN__ = true;</script>`} />
    );

    expect(html).toContain(`type="${DEFERRED_SCRIPT_TYPE}"`);
    // No live <script> the browser would execute while parsing the page.
    expect(html).not.toMatch(/<script(?![^>]*x-deferred-script)/i);
  });

  it('activates scripts on the client after mount', () => {
    const scriptMarkup = `<div id="chart"></div><script>window.__RAN__ = true;</script>`;
    const { getByTestId } = renderWithProvider(<DangerousCodeBlock markup={scriptMarkup} />);

    const wrapper = getByTestId('dangerous-code-block');

    // The inert marker is gone and a real script with its original type is in its place.
    expect(wrapper.querySelector(`script[type="${DEFERRED_SCRIPT_TYPE}"]`)).toBeNull();
    expect(wrapper.querySelector('script')?.type).toBe('text/javascript');
  });
});
